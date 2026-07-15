'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import TopCampaigns from '@/components/TopCampaigns';
import Testimonials from '@/components/Testimonials';
import { HowItWorks, Categories, ImpactStats } from '@/components/ExtraSections';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <HeroSlider />
        <TopCampaigns />
        <HowItWorks />
        <Categories />
        <ImpactStats />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
