const steps = [
  {
    number: "01",
    title: "Create your account",
    text: "Register your NAXODEX account and complete the required account verification.",
  },
  {
    number: "02",
    title: "Fund your account",
    text: "Choose an available deposit method and follow the instructions shown in your account.",
  },
  {
    number: "03",
    title: "Explore the markets",
    text: "Monitor crypto, forex, and stock opportunities through your trading environment.",
  },
  {
    number: "04",
    title: "Manage your portfolio",
    text: "Track your activity, balances, transactions, and account information from your dashboard.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-white/[0.06] py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            How It Works
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight !text-[#FFFFFF] sm:text-5xl">
            Start in four simple steps.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 !text-[#FFFFFF]">
            Everything you need to get started is organized inside your NAXODEX
            Portfolio account.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-3xl border border-white/[0.07] bg-[#050505] p-7"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-sm font-bold text-gold">
                {step.number}
              </div>

              <h3 className="mt-7 text-lg font-bold !text-[#FFFFFF]">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 !text-[#FFFFFF]">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
