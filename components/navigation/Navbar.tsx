"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
const [mobileOpen, setMobileOpen] = useState(false);

return ( <header className="border-b border-white/[0.06] bg-[#050505]/90 backdrop-blur-xl"> <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
{/* Logo */} <Link
       href="/"
       className="flex items-center"
       aria-label="NAXODEX home"
     > <Image
         src="/branding/NAXODEX-LOGO.png"
         alt="NAXODEX"
         width={200}
         height={58}
         priority
         className="block h-12 w-auto object-contain sm:h-13"
       /> </Link>


    {/* Desktop Navigation */}
    <nav className="hidden items-center gap-8 lg:flex">
      <a
        href="#markets"
        className="text-sm text-zinc-400 transition hover:!text-[#FFFFFF]"
      >
        Markets
      </a>

      <a
        href="#why-NAXODEX"
        className="text-sm text-zinc-400 transition hover:!text-[#FFFFFF]"
      >
        Why NAXODEX
      </a>

      <a
        href="#how-it-works"
        className="text-sm text-zinc-400 transition hover:!text-[#FFFFFF]"
      >
        How It Works
      </a>
    </nav>

    {/* Desktop Actions */}
    <div className="hidden items-center gap-3 lg:flex">
      <Link
        href="/login"
        className="rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-300 transition hover:bg-white/[0.05] hover:!text-[#FFFFFF]"
      >
        Log In
      </Link>

      <Link
        href="/signup"
        className="rounded-xl bg-gold px-5 py-2.5 text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold"
      >
        Get Started
      </Link>
    </div>

    {/* Mobile Menu Button */}
    <button
      type="button"
      onClick={() => setMobileOpen(!mobileOpen)}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 !text-[#FFFFFF] transition hover:border-gold/40 hover:bg-gold/[0.06] lg:hidden"
      aria-label={mobileOpen ? "Close menu" : "Open menu"}
      aria-expanded={mobileOpen}
    >
      {mobileOpen ? (
        /* Close Icon */
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path
            d="M6 6l12 12M18 6 6 18"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        /* Hamburger Icon */
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  </div>

  {/* Mobile Navigation */}
  {mobileOpen && (
    <div className="border-t border-white/[0.06] bg-[#050505] px-6 py-5 lg:hidden">
      <nav className="flex flex-col gap-2">
        <a
          href="#markets"
          onClick={() => setMobileOpen(false)}
          className="rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
        >
          Markets
        </a>

        <a
          href="#why-NAXODEX"
          onClick={() => setMobileOpen(false)}
          className="rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
        >
          Why NAXODEX
        </a>

        <a
          href="#how-it-works"
          onClick={() => setMobileOpen(false)}
          className="rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
        >
          How It Works
        </a>

        {/* Download App */}
        <Link
          href="/download"
          onClick={() => setMobileOpen(false)}
          className="rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
        >
          Download App
        </Link>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm text-zinc-300 transition hover:bg-white/[0.04] hover:!text-[#FFFFFF]"
          >
            Log In
          </Link>

          <Link
            href="/signup"
            onClick={() => setMobileOpen(false)}
            className="rounded-xl bg-gold px-4 py-3 text-center text-sm font-bold !text-[#FFFFFF] transition hover:bg-gold"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </div>
  )}
</header>


);
}
