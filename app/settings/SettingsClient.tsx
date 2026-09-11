"use client";

import DashboardNav from "@/components/dashboard/DashboardNav";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
};

type SettingsResponse = {
  success: boolean;
  user?: UserProfile;
  message?: string;
};

export default function SettingsClient() {
  const [user, setUser] = useState<UserProfile | null>(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/profile", {
        method: "GET",
        cache: "no-store",
      });

      const data: SettingsResponse = await response.json();

      if (!response.ok || !data.success || !data.user) {
        throw new Error(
          data.message || "Unable to load your profile."
        );
      }

      setUser(data.user);
      setEmail(data.user.email);
      setPhone(data.user.phone || "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          phone: phone.trim() || null,
        }),
      });

      const data: SettingsResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to save your settings."
        );
      }

      if (data.user) {
        setUser(data.user);
        setEmail(data.user.email);
        setPhone(data.user.phone || "");
      }

      setMessage("Your settings have been saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] !text-[#FFFFFF]">
        <div className="flex min-h-screen items-center justify-center px-5">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-gold" />

            <p className="mt-4 text-sm !text-[#FFFFFF]">
              Loading settings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] !text-[#FFFFFF]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#050505] lg:flex lg:flex-col">
          <div className="border-b border-white/10 p-5">
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
                <img
                  src="/branding/NAXODEX-logo.png"
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
              <span>⌂</span>
              Dashboard
            </Link>

            <Link
              href="/trade"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              <span>↗</span>
              Trade
            </Link>

            <Link
              href="/deposit"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              <span>↓</span>
              Deposit
            </Link>

            <Link
              href="/withdraw"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              <span>↑</span>
              Withdraw
            </Link>

            <Link
              href="/transactions"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              <span>↔</span>
              Transactions
            </Link>

            <div className="my-5 border-t border-white/10" />

            <Link
              href="/notifications"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
            >
              <span>●</span>
              Notifications
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-xl bg-gold/10 px-4 py-3 text-sm font-bold text-gold"
            >
              <span>⚙</span>
              Settings
            </Link>
          </nav>

          <div className="border-t border-white/10 p-4">
            <Link
              href="/dashboard"
              className="block rounded-xl border border-white/10 px-4 py-3 text-center text-sm text-zinc-400 transition hover:border-white/20 hover:!text-[#FFFFFF]"
            >
              Back to dashboard
            </Link>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1">
          {/* Shared Dashboard mobile navigation */}
          <DashboardNav />

          <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
            {/* Header */}
            <div className="mb-8">
              <p className="mb-2 text-sm font-bold text-gold">
                Account
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Settings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 !text-[#FFFFFF]">
                Manage your account information and
                security preferences.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/5 p-5">
                <p className="text-sm font-bold text-red-300">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm !text-[#FFFFFF]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={loadProfile}
                  className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:!text-[#FFFFFF]"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Success */}
            {message && (
              <div className="mb-6 rounded-2xl border border-gold/20 bg-gold/5 p-5">
                <p className="text-sm font-bold text-gold-light">
                  Settings updated
                </p>

                <p className="mt-1 text-sm !text-[#FFFFFF]">
                  {message}
                </p>
              </div>
            )}

            <div className="space-y-6">
              {/* Personal information */}
              <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                  <h2 className="font-bold">
                    Personal information
                  </h2>

                  <p className="mt-1 text-xs !text-[#FFFFFF]">
                    Your registered name cannot be changed.
                  </p>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-bold !text-[#FFFFFF]">
                        First name
                      </label>

                      <input
                        type="text"
                        value={user?.firstName || ""}
                        disabled
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm !text-[#FFFFFF] outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold !text-[#FFFFFF]">
                        Last name
                      </label>

                      <input
                        type="text"
                        value={user?.lastName || ""}
                        disabled
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm !text-[#FFFFFF] outline-none"
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-xs !text-[#FFFFFF]">
                    Your legal name is tied to your account and
                    KYC information. Contact support if it needs
                    to be corrected.
                  </p>
                </div>
              </section>

              {/* Contact information */}
              <form
                onSubmit={handleSave}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
              >
                <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                  <h2 className="font-bold">
                    Contact information
                  </h2>

                  <p className="mt-1 text-xs !text-[#FFFFFF]">
                    Update the email address and phone number
                    connected to your account.
                  </p>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-xs font-bold !text-[#FFFFFF]"
                      >
                        Email address
                      </label>

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        required
                        autoComplete="email"
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/40 focus:ring-1 focus:ring-gold/20"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-xs font-bold !text-[#FFFFFF]"
                      >
                        Phone number
                      </label>

                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(event) =>
                          setPhone(event.target.value)
                        }
                        autoComplete="tel"
                        placeholder="+1 555 000 0000"
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:!text-[#FFFFFF] focus:border-gold/40 focus:ring-1 focus:ring-gold/20"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-gold px-5 py-3 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </div>
              </form>

              {/* Security */}
              <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                  <h2 className="font-bold">
                    Security
                  </h2>

                  <p className="mt-1 text-xs !text-[#FFFFFF]">
                    Manage your account password and security.
                  </p>
                </div>

                <div className="divide-y divide-white/[0.06]">
                  <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <div>
                      <p className="text-sm font-bold">
                        Password
                      </p>

                      <p className="mt-1 text-xs !text-[#FFFFFF]">
                        Change the password used to access your
                        account.
                      </p>
                    </div>

                    <Link
                      href="/settings/password"
                      className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:!text-[#FFFFFF]"
                    >
                      Change password
                    </Link>
                  </div>

                  <div className="flex flex-col gap-4 p-6 sm:px-8">
                    <div>
                      <p className="text-sm font-bold">
                        Login verification
                      </p>

                      <p className="mt-1 text-xs leading-5 !text-[#FFFFFF]">
                        New devices may require an OTP sent to
                        your registered email address before
                        access is granted.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-gold" />

                      <span className="text-xs text-gold-light">
                        Email verification enabled
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Account */}
              <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                  <h2 className="font-bold">
                    Account
                  </h2>

                  <p className="mt-1 text-xs !text-[#FFFFFF]">
                    Additional account information.
                  </p>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-xs !text-[#FFFFFF]">
                      Account ID
                    </p>

                    <p className="mt-2 break-all font-mono text-sm !text-[#FFFFFF]">
                      {user?.id || "Unavailable"}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}