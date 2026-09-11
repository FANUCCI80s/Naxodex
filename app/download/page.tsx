
"use client";

import Image from "next/image";
import Link from "next/link";

export default function DownloadPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/branding/new-background-mobile-1.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Large Background NAXODEX Logo */}
      <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
        <Image
          src="/branding/NAXODEX-logo.png"
          alt=""
          width={900}
          height={300}
          priority
          sizes="80vw"
          className="w-[75%] max-w-[850px] object-contain opacity-20"
        />
      </div>

      {/* Subtle gradient */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black/20 via-transparent to-black/75" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="px-6 py-6 sm:px-10 sm:py-8">
          <Link
            href="/"
            className="inline-flex items-center"
            aria-label="NAXODEX Home"
          >
            <Image
              src="/branding/NAXODEX-logo.png"
              alt="NAXODEX"
              width={180}
              height={60}
              priority
              className="h-auto w-[145px] object-contain sm:w-[175px]"
            />
          </Link>
        </header>

        {/* Main */}
        <section className="flex flex-1 items-center justify-center px-6 pb-16 pt-10 sm:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-gold sm:text-sm">
              NAXODEX Mobile
            </p>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Our mobile app
              <br />
              is launching soon.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              The NAXODEX Android experience is coming soon.
              We are carefully crafting a seamless mobile
              experience for managing and growing your wealth
              wherever you are.
            </p>

            <div className="mx-auto mt-10 h-px w-20 bg-gold/60" />

            <p className="mt-6 text-sm text-white/60">
              Android app coming soon
            </p>

            {/* Back to Open Page Button */}
            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-gold/70 bg-transparent px-7 py-3 text-sm font-semibold text-gold transition-all duration-300 hover:border-gold hover:bg-transparent hover:text-gold"
              >
                Back to Open Page
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 pb-7 text-center sm:px-10">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} NAXODEX. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}

