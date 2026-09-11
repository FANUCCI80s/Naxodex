
import { domainToASCII } from "node:url";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createLoginOtp } from "@/lib/auth/otp";
import { createSession } from "@/lib/auth/session";
import { sendEmail } from "@/lib/email/send";
import { loginOtpEmail } from "@/lib/email/templates";

function normalizeEmail(
  email: string
): string {
  const value =
    email.trim().toLowerCase();

  const atIndex =
    value.lastIndexOf("@");

  if (
    atIndex <= 0 ||
    atIndex === value.length - 1
  ) {
    return value;
  }

  const localPart =
    value.slice(0, atIndex);

  const domain =
    value.slice(atIndex + 1);

  const asciiDomain =
    domainToASCII(domain);

  if (!asciiDomain) {
    return value;
  }

  return `${localPart}@${asciiDomain}`;
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const email =
      typeof body.email === "string"
        ? normalizeEmail(body.email)
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          kyc: true,
        },
      });

    console.log(
      `User found: ${Boolean(user)}`
    );

    if (!user) {
      console.log(
        "LOGIN RESULT: USER NOT FOUND"
      );
      console.log(
        "======================================"
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    console.log(
      `User ID: ${user.id}`
    );

    console.log(
      `Role: ${user.role}`
    );

    console.log(
      `Status: ${user.status}`
    );

    const passwordValid =
      await verifyPassword(
        password,
        user.passwordHash
      );

    console.log(
      `Password valid: ${passwordValid}`
    );

    if (!passwordValid) {
      console.log(
        "LOGIN RESULT: INVALID PASSWORD"
      );
      console.log(
        "======================================"
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    if (user.status === "BLOCKED") {
      console.log(
        "LOGIN RESULT: ACCOUNT BLOCKED"
      );
      console.log(
        "======================================"
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Your account has been blocked.",
        },
        {
          status: 403,
        }
      );
    }

    if (user.status === "SUSPENDED") {
      console.log(
        "LOGIN RESULT: ACCOUNT SUSPENDED"
      );
      console.log(
        "======================================"
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Your account is currently suspended.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * ADMIN LOGIN
     *
     * Admin accounts do not require OTP.
     * Once the email and password are verified,
     * create the authenticated session immediately.
     */
    if (user.role === "ADMIN") {
      console.log(
        "ADMIN LOGIN: OTP BYPASSED"
      );

      const userAgent =
        request.headers.get(
          "user-agent"
        ) ?? undefined;

      const forwardedFor =
        request.headers.get(
          "x-forwarded-for"
        );

      const ipAddress =
        forwardedFor
          ?.split(",")[0]
          ?.trim() ?? undefined;

      await createSession(
        user.id,
        ipAddress,
        userAgent
      );

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          lastLoginAt: new Date(),
          lastLoginIp: ipAddress,
        },
      });

      console.log(
        "ADMIN LOGIN RESULT: SUCCESS"
      );
      console.log(
        "ADMIN REDIRECT: /admin"
      );
      console.log(
        "======================================"
      );

      return NextResponse.json({
        success: true,
        otpRequired: false,
        redirectTo: "/admin",
        message:
          "Admin login successful.",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    }

    /*
     * USER LOGIN
     *
     * Regular users continue to use the existing
     * email OTP verification flow.
     */
    console.log(
      "Creating login OTP..."
    );

    const otp =
      await createLoginOtp(
        user.id
      );

    console.log(
      "OTP created successfully."
    );

    const emailContent =
      loginOtpEmail(
        user.firstName,
        otp.code
      );

    console.log(
      `Sending OTP email to: ${user.email}`
    );

    await sendEmail({
      to: user.email,
      subject:
        emailContent.subject,
      html:
        emailContent.html,
      text:
        emailContent.text,
    });

    console.log(
      "OTP email sent successfully."
    );

    console.log(
      "LOGIN RESULT: OTP REQUIRED"
    );
    console.log(
      "======================================"
    );

    return NextResponse.json({
      success: true,
      otpRequired: true,
      message:
        "A verification code has been sent to your email.",
    });
  } catch (error) {
    console.error("");
    console.error(
      "======================================"
    );
    console.error(
      "NAXODEX LOGIN ERROR"
    );
    console.error(
      "======================================"
    );
    console.error(error);
    console.error(
      "======================================"
    );
    console.error("");

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to complete login.",
      },
      {
        status: 500,
      }
    );
  }
}

