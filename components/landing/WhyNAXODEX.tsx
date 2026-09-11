const features = [
  {
    number: "01",
    title: "Built for clarity",
    text: "A clean interface keeps important account and market information easy to understand.",
  },
  {
    number: "02",
    title: "Account control",
    text: "Manage your account, deposits, withdrawals, verification, and trading activity from one place.",
  },
  {
    number: "03",
    title: "Security focused",
    text: "Authentication, verification, sessions, and account controls are built into the platform architecture.",
  },
  {
    number: "04",
    title: "Designed to scale",
    text: "The platform is structured to grow with additional markets, features, and trading tools.",
  },
];

export default function WhyNAXODEX() {
  return (
    <section
      id="why-NAXODEX"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#050505] py-28"
    >
      {/* Background image */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
        style={{
          backgroundImage:
            "url('/branding/new-background-mobile-1.jpg')",
        }}
      />

      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[#050505]/80" />

      {/* Cinematic gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-transparent to-[#050505]/95" />

      {/* Gold ambient glow */}
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-gold/[0.06] blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          {/* Introduction */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Why NAXODEX
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight !text-[#FFFFFF] sm:text-5xl">
              A trading experience built around you.
            </h2>

            <p className="mt-6 max-w-lg leading-7 !text-[#FFFFFF]">
              From account onboarding to market activity, NAXODEX is
              designed to make the experience straightforward without
              sacrificing the tools you need.
            </p>

            <div className="mt-8 h-px w-24 bg-gold/50" />
          </div>

          {/* Features */}
          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="group relative overflow-hidden rounded-3xl border border-white/[0.09] bg-black/40 p-7 shadow-2xl backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-gold/30 hover:bg-gold/[0.04]"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/[0.07] opacity-0 blur-[70px] transition duration-500 group-hover:opacity-100" />

                <div className="relative">
                  <span className="text-xs font-bold text-gold">
                    {feature.number}
                  </span>

                  <h3 className="mt-5 text-lg font-bold !text-[#FFFFFF]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 !text-[#FFFFFF]">
                    {feature.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}