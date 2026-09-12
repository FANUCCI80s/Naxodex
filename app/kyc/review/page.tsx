
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type KycStatus =
  | "NOT_STARTED"
  | "PENDING"
  | "APPROVED"
  | "DECLINED";

type KycData = {
  status: KycStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  declineReason: string | null;
};

export default function KycReviewPage() {
  const router = useRouter();

  const [kyc, setKyc] = useState<KycData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadKycStatus() {
      try {
        const response = await fetch(
          "/api/kyc/status",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load your KYC status."
          );
        }

        setKyc(data.kyc);

        if (data.kyc.status === "NOT_STARTED") {
          router.replace("/kyc");
          return;
        }

        if (data.kyc.status === "DECLINED") {
          router.replace("/kyc");
          return;
        }
      } catch (statusError) {
        console.error(
          "KYC status request error:",
          statusError
        );

        setError(
          statusError instanceof Error
            ? statusError.message
            : "Unable to load your KYC status."
        );
      } finally {
        setLoading(false);
      }
    }

    loadKycStatus();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] px-5 py-10 !text-[#FFFFFF]">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-gold" />

            <p className="text-sm !text-[#FFFFFF]">
              Loading verification status...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#050505] px-5 py-10 !text-[#FFFFFF]">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-xl text-red-400">
              !
            </div>

            <h1 className="text-2xl font-bold">
              Unable to load verification
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 !text-[#FFFFFF]">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-xl bg-gold px-5 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!kyc) {
    return null;
  }

  if (kyc.status === "APPROVED") {
    return (
      <main className="min-h-screen bg-[#050505] px-5 py-10 !text-[#FFFFFF]">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl border border-gold/20 bg-gold/5 p-8 text-center sm:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-2xl text-gold">
              ✓
            </div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
              Verification approved
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Your identity is verified
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 !text-[#FFFFFF]">
              Your NAXODEX account has successfully
              completed identity verification.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard")
              }
              className="mt-8 rounded-xl bg-gold px-6 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold"
            >
              Go to dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-10 !text-[#FFFFFF] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-gold/30 bg-gold/10">
              <img
                src="/branding/NAXODEX-LOGO.png"
                alt="NAXODEX"
                className="h-8 w-auto object-contain"
              />
            </div>

            <span className="text-xl font-bold tracking-tight">
              NAXODEX
            </span>
          </button>

          <span className="hidden text-sm !text-[#FFFFFF] sm:block">
            Identity verification
          </span>
        </header>

        <div className="text-center">
          <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-gold/20 bg-gold/10">
            <div className="h-9 w-9 animate-pulse rounded-full border-2 border-gold/30 border-t-gold" />
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">
            Verification submitted
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Your KYC is under review
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 !text-[#FFFFFF] sm:text-base">
            We have received your identity verification
            documents and information. Our verification
            team will review your submission.
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="text-sm !text-[#FFFFFF]">
                Verification status
              </p>

              <p className="mt-1 text-lg font-bold">
                Pending review
              </p>
            </div>

            <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-300">
              UNDER REVIEW
            </div>
          </div>

          <div className="grid gap-5 pt-6 sm:grid-cols-2">
            <StatusItem
              number="01"
              title="Information received"
              description="Your personal and identification information has been submitted."
              complete
            />

            <StatusItem
              number="02"
              title="Documents received"
              description="Your government ID documents have been uploaded successfully."
              complete
            />

            <StatusItem
              number="03"
              title="Team review"
              description="Our verification team is reviewing your submission."
              active
            />

            <StatusItem
              number="04"
              title="Verification decision"
              description="You will be notified once a decision has been made."
            />
          </div>
        </div>

        {kyc.submittedAt && (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 text-center">
            <p className="text-xs !text-[#FFFFFF]">
              Submitted on{" "}
              {new Date(
                kyc.submittedAt
              ).toLocaleString()}
            </p>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-sm font-bold !text-[#FFFFFF]">
            What happens next?
          </p>

          <p className="mt-2 text-sm leading-6 !text-[#FFFFFF]">
            Please allow our team time to review your
            information. You do not need to submit your
            KYC again while it is under review.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
            className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-white/[0.08]"
          >
            Return to dashboard
          </button>
        </div>
      </div>
    </main>
  );
}

function StatusItem({
  number,
  title,
  description,
  complete = false,
  active = false,
}: {
  number: string;
  title: string;
  description: string;
  complete?: boolean;
  active?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
            complete
              ? "bg-gold/10 text-gold"
              : active
                ? "bg-amber-400/10 text-amber-300"
                : "bg-white/5 text-zinc-500"
          }`}
        >
          {complete ? "✓" : number}
        </div>

        <p
          className={`text-sm font-medium ${
            active
              ? "text-amber-300"
              : complete
                ? "text-zinc-200"
                : "text-zinc-400"
          }`}
        >
          {title}
        </p>
      </div>

      <p className="text-xs leading-5 !text-[#FFFFFF]">
        {description}
      </p>
    </div>
  );
}

