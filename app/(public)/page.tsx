import { Navbar } from "@/components/shared/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { MetricsPreview } from "@/components/landing/MetricsPreview";
import { ProgressPreview } from "@/components/landing/ProgressPreview";
import { CTASection } from "@/components/landing/CTASection";
import { Logo } from "@/components/shared/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar variant="landing" />
      <main>
        <Hero />
        <HowItWorks />
        <MetricsPreview />
        <ProgressPreview />
        <CTASection />
      </main>
      <footer className="border-t border-white/5 py-10 text-center text-sm text-slate-600">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <p>© {new Date().getFullYear()} SpeakUp. Built for daily speakers.</p>
        </div>
      </footer>
    </div>
  );
}
