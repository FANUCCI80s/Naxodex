import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminDepositReviewPage({
  params,
}: PageProps) {
  const admin = await requireAdmin();
  const { id } = await params;

  const deposit = await prisma.depositRequest.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      bankAccount: true,
      cryptoOption: true,
      paymentConfig: true,
      proofFile: true,
      invoiceFile: true,
    },
  });

  if (!deposit) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] !text-[#FFFFFF]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#050505] lg:flex lg:flex-col">
          <div className="border-b border-white/10 p-6">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
                <img src="/branding/NAXODEX-logo.png" alt="NAXODEX" className="h-8 w-auto object-contain" />
              </div>

              <div>
                <p className="font-bold tracking-tight">
                  NAXODEX
                </p>

                <p className="text-xs !text-[#FFFFFF]">
                  Administration
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/admin"
              className="flex items-center rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/kyc"
              className="flex items-center rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              KYC verification
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              Users
            </Link>

            <Link
              href="/admin/deposits"
              className="flex items-center rounded-xl bg-gold/10 px-4 py-3 text-sm font-bold text-gold"
            >
              Deposits
            </Link>

            <Link
              href="/admin/withdrawals"
              className="flex items-center rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              Withdrawals
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
              href="/admin"
              className="mt-3 block rounded-xl px-4 py-3 text-center text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              Admin dashboard
            </Link>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1">
          {/* Mobile header */}
          <header className="border-b border-white/10 bg-[#050505] px-5 py-4 lg:hidden">
            <div className="flex items-center justify-between">
              <Link
                href="/admin"
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10">
                  <img src="/branding/NAXODEX-logo.png" alt="NAXODEX" className="h-8 w-auto object-contain" />
                </div>

                <span className="font-bold">
                  NAXODEX
                </span>
              </Link>

              <Link
                href="/admin/deposits"
                className="text-sm text-zinc-500 hover:!text-[#FFFFFF]"
              >
                Deposits
              </Link>
            </div>
          </header>

          <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
            {/* Back link */}
            <Link
              href="/admin/deposits"
              className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:!text-[#FFFFFF]"
            >
              <span>←</span>
              Back to deposits
            </Link>

            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-gold">
                    Deposit review
                  </p>

                  <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                    Review deposit
                  </h1>

                  <p className="mt-2 text-sm !text-[#FFFFFF]">
                    Review the payment information before approving or
                    declining this request.
                  </p>
                </div>

                <StatusBadge status={deposit.status} />
              </div>
            </div>

            {/* Amount */}
            <section className="mb-6 rounded-3xl border border-gold/20 bg-gold/[0.04] p-6 sm:p-8">
              <p className="text-sm !text-[#FFFFFF]">
                Requested deposit amount
              </p>

              <p className="mt-2 text-4xl font-bold tracking-tight text-gold">
                ${deposit.amount.toString()}
              </p>

              <p className="mt-2 text-xs !text-[#FFFFFF]">
                Request ID: {deposit.id}
              </p>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* User information */}
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  Account
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  User information
                </h2>

                <div className="mt-6 space-y-5">
                  <InfoRow
                    label="Name"
                    value={`${deposit.user.firstName} ${deposit.user.lastName}`}
                  />

                  <InfoRow
                    label="Email"
                    value={deposit.user.email}
                  />

                  <InfoRow
                    label="Phone"
                    value={deposit.user.phone || "Not provided"}
                  />

                  <InfoRow
                    label="Account status"
                    value={deposit.user.status}
                  />

                  <InfoRow
                    label="Submitted"
                    value={formatDate(deposit.createdAt)}
                  />
                </div>
              </section>

              {/* Deposit information */}
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  Request
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Deposit information
                </h2>

                <div className="mt-6 space-y-5">
                  <InfoRow
                    label="Method"
                    value={formatMethod(deposit.method)}
                  />

                  <InfoRow
                    label="Reference"
                    value={deposit.reference || "Not provided"}
                  />

                  <InfoRow
                    label="Notes"
                    value={deposit.notes || "No additional notes"}
                  />
                </div>
              </section>

              {/* Bank details */}
              {(deposit.selectedBankName ||
                deposit.selectedAccountName ||
                deposit.selectedAccountNumber ||
                deposit.selectedRoutingNumber ||
                deposit.selectedSwiftBic ||
                deposit.selectedBankAddress) && (
                <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                    Bank transfer
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Bank details
                  </h2>

                  <div className="mt-6 space-y-5">
                    {deposit.selectedBankName && (
                      <InfoRow
                        label="Bank name"
                        value={deposit.selectedBankName}
                      />
                    )}

                    {deposit.selectedAccountName && (
                      <InfoRow
                        label="Account name"
                        value={deposit.selectedAccountName}
                      />
                    )}

                    {deposit.selectedAccountNumber && (
                      <InfoRow
                        label="Account number"
                        value={deposit.selectedAccountNumber}
                      />
                    )}

                    {deposit.selectedRoutingNumber && (
                      <InfoRow
                        label="Routing number"
                        value={deposit.selectedRoutingNumber}
                      />
                    )}

                    {deposit.selectedSwiftBic && (
                      <InfoRow
                        label="SWIFT / BIC"
                        value={deposit.selectedSwiftBic}
                      />
                    )}

                    {deposit.selectedBankAddress && (
                      <InfoRow
                        label="Bank address"
                        value={deposit.selectedBankAddress}
                      />
                    )}
                  </div>
                </section>
              )}

              {/* Crypto details */}
              {(deposit.cryptoAsset ||
                deposit.cryptoSymbol ||
                deposit.cryptoNetwork ||
                deposit.cryptoWalletAddress) && (
                <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                    Cryptocurrency
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Crypto payment details
                  </h2>

                  <div className="mt-6 space-y-5">
                    {deposit.cryptoAsset && (
                      <InfoRow
                        label="Asset"
                        value={deposit.cryptoAsset}
                      />
                    )}

                    {deposit.cryptoSymbol && (
                      <InfoRow
                        label="Symbol"
                        value={deposit.cryptoSymbol}
                      />
                    )}

                    {deposit.cryptoNetwork && (
                      <InfoRow
                        label="Network"
                        value={deposit.cryptoNetwork}
                      />
                    )}

                    {deposit.cryptoWalletAddress && (
                      <InfoRow
                        label="Wallet address"
                        value={deposit.cryptoWalletAddress}
                      />
                    )}
                  </div>
                </section>
              )}

              {/* Payment configuration */}
              {deposit.paymentConfig && (
                <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                    Payment channel
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Configured payment information
                  </h2>

                  <div className="mt-6">
                    <InfoRow
                      label="Payment information"
                      value={deposit.paymentConfig.paymentInformation}
                    />

                    {deposit.paymentConfig.instructions && (
                      <div className="mt-5">
                        <InfoRow
                          label="Instructions"
                          value={
                            deposit.paymentConfig.instructions
                          }
                        />
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Uploaded documents */}
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  Evidence
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Uploaded documents
                </h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <DocumentCard
                    title="Deposit proof"
                    available={Boolean(deposit.proofFile)}
                  />

                  <DocumentCard
                    title="Payment invoice"
                    available={Boolean(deposit.invoiceFile)}
                  />
                </div>

                {!deposit.proofFile && !deposit.invoiceFile && (
                  <p className="mt-4 text-sm !text-[#FFFFFF]">
                    No supporting documents were uploaded with this
                    request.
                  </p>
                )}
              </section>
            </div>

            {/* Action area */}
            <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Admin action
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Review decision
              </h2>

              {deposit.status === "PENDING" ? (
                <>
                  <p className="mt-2 text-sm leading-6 !text-[#FFFFFF]">
                    The approval and decline actions will be connected
                    to the secure admin API in the next step.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-gold/20 bg-gold/[0.04] p-5">
                      <p className="font-bold text-gold">
                        Approve deposit
                      </p>

                      <p className="mt-1 text-sm leading-6 !text-[#FFFFFF]">
                        Approving will eventually credit the user’s
                        account balance.
                      </p>

                      <button
                        type="button"
                        disabled
                        className="mt-4 w-full cursor-not-allowed rounded-xl bg-gold/30 px-5 py-3 text-sm font-bold text-gold-light/50"
                      >
                        Approve
                      </button>
                    </div>

                    <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5">
                      <p className="font-bold text-red-400">
                        Decline deposit
                      </p>

                      <p className="mt-1 text-sm leading-6 !text-[#FFFFFF]">
                        Declining will reject this deposit request
                        without crediting the account.
                      </p>

                      <button
                        type="button"
                        disabled
                        className="mt-4 w-full cursor-not-allowed rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-300/50"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm !text-[#FFFFFF]">
                    This deposit request has already been{" "}
                    <span className="font-bold !text-[#FFFFFF]">
                      {deposit.status.toLowerCase()}
                    </span>
                    .
                  </p>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs !text-[#FFFFFF]">{label}</p>
      <p className="mt-1 break-words text-sm leading-6 !text-[#FFFFFF]">
        {value}
      </p>
    </div>
  );
}

function DocumentCard({
  title,
  available,
}: {
  title: string;
  available: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-bold">{title}</p>

          <p className="mt-1 text-xs !text-[#FFFFFF]">
            {available
              ? "Document uploaded"
              : "No document uploaded"}
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs ${
            available
              ? "border border-gold/20 bg-gold/10 text-gold"
              : "border border-white/10 bg-white/[0.03] text-zinc-600"
          }`}
        >
          {available ? "Available" : "Missing"}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  if (status === "APPROVED") {
    return (
      <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1.5 text-xs font-bold text-gold">
        Approved
      </span>
    );
  }

  if (status === "DECLINED") {
    return (
      <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400">
        Declined
      </span>
    );
  }

  return (
    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400">
      Pending
    </span>
  );
}

function formatMethod(method: string) {
  const labels: Record<string, string> = {
    BANK_TRANSFER: "Bank Transfer",
    CARD: "Card",
    CRYPTOCURRENCY: "Cryptocurrency",
    CASH_APP: "Cash App",
    PAYPAL: "PayPal",
    ZELLE: "Zelle",
    VENMO: "Venmo",
  };

  return labels[method] ?? method;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

