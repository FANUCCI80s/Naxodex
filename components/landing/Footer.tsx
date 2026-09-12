
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_auto_auto]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/branding/NAXODEX-LOGO.png"
                alt="NAXODEX"
                className="h-9 w-auto object-contain"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 !text-[#FFFFFF]">
              A modern trading platform for crypto, forex, and stock markets.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] !text-[#FFFFFF]">
              Platform
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/login"
                className="text-sm text-zinc-600 hover:!text-[#FFFFFF]"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="text-sm text-zinc-600 hover:!text-[#FFFFFF]"
              >
                Sign Up
              </Link>

              <Link
                href="/dashboard"
                className="text-sm text-zinc-600 hover:!text-[#FFFFFF]"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] !text-[#FFFFFF]">
              Account
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/login?redirect=/settings"
                className="text-sm text-zinc-600 hover:!text-[#FFFFFF]"
              >
                Settings
              </Link>

              <Link
                href="/login?redirect=/transactions"
                className="text-sm text-zinc-600 hover:!text-[#FFFFFF]"
              >
                Transactions
              </Link>

              <Link
                href="/login?redirect=/notifications"
                className="text-sm text-zinc-600 hover:!text-[#FFFFFF]"
              >
                Notifications
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-7 text-xs !text-[#FFFFFF] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} NAXODEX. All rights reserved.
          </p>

          <p>Trading involves risk. Markets can move rapidly.</p>
        </div>
      </div>
    </footer>
  );
}

