import React from 'react';
import Footer from '../components/Footer';
import ServicesSection from '../components/ServicesSection';
import TimelineFullscreenMap from '../components/TimelineFullscreenMap';

const Services = ({ onOpenRegister }) => {
  return (
    <div className="relative min-h-screen w-full bg-transparent text-[var(--color-text)] pt-24">
      <ServicesSection onOpenRegister={onOpenRegister} />
      <TimelineFullscreenMap onOpenRegister={onOpenRegister} />
      <Footer onOpenRegister={onOpenRegister} />
    </div>
  );
};

export default Services;
