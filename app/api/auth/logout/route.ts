
import { NextResponse } from "next/server";
import { destroySession, getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (user) {
      try {
        const userAgent = request.headers.get("user-agent") ?? undefined;

        const forwardedFor = request.headers.get("x-forwarded-for");

        const ipAddress =
          forwardedFor?.split(",")[0]?.trim() ?? undefined;

        await prisma.accountActivity.create({
          data: {
            userId: user.id,
            type: "LOGOUT",
            description:
              "You logged out of your NAXODEX account.",
            ipAddress,
            userAgent,
          },
        });
      } catch (activityError) {
        console.error(
          "Logout activity logging failed:",
          activityError
        );
      }
    }

    await destroySession();

    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to log out. Please try again.",
      },
      { status: 500 }
    );
  }
}