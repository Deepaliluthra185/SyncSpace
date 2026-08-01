import NavBar from '@/components/landing/NavBar';
import HeroSection from '@/components/landing/HeroSection';
import SocialProofBar from '@/components/landing/SocialProofBar';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTAFooter from '@/components/landing/CTAFooter';

export const displayName = 'SyncSpace — Landing Page';
export const screenSize = 'desktop';

export default function LandingPage() {
  return (
  <div className="bg-background font-body h-screen w-full overflow-y-auto overflow-x-hidden">
    <NavBar />
    <HeroSection />
    <SocialProofBar />
    <FeaturesSection />
    <TestimonialsSection />
    <CTAFooter />
  </div>
  );
}
