

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Star,
  X,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Market Watchlist",
    href: "/market-watchlist",
    icon: Star,
  },
  {
    label: "Trade",
    href: "/trade",
    icon: ArrowLeftRight,
  },
  {
    label: "Deposit",
    href: "/deposit",
    icon: ArrowDownToLine,
  },
  {
    label: "Withdraw",
    href: "/withdraw",
    icon: ArrowUpFromLine,
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
];

const secondaryNavItems = [
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      setOpen(false);

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
      console.error("Logout error:", error);

      setLoggingOut(false);

      alert("Unable to log out. Please try again.");
    }
  };

  return (
    <>
      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-white/10 bg-[#050505] lg:flex">
        {/* Logo */}
        <div className="border-b border-white/10 px-6 py-7">
          <Link
            href="/dashboard"
            className="inline-flex items-center"
          >
            <img
              src="/branding/NAXODEX-logo.png"
              alt="NAXODEX"
              className="block h-10 w-auto max-w-[190px] object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-gold/10 font-bold text-gold"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
                }`}
              >
                <Icon
                  className="h-5 w-5 shrink-0"
                  strokeWidth={1.8}
                />

                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="my-5 border-t border-white/10" />

          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-gold/10 font-bold text-gold"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
                }`}
              >
                <Icon
                  className="h-5 w-5 shrink-0"
                  strokeWidth={1.8}
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-xs !text-[#FFFFFF]">
              Signed in
            </p>

            <Link
              href="/settings"
              className="mt-1 block text-sm font-bold text-zinc-300 transition hover:!text-[#FFFFFF]"
            >
              Account settings
            </Link>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm !text-[#FFFFFF] transition hover:bg-red-400/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut
              className="h-5 w-5 shrink-0"
              strokeWidth={1.8}
            />

            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* =========================================================
          MOBILE / TABLET MENU BUTTON
      ========================================================= */}
      <div className="absolute right-5 top-5 z-30 sm:right-8 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#050505] !text-[#FFFFFF] shadow-lg transition hover:border-gold/30 hover:bg-gold/10 hover:text-gold"
        >
          <Menu
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* =========================================================
          OVERLAY
      ========================================================= */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* =========================================================
          MOBILE / TABLET DRAWER
      ========================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-white/10 bg-[#050505] shadow-2xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-7">
          <Link
            href="/dashboard"
            onClick={closeMenu}
            className="inline-flex items-center"
          >
            <img
              src="/branding/NAXODEX-logo.png"
              alt="NAXODEX"
              className="block h-10 w-auto max-w-[190px] object-contain"
            />
          </Link>

          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close navigation"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.05] hover:!text-[#FFFFFF]"
          >
            <X
              className="h-5 w-5"
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-gold/10 font-bold text-gold"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
                }`}
              >
                <Icon
                  className="h-5 w-5 shrink-0"
                  strokeWidth={1.8}
                />

                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="my-5 border-t border-white/10" />

          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-gold/10 font-bold text-gold"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
                }`}
              >
                <Icon
                  className="h-5 w-5 shrink-0"
                  strokeWidth={1.8}
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Logout */}
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm !text-[#FFFFFF] transition hover:bg-red-400/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut
              className="h-5 w-5 shrink-0"
              strokeWidth={1.8}
            />

            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}

