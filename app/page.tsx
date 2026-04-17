import { LandingNav } from '@/components/landing/LandingNav';
import { HeroSection } from '@/components/landing/HeroSection';
import { PlatformOverviewSection } from '@/components/landing/PlatformOverviewSection';
import { TrustSection } from '@/components/landing/TrustSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { EmotionalSection } from '@/components/landing/EmotionalSection';
import { VideoSection } from '@/components/landing/VideoSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main>
        <HeroSection />
        <PlatformOverviewSection />
        <TrustSection />
        <HowItWorksSection />
        <FeaturesSection />
        <EmotionalSection />
        <VideoSection />
        <PricingSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </>
  );
}
