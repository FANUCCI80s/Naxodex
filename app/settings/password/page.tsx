
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  ArrowUp,
  Bell,
  LayoutDashboard,
  LockKeyhole,
  Settings,
  ShieldCheck,
} from "lucide-react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Your new password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        "Your new password must be different from your current password."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to change your password.");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccess(
        "Your password has been changed successfully."
      );
    } catch (error) {
      console.error("Change password error:", error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] !text-[#FFFFFF]">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#050505] lg:flex lg:flex-col">
          <div className="border-b border-white/10 p-5">
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
                <img
                  src="/branding/NAXODEX-LOGO.png"
                  alt="NAXODEX"
                  className="h-8 w-auto object-contain"
                />
              </div>

              <div>
                <p className="font-bold tracking-tight">
                  NAXODEX
                </p>

                <p className="text-xs !text-[#FFFFFF]">
                  Trading platform
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              Dashboard
            </Link>

            <Link
              href="/trade"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              <ArrowRightLeft className="h-4 w-4 shrink-0" />
              Trade
            </Link>

            <Link
              href="/deposit"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              <ArrowDown className="h-4 w-4 shrink-0" />
              Deposit
            </Link>

            <Link
              href="/withdraw"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              <ArrowUp className="h-4 w-4 shrink-0" />
              Withdraw
            </Link>

            <Link
              href="/transactions"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              <ArrowRightLeft className="h-4 w-4 shrink-0" />
              Transactions
            </Link>

            <div className="my-5 border-t border-white/10" />

            <Link
              href="/notifications"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              <Bell className="h-4 w-4 shrink-0" />
              Notifications
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-xl bg-gold/10 px-4 py-3 text-sm font-bold text-gold"
            >
              <Settings className="h-4 w-4 shrink-0" />
              Settings
            </Link>
          </nav>

          <div className="border-t border-white/10 p-4">
            <Link
              href="/settings"
              className="block rounded-xl border border-white/10 px-4 py-3 text-center text-sm text-zinc-400 transition hover:border-white/20 hover:!text-[#FFFFFF]"
            >
              Back to settings
            </Link>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1">
          <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:px-10">
            {/* Header */}
            <div className="mb-8">
              <p className="text-sm font-bold text-gold">
                Account security
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Change password
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 !text-[#FFFFFF]">
                Update your NAXODEX account password.
                Choose a strong password that you do not use
                elsewhere.
              </p>
            </div>

            {/* Security notice */}
            <div className="mb-6 rounded-2xl border border-gold/20 bg-gold/[0.05] p-5">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <LockKeyhole className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-bold">
                    Keep your account secure
                  </p>

                  <p className="mt-1 text-sm leading-6 !text-[#FFFFFF]">
                    Use at least 8 characters and avoid using
                    passwords that are easy to guess.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div>
                <p className="text-sm !text-[#FFFFFF]">
                  Password
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Update your password
                </h2>

                <p className="mt-2 text-sm leading-6 !text-[#FFFFFF]">
                  Enter your current password, then choose
                  and confirm your new password.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                  >
                    Current password
                  </label>

                  <input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    placeholder="Enter your current password"
                    className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-gold/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                  >
                    New password
                  </label>

                  <input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                    placeholder="At least 8 characters"
                    className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-gold/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                  >
                    Confirm new password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Repeat your new password"
                    className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-gold/10"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3">
                    <p className="text-sm text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                {success && (
                  <div className="rounded-xl border border-gold/20 bg-gold/[0.05] px-4 py-3">
                    <p className="text-sm text-gold">
                      {success}
                    </p>
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Link
                    href="/settings"
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-white/20 hover:!text-[#FFFFFF]"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-gold px-5 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Updating password..."
                      : "Update password"}
                  </button>
                </div>
              </form>
            </section>

            {/* Additional security information */}
            <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <p className="text-sm !text-[#FFFFFF]">
                Security
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Additional protection
              </h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-gold" />

                    <p className="text-sm font-bold">
                      New-device verification
                    </p>
                  </div>

                  <p className="mt-1 text-sm leading-6 !text-[#FFFFFF]">
                    New devices require email OTP verification
                    before access is granted.
                  </p>

                  <span className="mt-3 inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-bold text-gold">
                    Enabled
                  </span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-gold" />

                    <p className="text-sm font-bold">
                      Account notifications
                    </p>
                  </div>

                  <p className="mt-1 text-sm leading-6 !text-[#FFFFFF]">
                    Important account and security messages
                    are available in your notifications.
                  </p>

                  <Link
                    href="/notifications"
                    className="mt-3 inline-flex items-center gap-1 text-sm text-gold transition hover:text-gold-light"
                  >
                    View notifications
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>

            <div className="mt-8 flex justify-center">
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:!text-[#FFFFFF]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to settings
              </Link>
            </div>

            <p className="mt-6 text-center text-xs !text-[#FFFFFF]">
              NAXODEX • Account Security
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

