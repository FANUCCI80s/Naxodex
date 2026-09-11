import { domainToASCII } from "node:url";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createPasswordResetOtp } from "@/lib/auth/otp";
import { sendEmail } from "@/lib/email/send";
import { passwordResetOtpEmail } from "@/lib/email/templates";

function normalizeEmail(email: string): string {
  const value = email.trim().toLowerCase();

  const atIndex = value.lastIndexOf("@");

  if (
    atIndex <= 0 ||
    atIndex === value.length - 1
  ) {
    return value;
  }

  const localPart = value.slice(0, atIndex);

  const domain = value.slice(atIndex + 1);

  const asciiDomain = domainToASCII(domain);

  if (!asciiDomain) {
    return value;
  }

  return `${localPart}@${asciiDomain}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? normalizeEmail(body.email)
        : "";

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        role: true,
        status: true,
      },
    });

    /*
     * Always return the same successful response when
     * the account does not exist or is not eligible.
     *
     * This prevents the endpoint from revealing whether
     * an email address belongs to a NAXODEX account.
     */
    if (
      !user ||
      user.role !== "USER" ||
      user.status === "BLOCKED" ||
      user.status === "SUSPENDED"
    ) {
      return NextResponse.json({
        success: true,
        message:
          "If an account exists for this email, a password reset code has been sent.",
      });
    }

    const otp = await createPasswordResetOtp(
      user.id
    );

    const emailContent = passwordResetOtpEmail(
      user.firstName,
      otp.code
    );

    await sendEmail({
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    return NextResponse.json({
      success: true,
      message:
        "If an account exists for this email, a password reset code has been sent.",
      expiresAt: otp.expiresAt,
    });
  } catch (error) {
    console.error(
      "Password reset request error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process the password reset request.",
      },
      {
        status: 500,
      }
    );
  }
}