import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      where: {
        role: "USER",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        balance: {
          select: {
            id: true,
            available: true,
            locked: true,
            updatedAt: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Administrator access is required.",
        },
        { status: 403 }
      );
    }

    console.error("Admin balance GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load users.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const userId =
      "userId" in body &&
      typeof body.userId === "string"
        ? body.userId.trim()
        : "";

    const type =
      "type" in body &&
      typeof body.type === "string"
        ? body.type.trim().toUpperCase()
        : "";

    const amountValue =
      "amount" in body &&
      typeof body.amount === "string"
        ? body.amount.trim()
        : "amount" in body &&
            typeof body.amount === "number"
          ? String(body.amount)
          : "";

    const reason =
      "reason" in body &&
      typeof body.reason === "string"
        ? body.reason.trim()
        : "";

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User is required.",
        },
        { status: 400 }
      );
    }

    if (
      type !== "CREDIT" &&
      type !== "DEBIT"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Balance adjustment type must be CREDIT or DEBIT.",
        },
        { status: 400 }
      );
    }

    if (!amountValue) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount is required.",
        },
        { status: 400 }
      );
    }

    let amount: Prisma.Decimal;

    try {
      amount = new Prisma.Decimal(amountValue);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid amount.",
        },
        { status: 400 }
      );
    }

    if (!amount.isFinite()) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid amount.",
        },
        { status: 400 }
      );
    }

    if (amount.lessThanOrEqualTo(0)) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount must be greater than zero.",
        },
        { status: 400 }
      );
    }

    if (amount.decimalPlaces() > 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Amount cannot contain more than 8 decimal places.",
        },
        { status: 400 }
      );
    }

    if (!reason) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A reason is required for every balance adjustment.",
        },
        { status: 400 }
      );
    }

    if (reason.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The reason cannot exceed 2,000 characters.",
        },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(
      async (tx) => {
        const user = await tx.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            status: true,
          },
        });

        if (!user) {
          throw new Error("USER_NOT_FOUND");
        }

        if (user.role !== "USER") {
          throw new Error(
            "CANNOT_ADJUST_ADMIN_BALANCE"
          );
        }

        const balance = await tx.balance.upsert({
          where: {
            userId,
          },
          create: {
            userId,
            available: 0,
            locked: 0,
          },
          update: {},
        });

        const currentBalance =
          new Prisma.Decimal(balance.available);

        let newBalance: Prisma.Decimal;

        if (type === "CREDIT") {
          newBalance =
            currentBalance.plus(amount);
        } else {
          if (currentBalance.lessThan(amount)) {
            throw new Error(
              "INSUFFICIENT_BALANCE"
            );
          }

          newBalance =
            currentBalance.minus(amount);
        }

        const updatedBalance =
          await tx.balance.update({
            where: {
              userId,
            },
            data: {
              available: newBalance,
            },
          });

        const adjustment =
          await tx.balanceAdjustment.create({
            data: {
              adminId: admin.id,
              userId,
              type:
                type === "CREDIT"
                  ? "CREDIT"
                  : "DEBIT",
              amount,
              currency: "USD",
              reason,
            },
          });

        const transaction =
          await tx.transaction.create({
            data: {
              userId,
              type: "ADJUSTMENT",
              status: "COMPLETED",
              amount,
              currency: "USD",
              description:
                type === "CREDIT"
                  ? `Admin balance credit: ${reason}`
                  : `Admin balance debit: ${reason}`,
              reference: adjustment.id,
              completedAt: new Date(),
            },
          });

        await tx.accountActivity.create({
          data: {
            userId,
            type: "ADMIN_BALANCE_ADJUSTED",
            description:
              type === "CREDIT"
                ? `Your account balance was credited by $${amount.toFixed(2)}.`
                : `Your account balance was debited by $${amount.toFixed(2)}.`,
            metadata: {
              adjustmentId: adjustment.id,
              transactionId: transaction.id,
              type,
              amount: amount.toString(),
              previousBalance:
                currentBalance.toString(),
              newBalance:
                newBalance.toString(),
              reason,
              adminId: admin.id,
            },
          },
        });

        await tx.notification.create({
          data: {
            userId,
            type: "ACCOUNT",
            title:
              type === "CREDIT"
                ? "Balance credited"
                : "Balance adjusted",
            message:
              type === "CREDIT"
                ? `Your NAXODEX account has been credited with $${amount.toFixed(2)}. Your new available balance is $${newBalance.toFixed(2)}.`
                : `Your NAXODEX account has been debited by $${amount.toFixed(2)}. Your new available balance is $${newBalance.toFixed(2)}.`,
          },
        });

        return {
          user,
          adjustment,
          transaction,
          balance: updatedBalance,
          previousBalance: currentBalance,
          newBalance,
        };
      }
    );

    return NextResponse.json({
      success: true,
      message:
        type === "CREDIT"
          ? "User balance credited successfully."
          : "User balance debited successfully.",
      data: {
        user: result.user,
        adjustment: {
          id: result.adjustment.id,
          type: result.adjustment.type,
          amount: result.adjustment.amount,
          currency: result.adjustment.currency,
          reason: result.adjustment.reason,
          createdAt: result.adjustment.createdAt,
        },
        transaction: {
          id: result.transaction.id,
          type: result.transaction.type,
          status: result.transaction.status,
          amount: result.transaction.amount,
          currency: result.transaction.currency,
          createdAt: result.transaction.createdAt,
        },
        balance: {
          available: result.balance.available,
          locked: result.balance.locked,
          previousBalance:
            result.previousBalance,
          newBalance: result.newBalance,
        },
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Administrator access is required.",
        },
        { status: 403 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "USER_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "CANNOT_ADJUST_ADMIN_BALANCE"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Administrator balances cannot be adjusted from this page.",
        },
        { status: 400 }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "INSUFFICIENT_BALANCE"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The user does not have enough available balance for this debit.",
        },
        { status: 400 }
      );
    }

    console.error(
      "Admin balance adjustment error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to complete the balance adjustment.",
      },
      { status: 500 }
    );
  }
}
