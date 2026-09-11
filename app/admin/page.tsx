import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Check } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  const [
    totalUsers,
    activeUsers,
    pendingKyc,
    approvedKyc,
    declinedKyc,
    pendingDeposits,
    pendingWithdrawals,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        role: "USER",
      },
    }),

    prisma.user.count({
      where: {
        role: "USER",
        status: "ACTIVE",
      },
    }),

    prisma.kycVerification.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.kycVerification.count({
      where: {
        status: "APPROVED",
      },
    }),

    prisma.kycVerification.count({
      where: {
        status: "DECLINED",
      },
    }),

    prisma.depositRequest.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.withdrawalRequest.count({
      where: {
        status: "PENDING",
      },
    }),
  ]);

  const recentKyc =
    await prisma.kycVerification.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: {
        submittedAt: "asc",
      },
      take: 8,
      include: {
        user: true,
        idFrontFile: true,
        idBackFile: true,
      },
    });

  return (
    <main className="min-h-screen bg-[#050505] !text-[#FFFFFF]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-black/20 lg:flex lg:flex-col">
          {/* Logo */}
          <div className="border-b border-white/10 px-6 py-6">
            <Link
              href="/admin"
              className="flex items-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
                <img
                  src="/branding/NAXODEX-logo.png"
                  alt="NAXODEX"
                  className="h-8 w-auto object-contain"
                />
              </div>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/admin"
              className="flex items-center rounded-xl bg-gold/10 px-4 py-3 text-sm font-bold text-gold"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/kyc"
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              <span>KYC verification</span>

              {pendingKyc > 0 && (
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                  {pendingKyc}
                </span>
              )}
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              Users
            </Link>

            <Link
              href="/admin/deposits"
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              <span>Deposits</span>

              {pendingDeposits > 0 && (
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                  {pendingDeposits}
                </span>
              )}
            </Link>

            <Link
              href="/admin/withdrawals"
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              <span>Withdrawals</span>

              {pendingWithdrawals > 0 && (
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                  {pendingWithdrawals}
                </span>
              )}
            </Link>
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs !text-[#FFFFFF]">
                Signed in as
              </p>

              <p className="mt-1 truncate text-sm font-bold">
                {admin.firstName} {admin.lastName}
              </p>

              <p className="mt-1 truncate text-xs !text-[#FFFFFF]">
                {admin.email}
              </p>
            </div>

            <Link
              href="/dashboard"
              className="mt-3 block rounded-xl px-4 py-3 text-center text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              User dashboard
            </Link>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1">
          <header className="border-b border-white/10 px-5 py-5 sm:px-8 lg:px-10">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Admin dashboard
                </h1>

                <p className="mt-1 text-sm !text-[#FFFFFF]">
                  Manage NAXODEX accounts and verification requests.
                </p>
              </div>

              <Link
                href="/admin/kyc"
                className="hidden rounded-xl bg-gold px-5 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold sm:inline-flex"
              >
                Review KYC
              </Link>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8 lg:px-10">
            {/* Mobile navigation */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:hidden">
              <Link
                href="/admin"
                className="rounded-xl border border-gold/20 bg-gold/10 p-3 text-center text-xs font-bold text-gold"
              >
                Dashboard
              </Link>

              <Link
                href="/admin/kyc"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center text-xs !text-[#FFFFFF]"
              >
                KYC
                {pendingKyc > 0 && ` (${pendingKyc})`}
              </Link>

              <Link
                href="/admin/users"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center text-xs !text-[#FFFFFF]"
              >
                Users
              </Link>

              <Link
                href="/admin/deposits"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center text-xs !text-[#FFFFFF]"
              >
                Deposits
                {pendingDeposits > 0 &&
                  ` (${pendingDeposits})`}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total users"
                value={totalUsers}
                description="Registered accounts"
              />

              <StatCard
                label="Active users"
                value={activeUsers}
                description="Currently active"
              />

              <StatCard
                label="KYC pending"
                value={pendingKyc}
                description="Require review"
                urgent={pendingKyc > 0}
              />

              <StatCard
                label="KYC approved"
                value={approvedKyc}
                description="Verified accounts"
              />
            </div>

            {/* Secondary stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="KYC declined"
                value={declinedKyc}
                description="May resubmit"
              />

              <StatCard
                label="Deposits pending"
                value={pendingDeposits}
                description="Require approval"
                urgent={pendingDeposits > 0}
              />

              <StatCard
                label="Withdrawals pending"
                value={pendingWithdrawals}
                description="Require approval"
                urgent={pendingWithdrawals > 0}
              />
            </div>

            {/* KYC review queue */}
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
              <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                    Verification queue
                  </p>

                  <h2 className="mt-2 text-lg font-bold">
                    Pending KYC applications
                  </h2>

                  <p className="mt-1 text-sm !text-[#FFFFFF]">
                    Review submitted identity documents and applicant information.
                  </p>
                </div>

                <Link
                  href="/admin/kyc"
                  className="inline-flex rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:!text-[#FFFFFF]"
                >
                  View all
                </Link>
              </div>

              {recentKyc.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10">
                    <Check
                      className="h-6 w-6 text-gold"
                      strokeWidth={2}
                    />
                  </div>

                  <h3 className="mt-4 font-bold">
                    No pending KYC applications
                  </h3>

                  <p className="mt-1 text-sm !text-[#FFFFFF]">
                    New verification submissions will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {recentKyc.map((kyc) => (
                    <div
                      key={kyc.id}
                      className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-bold">
                            {kyc.user.firstName}{" "}
                            {kyc.user.lastName}
                          </h3>

                          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-400">
                            Pending review
                          </span>
                        </div>

                        <p className="mt-1 truncate text-sm !text-[#FFFFFF]">
                          {kyc.user.email}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs !text-[#FFFFFF]">
                          <span>
                            ID:{" "}
                            {kyc.governmentIdType ||
                              "Not specified"}
                          </span>

                          <span>
                            Front:{" "}
                            {kyc.idFrontFile
                              ? "Uploaded"
                              : "Missing"}
                          </span>

                          <span>
                            Back:{" "}
                            {kyc.idBackFile
                              ? "Uploaded"
                              : "Missing"}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/admin/kyc/${kyc.id}`}
                        className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gold px-5 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold"
                      >
                        Review application
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  description,
  urgent = false,
}: {
  label: string;
  value: number;
  description: string;
  urgent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        urgent
          ? "border-amber-500/20 bg-amber-500/[0.04]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm !text-[#FFFFFF]">
          {label}
        </p>

        {urgent && (
          <span className="h-2 w-2 rounded-full bg-amber-400" />
        )}
      </div>

      <p
        className={`mt-3 text-3xl font-semibold ${
          urgent
            ? "text-amber-400"
            : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs !text-[#FFFFFF]">
        {description}
      </p>
    </div>
  );
}