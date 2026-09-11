
"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

type UploadSide = "FRONT" | "BACK";

type UploadState = {
  file: File | null;
  uploading: boolean;
  uploaded: boolean;
  error: string;
};

const initialUploadState: UploadState = {
  file: null,
  uploading: false,
  uploaded: false,
  error: "",
};

export default function KycPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    dateOfBirth: "",
    nationality: "",
    countryOfResidence: "",
    residentialAddress: "",
    city: "",
    state: "",
    postalCode: "",
    governmentIdType: "",
    governmentIdNumber: "",
  });

  const [front, setFront] =
    useState<UploadState>(initialUploadState);

  const [back, setBack] =
    useState<UploadState>(initialUploadState);

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function uploadDocument(
    file: File,
    side: UploadSide
  ) {
    setError("");

    const setState =
      side === "FRONT"
        ? setFront
        : setBack;

    setState({
      file,
      uploading: true,
      uploaded: false,
      error: "",
    });

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("side", side);

      const response = await fetch(
        "/api/kyc/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to upload this document."
        );
      }

      setState({
        file,
        uploading: false,
        uploaded: true,
        error: "",
      });
    } catch (uploadError) {
      const uploadMessage =
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload this document.";

      setState({
        file,
        uploading: false,
        uploaded: false,
        error: uploadMessage,
      });

      setError(uploadMessage);
    }
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
    side: UploadSide
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    uploadDocument(file, side);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!front.uploaded) {
      setError(
        "Please upload the front of your government ID."
      );
      return;
    }

    if (!back.uploaded) {
      setError(
        "Please upload the back of your government ID."
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "/api/kyc/submit",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to submit your KYC."
        );
      }

      router.push("/kyc/review");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit your KYC."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] !text-[#FFFFFF]">
      <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        <header className="mb-10 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold font-bold !text-[#FFFFFF]">
                EP
              </div>

              <span className="text-xl font-bold tracking-tight">
                NAXODEX
              </span>
            </div>

            <p className="text-sm !text-[#FFFFFF]">
              Account verification
            </p>
          </div>

          <div className="hidden rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm text-gold sm:block">
            Secure verification
          </div>
        </header>

        <section className="mx-auto max-w-4xl">

          <div className="mb-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gold">
              Identity verification
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Verify your identity
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 !text-[#FFFFFF] sm:text-base">
              Complete the information below and upload
              both sides of your government-issued ID.
              Your documents are stored privately and
              reviewed by our verification team.
            </p>
          </div>

          <div className="mb-8 grid gap-3 sm:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-sm font-bold text-gold">
                1
              </div>

              <p className="font-bold">
                Personal details
              </p>

              <p className="mt-1 text-xs !text-[#FFFFFF]">
                Tell us about yourself
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-sm font-bold text-gold">
                2
              </div>

              <p className="font-bold">
                Upload ID
              </p>

              <p className="mt-1 text-xs !text-[#FFFFFF]">
                Upload both sides
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-sm font-bold text-gold">
                3
              </div>

              <p className="font-bold">
                Review
              </p>

              <p className="mt-1 text-xs !text-[#FFFFFF]">
                Our team verifies your account
              </p>
            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">

              <div className="mb-6">
                <h2 className="text-lg font-bold">
                  Personal information
                </h2>

                <p className="mt-1 text-sm !text-[#FFFFFF]">
                  Enter your information exactly as it
                  appears on your identification document.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="Date of birth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(value) =>
                    updateField(
                      "dateOfBirth",
                      value
                    )
                  }
                />

                <Field
                  label="Nationality"
                  placeholder="e.g. United States"
                  value={form.nationality}
                  onChange={(value) =>
                    updateField(
                      "nationality",
                      value
                    )
                  }
                />

                <Field
                  label="Country of residence"
                  placeholder="e.g. United States"
                  value={
                    form.countryOfResidence
                  }
                  onChange={(value) =>
                    updateField(
                      "countryOfResidence",
                      value
                    )
                  }
                />

                <Field
                  label="City"
                  placeholder="Enter your city"
                  value={form.city}
                  onChange={(value) =>
                    updateField(
                      "city",
                      value
                    )
                  }
                />

                <Field
                  label="State / Province"
                  placeholder="Enter your state"
                  value={form.state}
                  onChange={(value) =>
                    updateField(
                      "state",
                      value
                    )
                  }
                />

                <Field
                  label="Postal code"
                  placeholder="Enter postal code"
                  value={form.postalCode}
                  onChange={(value) =>
                    updateField(
                      "postalCode",
                      value
                    )
                  }
                />

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-bold !text-[#FFFFFF]">
                    Residential address
                  </label>

                  <textarea
                    value={
                      form.residentialAddress
                    }
                    onChange={(event) =>
                      updateField(
                        "residentialAddress",
                        event.target.value
                      )
                    }
                    placeholder="Enter your full residential address"
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60"
                  />
                </div>

              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">

              <div className="mb-6">
                <h2 className="text-lg font-bold">
                  Government identification
                </h2>

                <p className="mt-1 text-sm !text-[#FFFFFF]">
                  Provide the identification details and
                  upload clear copies of both sides.
                </p>
              </div>

              <div className="mb-6 grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-bold !text-[#FFFFFF]">
                    ID type
                  </label>

                  <select
                    value={
                      form.governmentIdType
                    }
                    onChange={(event) =>
                      updateField(
                        "governmentIdType",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm !text-[#FFFFFF] outline-none focus:border-gold/60"
                  >
                    <option value="">
                      Select document type
                    </option>

                    <option value="PASSPORT">
                      Passport
                    </option>

                    <option value="NATIONAL_ID">
                      National ID
                    </option>

                    <option value="DRIVERS_LICENSE">
                      Driver&apos;s License
                    </option>

                    <option value="OTHER">
                      Other government ID
                    </option>
                  </select>
                </div>

                <Field
                  label="ID number"
                  placeholder="Enter your ID number"
                  value={
                    form.governmentIdNumber
                  }
                  onChange={(value) =>
                    updateField(
                      "governmentIdNumber",
                      value
                    )
                  }
                />

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <DocumentUpload
                  title="ID front"
                  description="Upload the front side of your ID"
                  side="FRONT"
                  state={front}
                  onChange={handleFileChange}
                />

                <DocumentUpload
                  title="ID back"
                  description="Upload the back side of your ID"
                  side="BACK"
                  state={back}
                  onChange={handleFileChange}
                />

              </div>

              <p className="mt-5 text-xs leading-5 !text-[#FFFFFF]">
                Accepted formats: JPG, PNG, or PDF.
                Maximum file size: 10 MB per document.
              </p>

            </section>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold-light">
                {message}
              </div>
            )}

            <div className="rounded-3xl border border-gold/10 bg-gold/[0.04] p-5 sm:p-6">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="font-bold">
                    Ready to submit?
                  </p>

                  <p className="mt-1 text-sm !text-[#FFFFFF]">
                    Make sure all information and both
                    documents are correct.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-gold px-6 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit verification"}
                </button>

              </div>

            </div>

          </form>

        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold !text-[#FFFFFF]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60"
      />
    </div>
  );
}

function DocumentUpload({
  title,
  description,
  side,
  state,
  onChange,
}: {
  title: string;
  description: string;
  side: UploadSide;
  state: UploadState;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
    side: UploadSide
  ) => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-5">

      <div className="mb-4">
        <h3 className="font-bold">
          {title}
        </h3>

        <p className="mt-1 text-xs !text-[#FFFFFF]">
          {description}
        </p>
      </div>

      <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-4 text-center transition hover:border-gold/40 hover:bg-gold/[0.03]">

        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-gold">
          <Upload
            size={20}
            strokeWidth={1.8}
          />
        </div>

        {state.uploading ? (
          <p className="text-sm text-gold">
            Uploading...
          </p>
        ) : state.uploaded ? (
          <>
            <p className="text-sm font-bold text-gold">
              Upload complete
            </p>

            <p className="mt-1 max-w-full truncate text-xs !text-[#FFFFFF]">
              {state.file?.name}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-bold !text-[#FFFFFF]">
              Choose file
            </p>

            <p className="mt-1 text-xs !text-[#FFFFFF]">
              JPG, PNG or PDF
            </p>
          </>
        )}

        <input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="hidden"
          onChange={(event) =>
            onChange(event, side)
          }
        />
      </label>

      {state.error && (
        <p className="mt-3 text-xs text-red-400">
          {state.error}
        </p>
      )}

    </div>
  );
}

