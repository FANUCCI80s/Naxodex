
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { sendEmail } from "@/lib/email/send";
import { getAdminMessageEmail } from "@/lib/email/templates/admin-message";

export async function GET() {
  try {
    const admin = await requireAdmin();

    const messages = await prisma.directMessage.findMany({
      where: {
        senderId: admin.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    const users = await prisma.user.findMany({
      where: {
        role: "USER",
      },
      orderBy: [
        {
          firstName: "asc",
        },
        {
          lastName: "asc",
        },
      ],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
      },
    });

    return NextResponse.json({
      success: true,
      users,
      messages,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/messages error:",
      error
    );

    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json(
          {
            success: false,
            error: "You must be logged in.",
          },
          { status: 401 }
        );
      }

      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          {
            success: false,
            error: "Administrator access is required.",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load messages.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    /*
     * The administrator is obtained from the authenticated session.
     * senderId is never accepted from the browser.
     */
    const admin = await requireAdmin();

    const body = await request.json();

    const recipientId =
      typeof body.recipientId === "string"
        ? body.recipientId.trim()
        : "";

    const subject =
      typeof body.subject === "string"
        ? body.subject.trim()
        : "";

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!recipientId) {
      return NextResponse.json(
        {
          success: false,
          error: "Recipient is required.",
        },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is required.",
        },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          error: "Message cannot exceed 5000 characters.",
        },
        { status: 400 }
      );
    }

    if (subject.length > 200) {
      return NextResponse.json(
        {
          success: false,
          error: "Subject cannot exceed 200 characters.",
        },
        { status: 400 }
      );
    }

    /*
     * Make sure the selected recipient is an actual USER.
     */
    const recipient = await prisma.user.findFirst({
      where: {
        id: recipientId,
        role: "USER",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!recipient) {
      return NextResponse.json(
        {
          success: false,
          error: "The selected user could not be found.",
        },
        { status: 404 }
      );
    }

    /*
     * Create the direct message, notification and activity
     * together.
     */
    const result = await prisma.$transaction(
      async (tx) => {
        const directMessage =
          await tx.directMessage.create({
            data: {
              senderId: admin.id,
              recipientId: recipient.id,
              subject: subject || null,
              message,
            },
            include: {
              recipient: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          });

        const notification =
          await tx.notification.create({
            data: {
              userId: recipient.id,
              type: "MESSAGE",
              title:
                subject ||
                "New message from NAXODEX",
              message:
                subject ||
                "You have received a new message from NAXODEX.",
            },
          });

        const activity =
          await tx.accountActivity.create({
            data: {
              userId: recipient.id,
              type: "ADMIN_MESSAGE_SENT",
              description: subject
                ? `Administrator sent you a message: ${subject}`
                : "Administrator sent you a new direct message.",
              metadata: {
                messageId: directMessage.id,
                adminId: admin.id,
                subject: subject || null,
              },
            },
          });

        return {
          directMessage,
          notification,
          activity,
        };
      }
    );

    /*
     * ------------------------------------------------------------
     * EMAIL DELIVERY
     * ------------------------------------------------------------
     *
     * The recipient email comes directly from the registered
     * user record in the database.
     *
     * Email delivery happens AFTER the database transaction.
     *
     * Therefore:
     *
     * Message saved       ✓
     * Notification saved  ✓
     * Activity saved      ✓
     * Email attempted     ✓
     *
     * If Hostinger fails temporarily, the in-app message is
     * still preserved.
     */

    let emailSent = false;
    let emailError: string | null = null;

    try {
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL?.replace(
          /\/$/,
          ""
        );

      const logoUrl = appUrl
        ? `${appUrl}/branding/NAXODEX-logo.png`
        : undefined;

      const email = getAdminMessageEmail({
        firstName:
          recipient.firstName || "there",
        subject:
          subject ||
          "New message from NAXODEX",
        message,
        logoUrl,
      });

      await sendEmail({
        to: recipient.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      });

      emailSent = true;
    } catch (error) {
      emailError =
        error instanceof Error
          ? error.message
          : "Unable to send email.";

      console.error(
        "Admin message email delivery error:",
        error
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: emailSent
          ? "Message sent successfully."
          : "Message sent successfully, but the email could not be delivered.",
        emailSent,
        emailError,
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/admin/messages error:",
      error
    );

    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json(
          {
            success: false,
            error: "You must be logged in.",
          },
          { status: 401 }
        );
      }

      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          {
            success: false,
            error: "Administrator access is required.",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unable to send message.",
      },
      { status: 500 }
    );
  }
}

