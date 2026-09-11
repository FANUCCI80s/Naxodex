"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOtpPage() {
const router = useRouter();

const [email, setEmail] = useState("");
const [code, setCode] = useState("");

const [loading, setLoading] = useState(false);
const [resending, setResending] = useState(false);
const [error, setError] = useState("");
const [message, setMessage] = useState("");

useEffect(() => {
const storedEmail = sessionStorage.getItem(
"NAXODEXLoginEmail"
);

if (!storedEmail) {
  router.replace("/login");
  return;
}

setEmail(storedEmail);

}, [router]);

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();

setError("");
setMessage("");

if (!email) {
  setError("Your login session could not be found.");
  return;
}

if (!/^\d{6}$/.test(code)) {
  setError("Enter the 6-digit verification code.");
  return;
}

setLoading(true);

try {
  const response = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    setError(
      data.message || "The verification code is invalid."
    );
    return;
  }

  
sessionStorage.removeItem("NAXODEXLoginEmail");

router.replace(data.redirectTo || "/kyc");

} catch {
  setError("Unable to connect to the server.");
} finally {
  setLoading(false);
}

}

async function handleResend() {
setError("");
setMessage("");

if (!email) {
  setError("Your login session could not be found.");
  return;
}

setResending(true);

try {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password: "",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    setError(
      data.message || "Unable to resend the verification code."
    );
    return;
  }

  setMessage("A new verification code has been sent.");
  setCode("");
} catch {
  setError("Unable to connect to the server.");
} finally {
  setResending(false);
}

}

return (
<main className="min-h-screen bg-[#050505] !text-[#FFFFFF]">
<div className="flex min-h-screen items-center justify-center px-5 py-12">
<div className="w-full max-w-md">
<div className="mb-10 text-center">
<Link href="/" className="mb-8 inline-flex items-center gap-3" >
<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold font-bold !text-[#FFFFFF]">
EP
</div>

          <span className="text-xl font-bold">
            NAXODEX
          </span>
        </Link>

        <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-7 w-7 text-gold"
            aria-hidden="true"
          >
            <path
              d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-bold">
          Verify your login
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 !text-[#FFFFFF]">
          Enter the 6-digit verification code sent to
          {" "}
          <span className="!text-[#FFFFFF]">
            {email || "your email address"}
          </span>
          .
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
      >
        <label
          htmlFor="code"
          className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
        >
          Verification code
        </label>

        <input
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
          value={code}
          onChange={(event) => {
            const value = event.target.value
              .replace(/\D/g, "")
              .slice(0, 6);

            setCode(value);
          }}
          placeholder="000000"
          className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-center text-2xl font-bold tracking-[0.5em] text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60 focus:bg-white/[0.06]"
        />

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-4 rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="mt-5 h-12 w-full rounded-xl bg-gold px-5 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Verifying..." : "Verify and continue"}
        </button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-sm font-bold text-gold transition hover:text-gold-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resending
              ? "Sending..."
              : "Didn't receive a code? Resend"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-zinc-500 transition hover:!text-[#FFFFFF]"
        >
          â† Back to sign in
        </Link>
      </div>

      <p className="mt-8 text-center text-xs leading-5 !text-[#FFFFFF]">
        Never share your verification code with anyone.
      </p>
    </div>
  </div>
</main>

);
}
