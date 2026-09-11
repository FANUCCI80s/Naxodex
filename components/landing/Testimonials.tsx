"use client";

import { useEffect, useState } from "react";

const testimonials = [
  {
    quote:
      "The interface feels clean and focused. I can find the account information I need without fighting through a complicated dashboard.",
    name: "Michael R.",
    role: "NAXODEX User",
    image: "/michael.jpg",
    rating: 5,
  },
  {
    quote:
      "I like having my market activity and account management experience organized in one place. Everything feels much easier to navigate.",
    name: "Daniel K.",
    role: "NAXODEX User",
    image: "/daniel.jpg",
    rating: 4,
  },
  {
    quote:
      "The platform has a modern feel and makes the overall investment experience much easier to navigate.",
    name: "Sarah M.",
    role: "NAXODEX User",
    image: "/sarah.jpg",
    rating: 5,
  },
  {
    quote:
      "Everything feels thoughtfully organized. The experience is straightforward without losing the premium feel of the platform.",
    name: "James A.",
    role: "NAXODEX User",
    image: "/james.jpg",
    rating: 4,
  },
  {
    quote:
      "NAXODEX gives me a much clearer view of my account and investments. The overall experience feels polished and easy to understand.",
    name: "Olivia T.",
    role: "NAXODEX User",
    image: "/olivia.jpg",
    rating: 5,
  },
  {
    quote:
      "The platform makes it easy to keep track of my financial activity while maintaining a clean and professional experience.",
    name: "Alexander M.",
    role: "NAXODEX User",
    image: "/alexander.jpg",
    rating: 4,
  },
  {
    quote:
      "I appreciate how the platform brings everything together in a way that feels structured, intuitive, and easy to use.",
    name: "Jonathan R.",
    role: "NAXODEX User",
    image: "/jonathan.jpg",
    rating: 5,
  },
  {
    quote:
      "The overall experience feels refined and well considered. I can move through my account without unnecessary complexity.",
    name: "Marcus T.",
    role: "NAXODEX User",
    image: "/marcus.jpg",
    rating: 4,
  },
  {
    quote:
      "NAXODEX gives the entire experience a sense of clarity. The interface feels premium while remaining simple to understand.",
    name: "Amelia R.",
    role: "NAXODEX User",
    image: "/amelia.jpg",
    rating: 5,
  },
  {
    quote:
      "The platform provides a smooth and organized experience. I especially like how easy it is to find the information I need.",
    name: "Sophia K.",
    role: "NAXODEX User",
    image: "/sophia.jpg",
    rating: 4,
  },
  {
    quote:
      "The combination of a polished interface and straightforward navigation makes managing my account feel much more comfortable.",
    name: "Victoria A.",
    role: "NAXODEX User",
    image: "/victoria.jpg",
    rating: 5,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeTestimonial = testimonials[activeIndex];

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const goToPrevious = () => {
    setActiveIndex(
      (current) =>
        (current - 1 + testimonials.length) % testimonials.length,
    );
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden border-t border-white/[0.06] py-28"
    >
      {/* Background image */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/branding/new-background-mobile-1.jpg')",
        }}
      />

      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[#050505]/80" />

      {/* Bottom/top cinematic gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-transparent to-[#050505]/95" />

      {/* Gold ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.07] blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            User Experience
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight !text-[#FFFFFF] sm:text-5xl">
            Built to feel simple.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 !text-[#FFFFFF]">
            A focused platform experience designed to keep your account,
            investments, and financial journey easy to navigate.
          </p>
        </div>

        {/* Testimonial */}
        <div
          className="mx-auto mt-14 max-w-4xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.10] bg-black/40 p-8 shadow-2xl backdrop-blur-md sm:p-12 lg:p-16">
            {/* Subtle card glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gold/[0.08] blur-[80px]" />

            {/* Large quote mark */}
            <div className="pointer-events-none absolute right-8 top-2 select-none font-serif text-[9rem] leading-none text-gold/[0.10] sm:right-12">
              “
            </div>

            <div className="relative">
              {/* Rating */}
              <div
                className="flex gap-1 text-lg"
                aria-label={`${activeTestimonial.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={
                      index < activeTestimonial.rating
                        ? "text-gold"
                        : "text-white/20"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <div className="mt-8 min-h-[150px] sm:min-h-[130px]">
                <blockquote
                  key={`quote-${activeIndex}`}
                  className="animate-[fadeIn_0.5s_ease-out] text-xl leading-9 !text-[#FFFFFF] sm:text-2xl sm:leading-10"
                >
                  “{activeTestimonial.quote}”
                </blockquote>
              </div>

              {/* User */}
              <div className="mt-8 flex items-center gap-4 border-t border-white/[0.08] pt-7">
                {/* Profile image */}
                <div
                  key={`image-${activeIndex}`}
                  className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gold/30 bg-black/30 shadow-lg animate-[fadeIn_0.5s_ease-out]"
                >
                  <img
                    src={activeTestimonial.image}
                    alt={`${activeTestimonial.name} profile`}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Name and role */}
                <div
                  key={`user-${activeIndex}`}
                  className="animate-[fadeIn_0.5s_ease-out]"
                >
                  <p className="text-sm font-bold !text-[#FFFFFF]">
                    {activeTestimonial.name}
                  </p>

                  <p className="mt-1 text-xs !text-white/60">
                    {activeTestimonial.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="relative mt-10 flex items-center justify-between border-t border-white/[0.08] pt-6">
              {/* Indicators */}
              <div className="flex max-w-[70%] flex-wrap items-center gap-2">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.name}
                    type="button"
                    aria-label={`View testimonial from ${testimonial.name}`}
                    aria-current={activeIndex === index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? "w-8 bg-gold"
                        : "w-1.5 bg-white/20 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              {/* Previous / Next */}
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={goToPrevious}
                  aria-label="Previous testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition duration-300 hover:border-gold/30 hover:bg-gold/10 hover:text-gold"
                >
                  <span className="text-lg">←</span>
                </button>

                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Next testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition duration-300 hover:border-gold/30 hover:bg-gold/10 hover:text-gold"
                >
                  <span className="text-lg">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-5 h-px w-full overflow-hidden bg-white/[0.08]">
            <div
              key={`progress-${activeIndex}`}
              className="h-full bg-gold/60"
              style={{
                animation: isPaused
                  ? "none"
                  : "testimonialProgress 6s linear",
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes testimonialProgress {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}