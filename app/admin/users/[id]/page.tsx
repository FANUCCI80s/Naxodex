import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/auth/guards";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusClass(status: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-gold/10 text-gold";

    case "BLOCKED":
    case "SUSPENDED":
      return "bg-red-400/10 text-red-400";

    case "PENDING":
      return "bg-yellow-400/10 text-yellow-400";

    default:
      return "bg-white/10 text-zinc-400";
  }
}

function kycClass(status?: string | null) {
  switch (status) {
    case "APPROVED":
      return "bg-gold/10 text-gold";

    case "REJECTED":
      return "bg-red-400/10 text-red-400";

    case "PENDING":
      return "bg-yellow-400/10 text-yellow-400";

    default:
      return "bg-white/10 text-zinc-500";
  }
}

export default async function AdminUserDetailsPage({
  params,
}: PageProps) {
  await requireAdminPage();

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      createdAt: true,

      kyc: {
        select: {
          status: true,
        },
      },

      balance: {
        select: {
          available: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "Unnamed user";

  const initials = (
    user.firstName ||
    user.email ||
    "U"
  )
    .charAt(0)
    .toUpperCase();

  const availableBalance = user.balance
    ? Number(user.balance.available)
    : 0;

  const kycStatus = user.kyc?.status || "NOT SUBMITTED";

  return (
    <main className="min-h-screen bg-[#050505] !text-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        {/* Back */}
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:!text-[#FFFFFF]"
        >
          ← Back to Users
        </Link>

        {/* Header */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-xl font-bold text-gold">
                {initials}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {fullName}
                  </h1>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </div>

                <p className="mt-2 break-all text-sm !text-[#FFFFFF]">
                  {user.email}
                </p>

                <p className="mt-2 text-xs !text-[#FFFFFF]">
                  User ID: {user.id}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/users"
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-300 transition hover:border-gold/30 hover:!text-[#FFFFFF]"
              >
                All Users
              </Link>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm !text-[#FFFFFF]">
              Available balance
            </p>

            <p className="mt-3 text-3xl font-bold text-gold">
              {formatCurrency(availableBalance)}
            </p>

            <p className="mt-2 text-xs !text-[#FFFFFF]">
              Current available funds
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm !text-[#FFFFFF]">
              Account status
            </p>

            <span
              className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${statusClass(
                user.status
              )}`}
            >
              {user.status}
            </span>

            <p className="mt-3 text-xs !text-[#FFFFFF]">
              Current account state
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm !text-[#FFFFFF]">
              KYC status
            </p>

            <span
              className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${kycClass(
                user.kyc?.status
              )}`}
            >
              {kycStatus}
            </span>

            <p className="mt-3 text-xs !text-[#FFFFFF]">
              Identity verification
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm !text-[#FFFFFF]">
              Account role
            </p>

            <p className="mt-4 text-xl font-bold">
              {user.role}
            </p>

            <p className="mt-2 text-xs !text-[#FFFFFF]">
              User permission level
            </p>
          </div>
        </section>

        {/* User Information */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div>
              <p className="text-sm !text-[#FFFFFF]">
                Account information
              </p>

              <h2 className="mt-1 text-xl font-bold">
                User profile
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs !text-[#FFFFFF]">
                  Full name
                </p>

                <p className="mt-2 text-sm font-bold">
                  {fullName}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs !text-[#FFFFFF]">
                  Email address
                </p>

                <p className="mt-2 break-all text-sm font-bold">
                  {user.email}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs !text-[#FFFFFF]">
                  User ID
                </p>

                <p className="mt-2 break-all font-mono text-xs !text-[#FFFFFF]">
                  {user.id}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs !text-[#FFFFFF]">
                  Registered
                </p>

                <p className="mt-2 text-sm font-bold">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div>
              <p className="text-sm !text-[#FFFFFF]">
                Administration
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Account management
              </h2>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold">
                      Account status
                    </p>

                    <p className="mt-1 text-xs !text-[#FFFFFF]">
                      Current status of this account
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold">
                      KYC verification
                    </p>

                    <p className="mt-1 text-xs !text-[#FFFFFF]">
                      Identity verification status
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${kycClass(
                      user.kyc?.status
                    )}`}
                  >
                    {kycStatus}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm font-bold">
                  Available balance
                </p>

                <p className="mt-2 text-2xl font-bold text-gold">
                  {formatCurrency(availableBalance)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Admin Actions */}
        <section className="mt-6 rounded-3xl border border-yellow-400/10 bg-yellow-400/[0.03] p-6 sm:p-8">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
              !
            </div>

            <div>
              <h2 className="font-bold text-yellow-300">
                Admin controls
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 !text-[#FFFFFF]">
                This user profile is now connected to the
                registered user database. Additional
                administrative controls such as editing
                balances, approving KYC, blocking trading,
                sending messages, and managing deposits and
                withdrawals can be added here.
              </p>
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-xs !text-[#FFFFFF]">
          NAXODEX • Admin • User Details
        </p>
      </div>
    </main>
  );
}