"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup() {
    if (loading) {
      return;
    }

    setError("");

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanFirstName || !cleanLastName) {
      setError("Please enter your first and last name.");
      return;
    }

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: cleanFirstName,
          lastName: cleanLastName,
          email: cleanEmail,
          password,
        }),
      });

      const contentType =
        response.headers.get("content-type") || "";

      let data: {
        success?: boolean;
        message?: string;
      } = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error(
          "Signup API returned non-JSON response:",
          text
        );
      }

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to create your account. Please try again."
        );
        return;
      }

      router.push("/login");
    } catch (signupError) {
      console.error(
        "Signup request error:",
        signupError
      );

      setError(
        "Unable to connect to NAXODEX. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function clearError() {
    if (error) {
      setError("");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] !text-[#FFFFFF]">
      {/* =====================================================
          RESPONSIVE BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {/* Desktop */}
        <div
          className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat lg:block"
          style={{
            backgroundImage:
              "url('/branding/background.jpg')",
          }}
        />

        {/* Mobile */}
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

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_25%,rgba(0,0,0,0.45)_100%)]" />
      </div>

      {/* =====================================================
          PAGE CONTENT
          ===================================================== */}

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        {/* ===================================================
            LEFT BRAND PANEL
            =================================================== */}

        <section className="relative hidden overflow-hidden border-r border-white/10 lg:flex">
          <div className="relative flex w-full flex-col justify-between px-12 py-12 xl:px-16 xl:py-16">
            {/* Logo */}
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

            {/* Main message */}
            <div className="mx-auto w-full max-w-xl xl:mx-0">
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-gold">
                Start investing smarter
              </p>

              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight !text-[#FFFFFF] xl:text-7xl">
                Build your
                <br />
                financial NAXODEX.
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 !text-[#FFFFFF]">
                Create your NAXODEX account and get access
                to a modern platform designed for managing
                your investments across global markets.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  "Access crypto, forex, and global markets",
                  "Track your portfolio from one dashboard",
                  "Secure account authentication",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm !text-[#FFFFFF]"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-xs font-bold text-gold">
                      ✓
                    </span>

                    {item}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm !text-[#FFFFFF]">
              © {new Date().getFullYear()} NAXODEX
            </p>
          </div>
        </section>

        {/* ===================================================
            RIGHT SIGNUP PANEL
            =================================================== */}

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:bg-black/40 lg:backdrop-blur-sm">
          <div className="w-full max-w-md">
            {/* Mobile centered logo */}
            <div className="mb-10 flex justify-center lg:hidden">
              <Image
                src="/branding/NAXODEX-LOGO.png"
                alt="NAXODEX"
                width={210}
                height={62}
                priority
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Signup card */}
            <div className="rounded-3xl border border-gold/20 bg-[#0B0B0B]/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8">
              <div className="mb-8 text-center">
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-gold">
                  Create your account
                </p>

                <h2 className="text-3xl font-bold tracking-tight !text-[#FFFFFF] sm:text-4xl">
                  Get started
                </h2>

                <p className="mt-3 text-sm leading-6 !text-[#FFFFFF]">
                  Create your account to start using
                  NAXODEX.
                </p>
              </div>

              <div className="space-y-5">
                {/* FIRST + LAST NAME */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                    >
                      First name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(event) => {
                        setFirstName(event.target.value);
                        clearError();
                      }}
                      placeholder="John"
                      maxLength={100}
                      disabled={loading}
                      className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                    >
                      Last name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(event) => {
                        setLastName(event.target.value);
                        clearError();
                      }}
                      placeholder="Doe"
                      maxLength={100}
                      disabled={loading}
                      className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      clearError();
                    }}
                    placeholder="you@example.com"
                    disabled={loading}
                    className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      clearError();
                    }}
                    placeholder="At least 8 characters"
                    minLength={8}
                    disabled={loading}
                    className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                  >
                    Confirm password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      clearError();
                    }}
                    placeholder="Repeat your password"
                    minLength={8}
                    disabled={loading}
                    className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* ERROR */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300"
                  >
                    {error}
                  </div>
                )}

                {/* SUBMIT */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSignup}
                  className="flex h-13 w-full items-center justify-center rounded-xl bg-gold px-5 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Creating account..."
                    : "Create account"}
                </button>
              </div>

              <p className="mt-8 text-center text-sm !text-[#FFFFFF]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-gold transition hover:text-gold-light"
                >
                  Sign in
                </Link>
              </p>

              <div className="mt-10 flex items-center justify-center gap-2 text-xs !text-[#FFFFFF]">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Secure account creation
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
