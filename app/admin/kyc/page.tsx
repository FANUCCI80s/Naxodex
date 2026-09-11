import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

function formatDate(date: Date | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getStatusClass(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-gold/10 text-gold";

    case "DECLINED":
      return "bg-red-400/10 text-red-400";

    case "PENDING":
      return "bg-yellow-400/10 text-yellow-400";

    case "NOT_STARTED":
      return "bg-white/10 text-zinc-500";

    default:
      return "bg-white/10 text-zinc-400";
  }
}

export default async function AdminKycPage() {
  await requireAdmin();

  const kycRecords = await prisma.kycVerification.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });

  const totalKyc = kycRecords.length;

  const pendingKyc = kycRecords.filter(
    (kyc) => kyc.status === "PENDING"
  ).length;

  const approvedKyc = kycRecords.filter(
    (kyc) => kyc.status === "APPROVED"
  ).length;

  const declinedKyc = kycRecords.filter(
    (kyc) => kyc.status === "DECLINED"
  ).length;

  return (
    <main className="min-h-screen bg-[#050505] !text-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm !text-[#FFFFFF] transition hover:text-gold"
          >
            <span aria-hidden="true">&larr;</span>
            Admin Dashboard
          </Link>

          <p className="mt-6 text-sm font-bold text-gold">
            Identity verification
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            KYC Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 !text-[#FFFFFF]">
            Review registered users, inspect submitted identity
            information, and manage KYC verification requests.
          </p>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm !text-[#FFFFFF]">
              Total KYC records
            </p>

            <p className="mt-3 text-3xl font-bold">
              {totalKyc}
            </p>

            <p className="mt-2 text-xs !text-[#FFFFFF]">
              All verification records
            </p>
          </div>

          <div className="rounded-3xl border border-yellow-400/10 bg-yellow-400/[0.03] p-6">
            <p className="text-sm !text-[#FFFFFF]">
              Pending review
            </p>

            <p className="mt-3 text-3xl font-bold text-yellow-400">
              {pendingKyc}
            </p>

            <p className="mt-2 text-xs !text-[#FFFFFF]">
              Require administrator attention
            </p>
          </div>

          <div className="rounded-3xl border border-gold/20 bg-gold/[0.05] p-6">
            <p className="text-sm !text-[#FFFFFF]">
              Approved
            </p>

            <p className="mt-3 text-3xl font-bold text-gold">
              {approvedKyc}
            </p>

            <p className="mt-2 text-xs !text-[#FFFFFF]">
              Successfully verified users
            </p>
          </div>

          <div className="rounded-3xl border border-red-400/10 bg-red-400/[0.03] p-6">
            <p className="text-sm !text-[#FFFFFF]">
              Declined
            </p>

            <p className="mt-3 text-3xl font-bold text-red-400">
              {declinedKyc}
            </p>

            <p className="mt-2 text-xs !text-[#FFFFFF]">
              Verification requests declined
            </p>
          </div>
        </div>

        {/* KYC Records */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm !text-[#FFFFFF]">
                  Verification queue
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  KYC submissions
                </h2>
              </div>

              <span className="w-fit rounded-full bg-white/[0.05] px-3 py-1 text-xs !text-[#FFFFFF]">
                {kycRecords.length} records
              </span>
            </div>
          </div>

          {kycRecords.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-xs font-bold text-zinc-500">
                KYC
              </div>

              <h3 className="mt-4 font-bold">
                No KYC records found
              </h3>

              <p className="mt-2 text-sm !text-[#FFFFFF]">
                KYC submissions will appear here when users submit
                their verification information.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider !text-[#FFFFFF]">
                      <th className="px-6 py-4 font-bold">
                        User
                      </th>

                      <th className="px-6 py-4 font-bold">
                        Country
                      </th>

                      <th className="px-6 py-4 font-bold">
                        ID Type
                      </th>

                      <th className="px-6 py-4 font-bold">
                        Status
                      </th>

                      <th className="px-6 py-4 font-bold">
                        Submitted
                      </th>

                      <th className="px-6 py-4 text-right font-bold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    {kycRecords.map((kyc) => (
                      <tr
                        key={kyc.id}
                        className="transition hover:bg-white/[0.02]"
                      >
                        {/* User */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 font-bold text-gold">
                              {(
                                kyc.user.firstName ||
                                kyc.user.email ||
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-bold">
                                {kyc.user.firstName}{" "}
                                {kyc.user.lastName}
                              </p>

                              <p className="mt-1 max-w-[240px] truncate text-xs !text-[#FFFFFF]">
                                {kyc.user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Country */}
                        <td className="px-6 py-5 text-sm !text-[#FFFFFF]">
                          {kyc.countryOfResidence || "—"}
                        </td>

                        {/* ID Type */}
                        <td className="px-6 py-5 text-sm !text-[#FFFFFF]">
                          {kyc.governmentIdType || "—"}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              kyc.status
                            )}`}
                          >
                            {kyc.status}
                          </span>
                        </td>

                        {/* Submitted */}
                        <td className="px-6 py-5 text-sm !text-[#FFFFFF]">
                          {formatDate(kyc.submittedAt)}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-5 text-right">
                          <Link
                            href={`/admin/kyc/${kyc.id}`}
                            className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm !text-[#FFFFFF] transition hover:border-gold/30 hover:bg-gold/10 hover:text-gold"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-white/10 lg:hidden">
                {kycRecords.map((kyc) => (
                  <div
                    key={kyc.id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 font-bold text-gold">
                          {(
                            kyc.user.firstName ||
                            kyc.user.email ||
                            "U"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-bold">
                            {kyc.user.firstName}{" "}
                            {kyc.user.lastName}
                          </p>

                          <p className="mt-1 truncate text-xs !text-[#FFFFFF]">
                            {kyc.user.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          kyc.status
                        )}`}
                      >
                        {kyc.status}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {/* Country */}
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs !text-[#FFFFFF]">
                          Country
                        </p>

                        <p className="mt-2 text-sm">
                          {kyc.countryOfResidence || "—"}
                        </p>
                      </div>

                      {/* ID Type */}
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs !text-[#FFFFFF]">
                          ID Type
                        </p>

                        <p className="mt-2 text-sm">
                          {kyc.governmentIdType || "—"}
                        </p>
                      </div>

                      {/* Submitted */}
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs !text-[#FFFFFF]">
                          Submitted
                        </p>

                        <p className="mt-2 text-sm !text-[#FFFFFF]">
                          {formatDate(kyc.submittedAt)}
                        </p>
                      </div>

                      {/* User status */}
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs !text-[#FFFFFF]">
                          User status
                        </p>

                        <p className="mt-2 text-sm">
                          {kyc.user.status}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Link
                        href={`/admin/kyc/${kyc.id}`}
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm !text-[#FFFFFF] transition hover:border-gold/30 hover:text-gold"
                      >
                        Review KYC
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Important notice */}
        <section className="mt-8 rounded-3xl border border-yellow-400/10 bg-yellow-400/[0.03] p-6">
          <div className="flex gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-400/10 text-sm font-bold text-yellow-400"
              aria-hidden="true"
            >
              !
            </div>

            <div>
              <h3 className="font-bold text-yellow-300">
                KYC review
              </h3>

              <p className="mt-2 text-sm leading-6 !text-[#FFFFFF]">
                Review submitted identity information and
                verification documents carefully before making
                a decision.
              </p>
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-xs !text-[#FFFFFF]">
          NAXODEX <span aria-hidden="true">•</span> Admin{" "}
          <span aria-hidden="true">•</span> KYC Management
        </p>
      </div>
    </main>
  );
}