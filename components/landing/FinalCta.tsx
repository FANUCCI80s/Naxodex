import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-[#050505] py-28">
      {/* Section background */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage:
            "url('/branding/new-background-mobile-2.jpg')",
        }}
      />

      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[#050505]/85" />

      {/* Cinematic gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-transparent to-[#050505]/95" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-gold/20 bg-black/45 px-6 py-20 text-center shadow-2xl backdrop-blur-md sm:px-12">
          {/* CTA background image */}
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage:
                "url('/branding/new-background-mobile-2.jpg')",
            }}
          />

          {/* CTA overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[#050505]/55" />

          {/* Gold glows */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />

          <div className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-gold/[0.07] blur-3xl" />

          <div className="relative">
            <img
              src="/branding/NAXODEX-logo.png"
              alt="NAXODEX"
              className="mx-auto h-9 w-auto object-contain"
            />

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-gold">
              NAXODEX
            </p>

            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight !text-[#FFFFFF] sm:text-6xl">
              Build your NAXODEX in the markets.
            </h2>

            <p className="mx-auto mt-6 max-w-xl leading-7 !text-[#FFFFFF]">
              Create your NAXODEX account and access a modern
              environment for managing your market journey.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-2xl bg-gold px-7 py-4 text-sm font-bold !text-[#FFFFFF] transition hover:brightness-110"
              >
                Create Your Account
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-bold !text-[#FFFFFF] transition hover:border-gold/30 hover:bg-white/[0.07]"
              >
                Log In
              </Link>
            </div>

            <p className="mt-7 text-[11px] !text-[#FFFFFF]">
              Market activity involves risk. Past performance does not
              guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
