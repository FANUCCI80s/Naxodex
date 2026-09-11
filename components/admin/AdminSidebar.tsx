"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  BarChart3,
  Check,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

const navigation = [
  {
    label: "Admin Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "KYC",
    href: "/admin/kyc",
    icon: ShieldCheck,
  },
  {
    label: "Deposit Settings",
    href: "/admin/deposit-settings",
    icon: ArrowDownToLine,
  },
  {
    label: "Withdrawal Settings",
    href: "/admin/withdrawal-settings",
    icon: ArrowUpFromLine,
  },
  {
    label: "Transactions",
    href: "/admin/transactions",
    icon: ArrowLeftRight,
  },
  {
    label: "Balance Management",
    href: "/admin/balances",
    icon: CircleDollarSign,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: Mail,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to log out.");
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Admin logout error:", error);
      setLoggingOut(false);
      alert("Unable to log out. Please try again.");
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/10 bg-[#050505] lg:flex">
        {/* Logo / Brand */}
        <div className="border-b border-white/10 px-6 py-5">
          <Link
            href="/admin"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
              <Image
                src="/branding/NAXODEX-logo.png"
                alt="NAXODEX"
                width={40}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>

            <div>
              <p className="font-bold tracking-tight !text-[#FFFFFF]">
                NAXODEX
              </p>

              <p className="mt-0.5 text-xs !text-[#FFFFFF]">
                Administration
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] !text-[#FFFFFF]">
            Administration
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                    active
                      ? "bg-gold/10 font-medium text-gold"
                      : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
                      active
                        ? "bg-gold/10 text-gold"
                        : "text-zinc-500 group-hover:text-zinc-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>

                  <span>{item.label}</span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" />
                  )}
                </Link>
              );
            })}

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="group mt-3 flex w-full items-center gap-3 border-t border-white/10 px-4 py-4 pt-5 text-left text-sm text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10 transition group-hover:bg-red-500/15">
                <LogOut
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </span>

              <span>
                {loggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </nav>

        {/* Bottom Account Area */}
        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 text-sm font-bold text-gold">
                A
              </div>

              <div className="min-w-0">
                <p className="text-xs !text-[#FFFFFF]">
                  Administrator
                </p>

                <p className="mt-0.5 truncate text-sm font-bold !text-[#FFFFFF]">
                  Admin Panel
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="mt-3 block rounded-xl border border-white/10 px-4 py-3 text-center text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
          >
            User Dashboard
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050505]/95 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/admin"
            className="flex items-center gap-3"
          >
            <Image
              src="/branding/NAXODEX-logo.png"
              alt="NAXODEX"
              width={40}
              height={40}
              className="h-9 w-auto object-contain"
            />

            <div>
              <p className="text-sm font-bold !text-[#FFFFFF]">
                NAXODEX
              </p>

              <p className="text-[10px] !text-[#FFFFFF]">
                Administration
              </p>
            </div>
          </Link>

          <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[10px] font-bold text-gold">
            ADMIN
          </span>
        </div>

        {/* Mobile Navigation */}
        <div className="border-t border-white/5">
          <nav className="flex gap-1 overflow-x-auto px-3 py-2">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs transition ${
                    active
                      ? "bg-gold/10 font-medium text-gold"
                      : "text-zinc-500 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon
                    className="h-3.5 w-3.5"
                    strokeWidth={1.8}
                  />

                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Logout */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut
                className="h-3.5 w-3.5"
                strokeWidth={1.8}
              />

              <span>
                {loggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}