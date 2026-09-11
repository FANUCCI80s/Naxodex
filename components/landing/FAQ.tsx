"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is NAXODEX?",
    answer: (
      <>
        <p>
          NAXODEX is a premium digital wealth-management platform designed to
          help individuals build, manage, protect, and preserve their wealth
          through structured investment opportunities, intelligent portfolio
          management, financial planning, and long-term wealth strategies.
        </p>

        <p className="mt-4">
          The platform combines a refined digital experience with security,
          personalized investment solutions, global accessibility, and tools
          designed around both wealth growth and legacy planning.
        </p>
      </>
    ),
  },
  {
    question: "How do I create an account?",
    answer: (
      <p>
        Select <strong>Sign Up</strong> or <strong>Get Started</strong> and
        provide the required account information to begin the registration
        process. Complete the verification steps to activate your account,
        then proceed with the required KYC verification to complete your
        onboarding.
      </p>
    ),
  },
  {
    question: "Do I need to complete KYC?",
    answer: (
      <p>
        Yes.{" "}
        <strong>KYC (Know Your Customer) verification is required by law</strong>{" "}
        and is an essential part of maintaining a secure and compliant
        financial environment. It allows us to verify your identity, help
        prevent fraud and financial crime, and meet applicable regulatory and
        legal requirements. You will need to complete the KYC process before
        you can access certain account features and services.
      </p>
    ),
  },
  {
    question: "What markets can I trade?",
    answer: (
      <>
        <p>
          NAXODEX provides access to a range of global financial markets,
          allowing you to monitor and explore market opportunities across
          multiple asset classes. Available markets and assets are displayed
          on the <strong>Markets</strong> page and may include cryptocurrencies,
          equities, commodities, and other supported financial instruments.
        </p>

        <p className="mt-4">
          Market availability and asset information are updated regularly to
          provide you with current market data.
        </p>
      </>
    ),
  },
  {
    question: "How can I deposit funds?",
    answer: (
      <>
        <p>
          To deposit funds, log in to your NAXODEX account and navigate to the
          Deposit section. Select your preferred deposit method, choose the
          available cryptocurrency and network, and enter the amount you wish
          to deposit. Follow the provided payment instructions and submit the
          required proof of payment where applicable.
        </p>

        <p className="mt-4">
          Once submitted, your deposit request will be reviewed. Your account
          balance will be updated after the deposit has been successfully
          verified and approved.
        </p>
      </>
    ),
  },
  {
    question: "How long does a deposit take?",
    answer: (
      <>
        <p>
          Deposit processing times may vary depending on the selected deposit
          method, cryptocurrency network, and verification process. Once you
          submit your deposit request and any required proof of payment, it
          will be reviewed for verification.
        </p>

        <p className="mt-4">
          You can monitor the status of your deposit directly from your
          NAXODEX account. Your balance will be updated once the deposit has
          been successfully verified and approved.
        </p>
      </>
    ),
  },
  {
    question: "How do withdrawals work?",
    answer: (
      <>
        <p>
          To make a <strong>withdrawal</strong>, log in to your NAXODEX account
          and navigate to the Withdrawal section. Enter the amount you wish to
          withdraw, select the available cryptocurrency and network, and
          provide the destination wallet address.
        </p>

        <p className="mt-4">
          Once you submit your withdrawal request, it will be reviewed and
          verified before processing. You can monitor the status of your
          request from your account, and the funds will be sent to your
          designated wallet once the withdrawal has been approved.
        </p>
      </>
    ),
  },
  {
    question: "Is my account protected?",
    answer: (
      <>
        <p>
          Yes. NAXODEX is designed with multiple security and verification
          measures to help protect your account, personal information, and
          transactions. We apply appropriate safeguards throughout the
          platform and continuously work to maintain a secure environment for
          our users.
        </p>

        <p className="mt-4">
          For your own protection, we also recommend using a strong, unique
          password, keeping your login credentials confidential, and completing
          all required account verification steps.
        </p>
      </>
    ),
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative overflow-hidden border-t border-white/5 bg-[#050505] py-24 sm:py-28"
    >
      {/* Background image */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage:
            "url('/branding/new-background-mobile-1.jpg')",
        }}
      />

      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[#050505]/85" />

      {/* Cinematic gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-transparent to-[#050505]/95" />

      {/* Gold ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            FAQ
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight !text-[#FFFFFF] sm:text-4xl lg:text-5xl">
            Frequently asked questions
          </h2>

          <p className="mt-5 text-base leading-7 !text-[#FFFFFF] sm:text-lg">
            Find answers to some of the most common questions about NAXODEX
            Portfolio.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="mt-14 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-2xl border backdrop-blur-md transition duration-300 ${
                  isOpen
                    ? "border-gold/20 bg-black/50"
                    : "border-white/10 bg-black/35 hover:border-white/15 hover:bg-black/45"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <span className="text-sm font-bold !text-[#FFFFFF] sm:text-base">
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg transition duration-300 ${
                      isOpen
                        ? "rotate-45 border-gold/30 bg-gold/10 text-gold"
                        : "border-white/10 bg-white/5 text-gray-400"
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-sm leading-7 !text-[#FFFFFF] sm:text-base">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}