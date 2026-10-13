import React from 'react';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import logo from '../assets/DecodeXtreme Logo.webp';
import fallbackLogo from '../assets/logo.png';
import './Footer.css';

const Footer = ({ onOpenRegister }) => (
  <footer className="relative bg-[var(--color-bg-elevated)] text-[var(--color-text)] pt-20 pb-12 overflow-hidden border-t border-[var(--color-border)]">
    {/* Grid overlay */}
    <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-[0.06]" />

    {/* Top glow */}
    <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-[var(--color-primary)]/6 blur-[80px]" />

    <div className="content-rail relative z-10">

      {/* Top Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-[var(--color-border)] sm:gap-12">

        {/* Brand Column */}
        <div className="lg:col-span-5 space-y-6">
          <a href="/" className="inline-block group" aria-label="DecodeXtreme 2026 Homepage">
            <img
              src={logo}
              onError={(e) => { e.currentTarget.src = fallbackLogo; }}
              alt="DecodeXtreme 2026"
              className="h-10 w-auto object-contain transition-opacity duration-200 group-hover:opacity-100 opacity-85"
            />
          </a>

          <p className="text-[var(--color-text-muted)] text-sm leading-relaxed max-w-sm font-body">
            <strong className="text-[var(--color-text)]">THINK. SOLVE. COMPETE. BEYOND.</strong><br />
            Three open virtual sessions and one SLTC team challenge. Step into the Animus to prepare for IEEEXtreme 20.0 with the IEEE Student Branch of SLTC.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(var(--color-primary-rgb),0.07)] border border-[var(--color-border-strong)] text-xs font-mono text-[var(--color-primary)]">
            <ShieldCheck size={14} />
            <span>100% Free Entry · No IEEE Membership Needed</span>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="lg:col-span-2 space-y-4 font-mono text-xs">
          <div className="text-[var(--color-primary)] uppercase tracking-widest font-bold mb-4">
            // EXPLORE
          </div>
          <ul className="space-y-2.5 text-[var(--color-text-muted)]">
            <li><a href="/#about" className="hover:text-[var(--color-text)] transition-colors">The Creed</a></li>
            <li><a href="/#timeline" className="hover:text-[var(--color-text)] transition-colors">Mission Timeline</a></li>
            <li><a href="/#program" className="hover:text-[var(--color-text)] transition-colors">Program &amp; Sessions</a></li>
            <li><a href="/#prizes" className="hover:text-[var(--color-text)] transition-colors">Prizes &amp; Awards</a></li>
            <li><a href="/#guide" className="hover:text-[var(--color-text)] transition-colors">Delegate Guide</a></li>
          </ul>
        </div>

        {/* Competition Column */}
        <div className="lg:col-span-2 space-y-4 font-mono text-xs">
          <div className="text-[var(--color-primary)] uppercase tracking-widest font-bold mb-4">
            // COMPETITION
          </div>
          <ul className="space-y-2.5 text-[var(--color-text-muted)]">
            <li><a href="/#operatives" className="hover:text-[var(--color-text)] transition-colors">Our Team</a></li>
            <li>
              <button
                type="button"
                onClick={() => onOpenRegister?.('individual')}
                className="text-left hover:text-[var(--color-primary)] transition-colors cursor-pointer"
              >
                Register Online
              </button>
            </li>
            <li>
              <a href="https://ieeextreme.org/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors inline-flex items-center gap-1">
                IEEEXtreme Global <ArrowUpRight size={11} />
              </a>
            </li>
            <li>
              <a href="https://sltc.ac.lk/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors inline-flex items-center gap-1">
                SLTC University <ArrowUpRight size={11} />
              </a>
            </li>
          </ul>
        </div>

        {/* Organizers Column */}
        <div className="lg:col-span-3 space-y-4 font-mono text-xs">
          <div className="text-[var(--color-primary)] uppercase tracking-widest font-bold mb-4">
            // ORGANIZERS
          </div>
          <div className="text-[var(--color-text-muted)] space-y-2 leading-relaxed">
            <div className="text-[var(--color-text)] font-bold">IEEE Student Branch of SLTC</div>
            <div>Computer Society Student Chapter</div>
            <div className="text-[var(--color-text-dim)] text-[11px] pt-2">
              Padukka, Western Province, Sri Lanka<br />
              sltcieeesb@gmail.com
            </div>
          </div>
        </div>

      </div>

      {/* Meta Copyright Bar */}
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--color-text-dim)]">
        <div>
          © 2026 DecodeXtreme. Organized by IEEE SB of SLTC. All rights reserved.
        </div>
        <div className="text-[var(--color-text-dim)]">
          Animus Protocol v4.88 · SLTC Research University
        </div>
      </div>

      {/* Giant Watermark */}
      <div
        className="w-full text-center mt-12 select-none pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="text-[12vw] font-display font-black tracking-tighter text-[var(--color-primary)]/[0.03] uppercase leading-none whitespace-nowrap">
          DECODEXTREME
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;
