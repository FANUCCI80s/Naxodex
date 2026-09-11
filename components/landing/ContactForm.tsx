"use client";

import { FormEvent, useState } from "react";
import {
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

type FormStatus = "idle" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function scrollToSection(id: string) {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("idle");
    setLoading(true);

    try {
      if (
        !form.name.trim() ||
        !form.email.trim() ||
        !form.subject.trim() ||
        !form.message.trim()
      ) {
        throw new Error("Please complete all fields.");
      }

      if (!form.email.includes("@")) {
        throw new Error("Please enter a valid email address.");
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      setStatus("success");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-white/5 bg-[#050505] py-24 sm:py-28"
    >
      {/* Background image */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
        style={{
          backgroundImage:
            "url('/branding/new-background-mobile-2.jpg')",
        }}
      />

      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[#050505]/80" />

      {/* Cinematic gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-transparent to-[#050505]/95" />

      {/* Gold ambient glows */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-gold/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-gold/5 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          {/* Contact Information */}
          <div>
            <span className="inline-flex rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Contact
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight !text-[#FFFFFF] sm:text-4xl">
              Have a question?
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 !text-[#FFFFFF]">
              Send a message to the NAXODEX team. Tell us what you
              need help with and our team will review your request.
            </p>

            <div className="mt-8 space-y-4">
              {/* General Support → FAQ */}
              <button
                type="button"
                onClick={() => scrollToSection("faq")}
                className="group w-full rounded-2xl border border-white/10 bg-black/30 p-5 text-left backdrop-blur-sm transition duration-300 hover:border-gold/40 hover:bg-gold/[0.04]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold transition duration-300 group-hover:scale-105 group-hover:bg-gold/15">
                    <MessageCircle
                      className="h-5 w-5"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-bold !text-[#FFFFFF]">
                        General support
                      </h3>

                      <ArrowUpRight
                        className="h-5 w-5 shrink-0 text-zinc-500 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                        strokeWidth={1.8}
                      />
                    </div>

                    <p className="mt-1 text-sm leading-6 !text-[#FFFFFF]">
                      Questions about your account, platform features,
                      or general assistance.
                    </p>
                  </div>
                </div>
              </button>

              {/* Account Assistance → Contact Form */}
              <button
                type="button"
                onClick={() => scrollToSection("send-message")}
                className="group w-full rounded-2xl border border-white/10 bg-black/30 p-5 text-left backdrop-blur-sm transition duration-300 hover:border-gold/40 hover:bg-gold/[0.04]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold transition duration-300 group-hover:scale-105 group-hover:bg-gold/15">
                    <ShieldCheck
                      className="h-5 w-5"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-bold !text-[#FFFFFF]">
                        Account assistance
                      </h3>

                      <ArrowUpRight
                        className="h-5 w-5 shrink-0 text-zinc-500 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                        strokeWidth={1.8}
                      />
                    </div>

                    <p className="mt-1 text-sm leading-6 !text-[#FFFFFF]">
                      Need help with account access, verification,
                      deposits, or withdrawals?
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div
            id="send-message"
            className="scroll-mt-24 rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-8"
          >
            <div className="mb-7">
              <h3 className="text-xl font-bold !text-[#FFFFFF]">
                Send us a message
              </h3>

              <p className="mt-2 text-sm !text-[#FFFFFF]">
                Complete the form below and provide as much detail as
                possible.
              </p>
            </div>

            {status === "success" && (
              <div className="mb-6 rounded-2xl border border-gold/20 bg-gold/10 p-4">
                <p className="text-sm font-bold text-gold">
                  Message submitted successfully.
                </p>

                <p className="mt-1 text-sm text-gold/80">
                  Thank you for contacting NAXODEX.
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                <p className="text-sm font-bold text-red-400">
                  Please complete all fields with valid information.
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                  >
                    Name
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Your name"
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm !text-[#FFFFFF] outline-none transition placeholder:!text-[#FFFFFF]/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                  >
                    Email
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm !text-[#FFFFFF] outline-none transition placeholder:!text-[#FFFFFF]/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                >
                  Subject
                </label>

                <input
                  id="contact-subject"
                  type="text"
                  value={form.subject}
                  onChange={(event) =>
                    updateField("subject", event.target.value)
                  }
                  placeholder="How can we help?"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm !text-[#FFFFFF] outline-none transition placeholder:!text-[#FFFFFF]/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-bold !text-[#FFFFFF]"
                >
                  Message
                </label>

                <textarea
                  id="contact-message"
                  value={form.message}
                  onChange={(event) =>
                    updateField("message", event.target.value)
                  }
                  placeholder="Tell us how we can help..."
                  required
                  rows={6}
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm !text-[#FFFFFF] outline-none transition placeholder:!text-[#FFFFFF]/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-gold px-5 py-3.5 text-sm font-bold !text-[#FFFFFF] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send message"}
              </button>

              <p className="text-center text-xs leading-5 !text-[#FFFFFF]">
                Never include your password, OTP, or other sensitive
                authentication information in this form.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}