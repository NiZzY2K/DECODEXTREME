import React from 'react';
import Footer from '../components/Footer';
import GuidelinesSection from '../components/GuidelinesSection';
import PrizesSection from '../components/PrizesSection';

const Pages = ({ onOpenRegister }) => {
  return (
    <div className="relative min-h-screen w-full bg-transparent text-[var(--color-text)] pt-24">
      <GuidelinesSection />
      <PrizesSection />
      <Footer onOpenRegister={onOpenRegister} />
    </div>
  );
};

export default Pages;
