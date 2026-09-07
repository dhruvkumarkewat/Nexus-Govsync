import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import TrustedStrip from '../../components/TrustedStrip';
import ProblemSection from '../../components/ProblemSection';
import HowItWorks from '../../components/HowItWorks';
import PlatformSection from '../../components/PlatformSection';
import WorkflowSection from '../../components/WorkflowSection';
import SecuritySection from '../../components/SecuritySection';
import ImpactSection from '../../components/ImpactSection';
import CTASection from '../../components/CTASection';
import Footer from '../../components/Footer';

export default function AdminLanding() {
  return (
    <div className="min-h-screen bg-ink text-paper selection:bg-gold/30">
      <Navbar />
      <main>
        <Hero />
        <TrustedStrip />
        <ProblemSection />
        <HowItWorks />
        <PlatformSection />
        <WorkflowSection />
        <SecuritySection />
        <ImpactSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
