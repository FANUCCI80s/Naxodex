"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Step =
  | "login"
  | "otp"
  | "forgot"
  | "resetOtp"
  | "resetPassword";

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Unable to sign in."
        );
        return;
      }

      if (data.otpRequired) {
        setStep("otp");
        setMessage(
          "A verification code has been sent to your email."
        );
        return;
      }

      router.push(
        data.redirectTo || "/admin"
      );
    } catch {
      setError(
        "Unable to connect to NAXODEX. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(code)) {
      setError(
        "Enter the 6-digit verification code."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            code,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to verify the code."
        );
        return;
      }

      router.push(
        data.redirectTo || "/dashboard"
      );
    } catch {
      setError(
        "Unable to connect to NAXODEX. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setMessage("");
    setResending(true);

    try {
      const response = await fetch(
        "/api/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to resend the code."
        );
        return;
      }

      setCode("");
      setMessage(
        "A new verification code has been sent to your email."
      );
    } catch {
      setError(
        "Unable to connect to NAXODEX. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  const handleForgotPassword = () => {
    setStep("forgot");
    setPassword("");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setMessage("");
  };

  const handleRequestPasswordReset = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to process the password reset request."
        );
        return;
      }

      setCode("");
      setStep("resetOtp");
      setMessage(
        "If an account exists for this email, a password reset code has been sent."
      );
    } catch {
      setError(
        "Unable to connect to NAXODEX. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinueReset = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(code)) {
      setError(
        "Enter the 6-digit password reset code."
      );
      return;
    }

    setStep("resetPassword");
  };

  const handleResendPasswordReset = async () => {
    setError("");
    setMessage("");
    setResending(true);

    try {
      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to resend the password reset code."
        );
        return;
      }

      setCode("");
      setMessage(
        "A new password reset code has been sent to your email."
      );
    } catch {
      setError(
        "Unable to connect to NAXODEX. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  const handleResetPassword = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(code)) {
      setError(
        "Enter the 6-digit password reset code."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Your new password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "Your passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            code,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to reset your password."
        );
        return;
      }

      setPassword("");
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
      setStep("login");
      setMessage(
        "Your password has been updated successfully. Please sign in with your new password."
      );
    } catch {
      setError(
        "Unable to connect to NAXODEX. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setStep("login");
    setCode("");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setMessage("");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] !text-[#FFFFFF]">
      {/* =====================================================
          RESPONSIVE BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {/* Desktop background */}
        <div
          className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat lg:block"
          style={{
            backgroundImage:
              "url('/branding/background.jpg')",
          }}
        />

        {/* Mobile background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat lg:hidden"
          style={{
            backgroundImage:
              "url('/branding/background-mobile.jpg')",
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/75" />

        {/* Gold atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(212,175,55,0.10),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(212,175,55,0.07),transparent_30%)]" />

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_25%,rgba(0,0,0,0.45)_100%)]" />
      </div>

      {/* =====================================================
          PAGE CONTENT
          ===================================================== */}

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        {/* ===================================================
            LEFT / BRAND PANEL
            =================================================== */}

        <section className="relative hidden overflow-hidden border-r border-white/10 lg:flex">
          <div className="relative flex w-full flex-col justify-between px-12 py-12 xl:px-16 xl:py-16">
            {/* Brand */}
            <div className="flex justify-center xl:justify-start">
              <Image
                src="/branding/NAXODEX-logo.png"
                alt="NAXODEX"
                width={220}
                height={64}
                priority
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Hero copy */}
            <div className="mx-auto w-full max-w-xl xl:mx-0">
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-gold">
                Intelligent investing
              </p>

              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight !text-[#FFFFFF] xl:text-7xl">
                Your portfolio.
                <br />
                Your NAXODEX.
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 !text-[#FFFFFF]">
                Access your NAXODEX account and manage
                your investments across crypto, forex, and
                global markets from one secure platform.
              </p>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
                <div className="rounded-2xl border border-gold/20 bg-black/50 p-4 backdrop-blur-sm">
                  <p className="text-xs !text-[#FFFFFF]">
                    Markets
                  </p>

                  <p className="mt-2 text-lg font-bold !text-[#FFFFFF]">
                    Global
                  </p>
                </div>

                <div className="rounded-2xl border border-gold/20 bg-black/50 p-4 backdrop-blur-sm">
                  <p className="text-xs !text-[#FFFFFF]">
                    Security
                  </p>

                  <p className="mt-2 text-lg font-bold !text-[#FFFFFF]">
                    2-Step
                  </p>
                </div>

                <div className="rounded-2xl border border-gold/20 bg-black/50 p-4 backdrop-blur-sm">
                  <p className="text-xs !text-[#FFFFFF]">
                    Access
                  </p>

                  <p className="mt-2 text-lg font-bold !text-[#FFFFFF]">
                    24/7
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm !text-[#FFFFFF]">
              © {new Date().getFullYear()} NAXODEX
            </p>
          </div>
        </section>

        {/* ===================================================
            RIGHT / LOGIN PANEL
            =================================================== */}

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:bg-black/40 lg:backdrop-blur-sm">
          <div className="w-full max-w-md">
            {/* Mobile centered logo */}
            <div className="mb-10 flex justify-center lg:hidden">
              <Image
                src="/branding/NAXODEX-logo.png"
                alt="NAXODEX"
                width={210}
                height={62}
                priority
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Login card */}
            <div className="rounded-3xl border border-gold/20 bg-[#0B0B0B]/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8">
              {step === "login" ? (
                <>
                  <div className="mb-8 text-center">
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-gold">
                      Secure access
                    </p>

                    <h2 className="text-3xl font-bold tracking-tight !text-[#FFFFFF] sm:text-4xl">
                      Welcome back
                    </h2>

                    <p className="mt-3 text-sm leading-6 !text-[#FFFFFF]">
                      Sign in to continue to your NAXODEX
                      account.
                    </p>
                  </div>

                  <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                      >
                        Email address
                      </label>

                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        required
                        className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-gold/10"
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="block text-sm font-bold !text-[#FFFFFF]"
                        >
                          Password
                        </label>

                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-xs font-bold text-gold transition hover:text-gold-light"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        placeholder="Enter your password"
                        required
                        className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-gold/10"
                      />
                    </div>

                    {message && (
                      <div className="rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm leading-6 text-gold-light">
                        {message}
                      </div>
                    )}

                    {error && (
                      <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-13 w-full items-center justify-center rounded-xl bg-gold px-5 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading
                        ? "Signing in..."
                        : "Sign in"}
                    </button>
                  </form>

                  <p className="mt-8 text-center text-sm !text-[#FFFFFF]">
                    Don&apos;t have an account?{" "}
                    <a
                      href="/signup"
                      className="font-bold text-gold transition hover:text-gold-light"
                    >
                      Create one
                    </a>
                  </p>
                </>
              ) : step === "otp" ? (
                <>
                  <div className="mb-8 text-center">
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-gold">
                      Two-step verification
                    </p>

                    <h2 className="text-3xl font-bold tracking-tight !text-[#FFFFFF] sm:text-4xl">
                      Check your email
                    </h2>

                    <p className="mt-3 text-sm leading-6 !text-[#FFFFFF]">
                      We sent a 6-digit verification code to{" "}
                      <span className="font-bold !text-[#FFFFFF]">
                        {email}
                      </span>
                      .
                    </p>
                  </div>

                  <form
                    onSubmit={handleVerifyOtp}
                    className="space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="code"
                        className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                      >
                        Verification code
                      </label>

                      <input
                        id="code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={code}
                        onChange={(event) =>
                          setCode(
                            event.target.value
                              .replace(/\D/g, "")
                              .slice(0, 6)
                          )
                        }
                        placeholder="000000"
                        required
                        className="h-16 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-center text-2xl font-bold tracking-[0.5em] text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-gold/10"
                      />
                    </div>

                    {message && (
                      <div className="rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm leading-6 text-gold-light">
                        {message}
                      </div>
                    )}

                    {error && (
                      <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={
                        loading || code.length !== 6
                      }
                      className="flex h-13 w-full items-center justify-center rounded-xl bg-gold px-5 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading
                        ? "Verifying..."
                        : "Verify and continue"}
                    </button>
                  </form>

                  <div className="mt-7 flex flex-col items-center gap-4 text-sm">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resending}
                      className="font-bold text-gold transition hover:text-gold-light disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {resending
                        ? "Sending new code..."
                        : "Resend verification code"}
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="text-zinc-500 transition hover:!text-[#FFFFFF]"
                    >
                      Back to sign in
                    </button>
                  </div>
                </>
              ) : step === "forgot" ? (
                <>
                  <div className="mb-8 text-center">
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-gold">
                      Account recovery
                    </p>

                    <h2 className="text-3xl font-bold tracking-tight !text-[#FFFFFF] sm:text-4xl">
                      Reset your password
                    </h2>

                    <p className="mt-3 text-sm leading-6 !text-[#FFFFFF]">
                      Enter the email address associated
                      with your NAXODEX account.
                    </p>
                  </div>

                  <form
                    onSubmit={
                      handleRequestPasswordReset
                    }
                    className="space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="reset-email"
                        className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                      >
                        Email address
                      </label>

                      <input
                        id="reset-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        required
                        className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-gold/10"
                      />
                    </div>

                    {error && (
                      <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-13 w-full items-center justify-center rounded-xl bg-gold px-5 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading
                        ? "Sending code..."
                        : "Send reset code"}
                    </button>
                  </form>

                  <div className="mt-7 flex justify-center">
                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="text-sm text-zinc-500 transition hover:!text-[#FFFFFF]"
                    >
                      Back to sign in
                    </button>
                  </div>
                </>
              ) : step === "resetOtp" ? (
                <>
                  <div className="mb-8 text-center">
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-gold">
                      Account recovery
                    </p>

                    <h2 className="text-3xl font-bold tracking-tight !text-[#FFFFFF] sm:text-4xl">
                      Check your email
                    </h2>

                    <p className="mt-3 text-sm leading-6 !text-[#FFFFFF]">
                      We sent a 6-digit password reset code
                      to{" "}
                      <span className="font-bold !text-[#FFFFFF]">
                        {email}
                      </span>
                      .
                    </p>
                  </div>

                  <form
                    onSubmit={handleContinueReset}
                    className="space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="reset-code"
                        className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                      >
                        Password reset code
                      </label>

                      <input
                        id="reset-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={code}
                        onChange={(event) =>
                          setCode(
                            event.target.value
                              .replace(/\D/g, "")
                              .slice(0, 6)
                          )
                        }
                        placeholder="000000"
                        required
                        className="h-16 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-center text-2xl font-bold tracking-[0.5em] text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-gold/10"
                      />
                    </div>

                    {message && (
                      <div className="rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm leading-6 text-gold-light">
                        {message}
                      </div>
                    )}

                    {error && (
                      <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={
                        loading || code.length !== 6
                      }
                      className="flex h-13 w-full items-center justify-center rounded-xl bg-gold px-5 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Continue
                    </button>
                  </form>

                  <div className="mt-7 flex flex-col items-center gap-4 text-sm">
                    <button
                      type="button"
                      onClick={
                        handleResendPasswordReset
                      }
                      disabled={resending}
                      className="font-bold text-gold transition hover:text-gold-light disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {resending
                        ? "Sending new code..."
                        : "Resend reset code"}
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="text-zinc-500 transition hover:!text-[#FFFFFF]"
                    >
                      Back to sign in
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-8 text-center">
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-gold">
                      Account recovery
                    </p>

                    <h2 className="text-3xl font-bold tracking-tight !text-[#FFFFFF] sm:text-4xl">
                      Create new password
                    </h2>

                    <p className="mt-3 text-sm leading-6 !text-[#FFFFFF]">
                      Choose a new password for your
                      NAXODEX account.
                    </p>
                  </div>

                  <form
                    onSubmit={handleResetPassword}
                    className="space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="new-password"
                        className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                      >
                        New password
                      </label>

                      <input
                        id="new-password"
                        type="password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(event) =>
                          setNewPassword(
                            event.target.value
                          )
                        }
                        placeholder="Enter your new password"
                        required
                        minLength={8}
                        className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-gold/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                      >
                        Confirm new password
                      </label>

                      <input
                        id="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(
                            event.target.value
                          )
                        }
                        placeholder="Confirm your new password"
                        required
                        minLength={8}
                        className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-gold/10"
                      />
                    </div>

                    {error && (
                      <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-13 w-full items-center justify-center rounded-xl bg-gold px-5 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading
                        ? "Updating password..."
                        : "Update password"}
                    </button>
                  </form>

                  <div className="mt-7 flex justify-center">
                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="text-sm text-zinc-500 transition hover:!text-[#FFFFFF]"
                    >
                      Back to sign in
                    </button>
                  </div>
                </>
              )}

              <div className="mt-10 flex items-center justify-center gap-2 text-xs !text-[#FFFFFF]">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Protected by secure authentication
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
