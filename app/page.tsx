import Navbar from "@/components/navigation/Navbar";
import Hero from "@/components/landing/Hero";
import MarketsPreview from "@/components/landing/MarketsPreview";
import WhyNAXODEX from "@/components/landing/WhyNAXODEX";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import ContactForm from "@/components/landing/ContactForm";
import FAQ from "@/components/landing/FAQ";
import ActivityNotifications from "@/components/landing/ActivityNotifications";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";
import MarketTicker from "@/components/landing/MarketTicker";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#080808] !text-[#FFFFFF]">
      <Navbar />

      <Hero />

      <MarketTicker />

      {/* Recent deposit and withdrawal activity */}
      <ActivityNotifications />

      <MarketsPreview />

      <WhyNAXODEX />

      <HowItWorks />

      <Testimonials />

      <ContactForm />

      <FAQ />

      <FinalCta />

      <Footer />
    </main>
  );
}
