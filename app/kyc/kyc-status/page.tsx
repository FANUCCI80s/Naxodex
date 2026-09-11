
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import {
  Check,
  Clock3,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default async function KycStatusPage() {
  const user = await requireUser();

  const kyc = user.kyc;

  if (!kyc) {
    return (
      <main className="min-h-screen bg-[#050505] px-5 py-10 !text-[#FFFFFF]">
        <div className="mx-auto max-w-3xl">

          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold tracking-tight">
                NAXODEX
              </p>

              <p className="mt-1 text-sm !text-[#FFFFFF]">
                Identity verification
              </p>
            </div>
          </div>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
              <AlertCircle
                size={26}
                strokeWidth={1.8}
                className="text-gold"
              />
            </div>

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gold">
              Verification
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Start your verification
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 !text-[#FFFFFF]">
              Your KYC verification has not been started yet.
              Complete the verification process to continue.
            </p>

            <Link
              href="/kyc"
              className="mt-8 inline-flex rounded-xl bg-gold px-6 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold"
            >
              Start verification
            </Link>

          </section>
        </div>
      </main>
    );
  }

  const status = kyc.status;

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-10 !text-[#FFFFFF] sm:px-8">
      <div className="mx-auto max-w-3xl">

        <header className="mb-10 flex items-center justify-between">

          <div>
            <p className="text-xl font-bold tracking-tight">
              NAXODEX
            </p>

            <p className="mt-1 text-sm !text-[#FFFFFF]">
              Identity verification
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:!text-[#FFFFFF]"
          >
            Dashboard
          </Link>

        </header>

        {status === "PENDING" && (
          <section className="rounded-3xl border border-amber-500/20 bg-amber-500/[0.04] p-6 sm:p-10">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
              <Clock3
                size={26}
                strokeWidth={1.8}
                className="text-amber-400"
              />
            </div>

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
              Verification pending
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your KYC is under review
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 !text-[#FFFFFF]">
              We have received your verification documents.
              Our verification team is reviewing the information
              you submitted.
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">

              <p className="text-sm font-bold !text-[#FFFFFF]">
                What happens next?
              </p>

              <p className="mt-2 text-sm leading-6 !text-[#FFFFFF]">
                You will be notified once your verification has
                been reviewed. Please do not submit another
                verification while your current submission is
                under review.
              </p>

            </div>

          </section>
        )}

        {status === "APPROVED" && (
          <section className="rounded-3xl border border-gold/20 bg-gold/[0.04] p-6 sm:p-10">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
              <Check
                size={28}
                strokeWidth={2}
                className="text-gold"
              />
            </div>

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gold">
              Verification approved
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your identity has been verified
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 !text-[#FFFFFF]">
              Your KYC verification has been approved. Your account
              can now access features that require verified identity.
            </p>

            <Link
              href="/dashboard"
              className="mt-8 inline-flex rounded-xl bg-gold px-6 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold"
            >
              Go to dashboard
            </Link>

          </section>
        )}

        {status === "DECLINED" && (
          <section className="rounded-3xl border border-red-500/20 bg-red-500/[0.04] p-6 sm:p-10">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertCircle
                size={26}
                strokeWidth={1.8}
                className="text-red-400"
              />
            </div>

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-red-400">
              Verification declined
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              We need you to resubmit your verification
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 !text-[#FFFFFF]">
              Your previous KYC submission was reviewed and could
              not be approved. Please review the reason below and
              submit your verification again.
            </p>

            <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-5">

              <p className="text-sm font-bold text-red-300">
                Reason for decline
              </p>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 !text-[#FFFFFF]">
                {kyc.declineReason ||
                  "No specific reason was provided. Please review your information and documents carefully before resubmitting."}
              </p>

            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">

              <p className="text-sm font-bold !text-[#FFFFFF]">
                Before resubmitting
              </p>

              <ul className="mt-3 space-y-2 text-sm leading-6 !text-[#FFFFFF]">

                <li className="flex items-start gap-2">
                  <span className="mt-1 text-gold">•</span>
                  <span>
                    Make sure your personal information is accurate.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="mt-1 text-gold">•</span>
                  <span>
                    Make sure your ID number is correct.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="mt-1 text-gold">•</span>
                  <span>
                    Upload clear images of both sides of your ID.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="mt-1 text-gold">•</span>
                  <span>
                    Make sure the document has not expired.
                  </span>
                </li>

              </ul>

            </div>

            <Link
              href="/kyc"
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-gold px-6 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold sm:w-auto"
            >
              Resubmit verification
            </Link>

          </section>
        )}

        {status === "NOT_STARTED" && (
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
              <ArrowRight
                size={26}
                strokeWidth={1.8}
                className="text-gold"
              />
            </div>

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gold">
              Verification required
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Complete your identity verification
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 !text-[#FFFFFF]">
              Complete your KYC verification to help us verify
              your identity and protect your NAXODEX account.
            </p>

            <Link
              href="/kyc"
              className="mt-8 inline-flex rounded-xl bg-gold px-6 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold"
            >
              Start verification
            </Link>

          </section>
        )}

      </div>
    </main>
  );
}

