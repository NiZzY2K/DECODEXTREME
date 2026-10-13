import React from 'react';
import Footer from '../components/Footer';
import ContactSection from '../components/ContactSection';
import { Shield, Award, Users, ArrowUpRight } from 'lucide-react';

const pastAmbassadors = [
  { year: "2025", name: "Amasha Senaratne", role: "IEEEXtreme 19.0 Lead Ambassador", institution: "SLTC Research University" },
  { year: "2024", name: "Kavindu Jayasundara", role: "IEEEXtreme 18.0 Ambassador", institution: "SLTC Research University" },
  { year: "2023", name: "Nuwan Bandara", role: "IEEEXtreme 17.0 Ambassador", institution: "SLTC Research University" }
];

const Portfolio = ({ onOpenRegister }) => {
  return (
    <div className="relative min-h-screen w-full bg-transparent text-[var(--color-text)] pt-28">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="section-label mb-4">
          <span>ARCHIVE // THE BROTHERHOOD</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight mb-6">
          <span className="section-heading-outline block">OUR TEAM</span>
          <span className="font-display font-bold uppercase tracking-tight text-[var(--color-primary)] block">&amp; LEGACY</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-base md:text-lg max-w-2xl font-body leading-relaxed">
          Meet the minds coordinating DecodeXtreme 2026. Organized by the IEEE Student Branch of SLTC and its Computer Society Chapter to inspire competitive excellence.
        </p>
      </div>

      {/* Operatives Cards */}
      <ContactSection />

      {/* Past Ambassadors Legacy Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 border-t border-[var(--color-border)]">
        <div className="text-xs font-mono text-[var(--color-primary)] uppercase tracking-widest mb-4">
          // HISTORICAL LINEAGE
        </div>
        <h3 className="text-3xl md:text-4xl font-display font-bold mb-8 text-[var(--color-text)]">
          Past IEEEXtreme Ambassadors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pastAmbassadors.map((item) => (
            <div key={item.year} className="animus-card p-6 hud-bracket">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-2xl font-bold text-[var(--color-primary)]">{item.year}</span>
                <Award size={18} className="text-[var(--color-text-muted)]" />
              </div>
              <h4 className="font-display font-bold text-lg text-[var(--color-text)]">{item.name}</h4>
              <p className="font-mono text-xs text-[var(--color-text-muted)] mt-1">{item.role}</p>
              <div className="text-[11px] font-mono text-[var(--color-text-dim)] mt-4 pt-3 border-t border-[var(--color-border)]">
                {item.institution}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer onOpenRegister={onOpenRegister} />
    </div>
  );
};

export default Portfolio;
