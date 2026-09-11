"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type KycData = {
  id: string;
  status: string;
  dateOfBirth: string | null;
  nationality: string | null;
  countryOfResidence: string | null;
  residentialAddress: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  governmentIdType: string | null;
  governmentIdNumber: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  declineReason: string | null;

  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    status: string;
    createdAt: string;
  };

  idFrontFile: {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    createdAt: string;
  } | null;

  idBackFile: {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    createdAt: string;
  } | null;
};

export default function AdminKycReviewPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [kyc, setKyc] = useState<KycData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineBox, setShowDeclineBox] =
    useState(false);

  async function loadKyc() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/kyc/${id}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load KYC application."
        );
      }

      setKyc(data.kyc);
    } catch (error) {
      console.error("KYC review page error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load KYC application."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      loadKyc();
    }
  }, [id]);

  async function approveKyc() {
    const confirmed = window.confirm(
      "Are you sure you want to approve this KYC application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessing(true);
      setError("");

      const response = await fetch(
        `/api/admin/kyc/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "APPROVE",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to approve KYC application."
        );
      }

      await loadKyc();
    } catch (error) {
      console.error("Approve KYC error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to approve KYC application."
      );
    } finally {
      setProcessing(false);
    }
  }

  async function declineKyc() {
    const reason = declineReason.trim();

    if (!reason) {
      setError(
        "Please provide a reason for declining this KYC application."
      );
      return;
    }

    try {
      setProcessing(true);
      setError("");

      const response = await fetch(
        `/api/admin/kyc/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "DECLINE",
            declineReason: reason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to decline KYC application."
        );
      }

      setShowDeclineBox(false);
      setDeclineReason("");

      await loadKyc();
    } catch (error) {
      console.error("Decline KYC error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to decline KYC application."
      );
    } finally {
      setProcessing(false);
    }
  }

  function formatDate(value: string | null) {
    if (!value) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  }

  function formatFileSize(bytes: number) {
    if (!bytes) {
      return "0 KB";
    }

    const mb = bytes / 1024 / 1024;

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }

    return `${Math.round(bytes / 1024)} KB`;
  }

  function statusClass(status: string) {
    switch (status) {
      case "APPROVED":
        return "bg-gold/10 text-gold border-gold/20";

      case "DECLINED":
        return "bg-red-400/10 text-red-400 border-red-400/20";

      case "PENDING":
        return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20";

      default:
        return "bg-white/5 text-zinc-400 border-white/10";
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-12 !text-[#FFFFFF]">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-gold" />

              <p className="mt-4 text-sm !text-[#FFFFFF]">
                Loading KYC application...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !kyc) {
    return (
      <main className="min-h-screen bg-black px-6 py-12 !text-[#FFFFFF]">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/admin/kyc"
            className="text-sm !text-[#FFFFFF] transition hover:text-gold"
          >
            ← Back to KYC
          </Link>

          <div className="mt-8 rounded-3xl border border-red-400/20 bg-red-400/[0.04] p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-400/10 text-xl text-red-400">
              !
            </div>

            <h1 className="mt-5 text-xl font-bold">
              Unable to load KYC application
            </h1>

            <p className="mt-3 text-sm !text-[#FFFFFF]">
              {error}
            </p>

            <button
              type="button"
              onClick={loadKyc}
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

  const isPending = kyc.status === "PENDING";

  return (
    <main className="min-h-screen bg-black px-4 py-8 !text-[#FFFFFF] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <Link
          href="/admin/kyc"
          className="inline-flex items-center text-sm !text-[#FFFFFF] transition hover:text-gold"
        >
          ← Back to KYC applications
        </Link>

        {/* Header */}
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold text-gold">
              KYC Review
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {kyc.user.firstName}{" "}
              {kyc.user.lastName}
            </h1>

            <p className="mt-2 text-sm !text-[#FFFFFF]">
              Review the customer's identity
              verification information.
            </p>
          </div>

          {/* STATUS */}
          <span
            className={`inline-flex w-fit rounded-full border px-4 py-2 text-sm font-semibold ${statusClass(
              kyc.status
            )}`}
          >
            {kyc.status}
          </span>
        </div>

        {/* IMPORTANT: ACTION BAR */}
        <section className="mt-8 rounded-3xl border border-gold/20 bg-gold/[0.04] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider !text-[#FFFFFF]">
                Review decision
              </p>

              <h2 className="mt-2 text-lg font-bold">
                {isPending
                  ? "This application is awaiting review"
                  : `KYC application ${kyc.status.toLowerCase()}`}
              </h2>

              <p className="mt-1 text-sm !text-[#FFFFFF]">
                {isPending
                  ? "Verify the submitted information before approving or declining the application."
                  : "This application has already been processed."}
              </p>
            </div>

            {isPending && (
              <div className="flex flex-col gap-3 sm:flex-row">
                {/* APPROVE BUTTON */}
                <button
                  type="button"
                  disabled={processing}
                  onClick={approveKyc}
                  className="rounded-xl bg-gold px-6 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processing
                    ? "Processing..."
                    : "✓ Approve KYC"}
                </button>

                {/* DECLINE BUTTON */}
                <button
                  type="button"
                  disabled={processing}
                  onClick={() =>
                    setShowDeclineBox(
                      !showDeclineBox
                    )
                  }
                  className="rounded-xl border border-red-400/30 bg-red-400/10 px-6 py-3 text-sm font-bold text-red-400 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ✕ Decline KYC
                </button>
              </div>
            )}
          </div>

          {/* DECLINE FORM */}
          {isPending && showDeclineBox && (
            <div className="mt-6 border-t border-white/10 pt-6">
              <label className="text-sm font-bold !text-[#FFFFFF]">
                Reason for declining
              </label>

              <textarea
                value={declineReason}
                onChange={(event) =>
                  setDeclineReason(
                    event.target.value
                  )
                }
                placeholder="Explain why this KYC application is being declined..."
                rows={5}
                maxLength={2000}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:!text-[#FFFFFF] transition focus:border-red-400/40"
              />

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs !text-[#FFFFFF]">
                  {declineReason.length}/2000
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeclineBox(false);
                      setDeclineReason("");
                      setError("");
                    }}
                    className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-zinc-400 transition hover:!text-[#FFFFFF]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={
                      processing ||
                      !declineReason.trim()
                    }
                    onClick={declineKyc}
                    className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold !text-[#FFFFFF] transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processing
                      ? "Declining..."
                      : "Confirm decline"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* API ERROR */}
          {error && (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </section>

        {/* USER INFORMATION */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="border-b border-white/10 pb-5">
            <p className="text-xs uppercase tracking-wider !text-[#FFFFFF]">
              Applicant
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Personal information
            </h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              label="First name"
              value={kyc.user.firstName}
            />

            <InfoItem
              label="Last name"
              value={kyc.user.lastName}
            />

            <InfoItem
              label="Email"
              value={kyc.user.email}
            />

            <InfoItem
              label="Phone"
              value={kyc.user.phone || "Not provided"}
            />

            <InfoItem
              label="Account status"
              value={kyc.user.status}
            />

            <InfoItem
              label="Account created"
              value={formatDate(
                kyc.user.createdAt
              )}
            />
          </div>
        </section>

        {/* KYC INFORMATION */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="border-b border-white/10 pb-5">
            <p className="text-xs uppercase tracking-wider !text-[#FFFFFF]">
              Verification
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Identity information
            </h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              label="Date of birth"
              value={formatDate(kyc.dateOfBirth)}
            />

            <InfoItem
              label="Nationality"
              value={
                kyc.nationality || "Not provided"
              }
            />

            <InfoItem
              label="Country of residence"
              value={
                kyc.countryOfResidence ||
                "Not provided"
              }
            />

            <InfoItem
              label="Government ID type"
              value={
                kyc.governmentIdType ||
                "Not provided"
              }
            />

            <InfoItem
              label="Government ID number"
              value={
                kyc.governmentIdNumber ||
                "Not provided"
              }
            />

            <InfoItem
              label="Submitted"
              value={formatDate(kyc.submittedAt)}
            />
          </div>
        </section>

        {/* ADDRESS */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="border-b border-white/10 pb-5">
            <p className="text-xs uppercase tracking-wider !text-[#FFFFFF]">
              Residence
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Residential address
            </h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              label="Address"
              value={
                kyc.residentialAddress ||
                "Not provided"
              }
            />

            <InfoItem
              label="City"
              value={kyc.city || "Not provided"}
            />

            <InfoItem
              label="State"
              value={kyc.state || "Not provided"}
            />

            <InfoItem
              label="Postal code"
              value={
                kyc.postalCode || "Not provided"
              }
            />
          </div>
        </section>

        {/* DOCUMENTS */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="border-b border-white/10 pb-5">
            <p className="text-xs uppercase tracking-wider !text-[#FFFFFF]">
              Documents
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Government ID
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <DocumentCard
              title="Front of ID"
              file={kyc.idFrontFile}
              formatFileSize={formatFileSize}
            />

            <DocumentCard
              title="Back of ID"
              file={kyc.idBackFile}
              formatFileSize={formatFileSize}
            />
          </div>
        </section>

        {/* REVIEW RESULT */}
        {!isPending && (
          <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-wider !text-[#FFFFFF]">
              Review result
            </p>

            <h2 className="mt-2 text-xl font-bold">
              {kyc.status === "APPROVED"
                ? "KYC approved"
                : "KYC declined"}
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <InfoItem
                label="Reviewed"
                value={formatDate(kyc.reviewedAt)}
              />

              {kyc.status === "DECLINED" && (
                <InfoItem
                  label="Decline reason"
                  value={
                    kyc.declineReason ||
                    "No reason provided"
                  }
                />
              )}
            </div>
          </section>
        )}

        <p className="mt-10 pb-8 text-center text-xs !text-[#FFFFFF]">
          NAXODEX • Admin • KYC Review
        </p>
      </div>
    </main>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs !text-[#FFFFFF]">
        {label}
      </p>

      <p className="mt-2 break-words text-sm !text-[#FFFFFF]">
        {value}
      </p>
    </div>
  );
}

function DocumentCard({
  title,
  file,
  formatFileSize,
}: {
  title: string;
  file: {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    createdAt: string;
  } | null;
  formatFileSize: (bytes: number) => string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold">
            {title}
          </p>

          <p className="mt-1 text-xs !text-[#FFFFFF]">
            {file
              ? file.originalName
              : "No document uploaded"}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] !text-[#FFFFFF]">
          ID
        </div>
      </div>

      {file && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <p className="text-[11px] !text-[#FFFFFF]">
              Type
            </p>

            <p className="mt-1 truncate text-xs !text-[#FFFFFF]">
              {file.mimeType}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <p className="text-[11px] !text-[#FFFFFF]">
              Size
            </p>

            <p className="mt-1 text-xs !text-[#FFFFFF]">
              {formatFileSize(file.sizeBytes)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}