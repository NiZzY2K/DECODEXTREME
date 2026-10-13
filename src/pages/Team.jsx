import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Users, ShieldCheck, ExternalLink, Sparkles, Building2, Terminal } from 'lucide-react';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const pastAmbassadors = [
  {
    year: '2025',
    name: 'Amasha Senaratne',
    role: 'IEEEXtreme 19.0 Lead Ambassador',
    institution: 'SLTC Research University',
    achievement: 'Coordinated Sri Lanka national participation & university preparatory tracks.'
  },
  {
    year: '2024',
    name: 'Kavindu Jayasundara',
    role: 'IEEEXtreme 18.0 Ambassador',
    institution: 'SLTC Research University',
    achievement: 'Spearheaded algorithmic bootcamps and team proctoring infrastructure.'
  },
  {
    year: '2023',
    name: 'Nuwan Bandara',
    role: 'IEEEXtreme 17.0 Ambassador',
    institution: 'SLTC Research University',
    achievement: 'Pioneered early SLTC competitive programming chapters and student registrations.'
  }
];

const committees = [
  {
    name: 'Technical Operations & Proctoring',
    lead: 'Computer Society Executive Desk',
    scope: 'HackerRank environment setup, problem curation review, and 9-hour continuous proctoring oversight.'
  },
  {
    name: 'Delegate Affairs & Helpdesk',
    lead: 'Student Branch Secretariat',
    scope: 'Participant onboarding, WhatsApp dispatch network, Zoom session links, and inquiries.'
  },
  {
    name: 'Media, Branding & Identity',
    lead: 'Design & Communications Crew',
    scope: 'Cyberpunk HUD visual language, digital broadcasting, guidelines curation, and portal development.'
  }
];

const Team = ({ onOpenRegister }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[var(--color-bg)] text-[var(--color-text)] pt-24">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-16 h-96 w-96 rounded-full bg-[var(--color-primary)]/8 blur-[130px]" />
        <div className="absolute right-10 top-40 h-80 w-80 rounded-full bg-[var(--color-secondary)]/8 blur-[120px]" />
      </div>

      <div className="content-rail relative z-10 pt-8 pb-12">
        {/* Breadcrumb Back Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Mission Briefing (Home)
          </Link>
        </div>

        {/* Page Hero Header */}
        <div className="max-w-4xl space-y-5">
          <div className="section-label">
            <span>COMMAND MATRIX // ORGANIZING CREW &amp; OPERATIVES</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold uppercase tracking-tight text-[var(--color-text)]">
            <span className="section-heading-outline block">OUR TEAM</span>
            <span className="text-[var(--color-primary)] block">LEADERSHIP &amp; OPERATIVES</span>
          </h1>

          <p className="text-[var(--color-text-muted)] text-base sm:text-lg font-body leading-relaxed max-w-2xl">
            Meet the leaders and technical leads coordinating DecodeXtreme 2026. Jointly organized by the
            <strong className="text-[var(--color-text)]"> IEEE Student Branch of SLTC</strong> and the
            <strong className="text-[var(--color-text)]"> IEEE Computer Society Student Chapter</strong> to elevate competitive algorithmic mastery.
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 font-mono">
            <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="text-xl sm:text-2xl font-bold text-[var(--color-primary)]">04</div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-0.5">Command Operatives</div>
            </div>
            <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="text-xl sm:text-2xl font-bold text-[var(--color-primary)]">03</div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-0.5">Past Ambassadors</div>
            </div>
            <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="text-xl sm:text-2xl font-bold text-[var(--color-primary)]">02</div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-0.5">Host Chapters</div>
            </div>
            <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="text-xl sm:text-2xl font-bold text-emerald-500">100%</div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-0.5">Student Powered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Operatives Section (Cards + Contacts) */}
      <ContactSection />

      {/* Historical Lineage: Past Ambassadors */}
      <section className="relative w-full border-t border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24">
        <div className="content-rail">
          <div className="section-header mb-12">
            <div className="section-label">
              <span>HISTORICAL LINEAGE // SLTC IEEE LEGACY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight text-[var(--color-text)]">
              Past IEEEXtreme Ambassadors
            </h2>
            <p className="section-subtext">
              Honoring the university leaders who represented and advanced IEEEXtreme at SLTC across previous editions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastAmbassadors.map((ambassador) => (
              <div
                key={ambassador.year}
                className="animus-card p-6 sm:p-7 flex flex-col justify-between hud-bracket group hover:border-[var(--color-border-strong)] transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-5 border-b border-[var(--color-border)] pb-3">
                    <span className="font-mono text-2xl font-bold text-[var(--color-primary)]">
                      {ambassador.year}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[rgba(var(--color-primary-rgb),0.08)] text-[var(--color-primary)]">
                      <Award size={12} /> Ambassador
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                    {ambassador.name}
                  </h3>
                  <div className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)] mt-1">
                    {ambassador.role}
                  </div>
                  <p className="font-body text-xs text-[var(--color-text-muted)] mt-3 leading-relaxed">
                    {ambassador.achievement}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[var(--color-border)] font-mono text-[11px] text-[var(--color-text-dim)] flex items-center justify-between">
                  <span>{ambassador.institution}</span>
                  <span className="text-[var(--color-primary)]">VERIFIED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operational Units & Committees */}
      <section className="relative w-full border-t border-[var(--color-border)] bg-[var(--color-surface)] py-20">
        <div className="content-rail">
          <div className="section-header mb-12">
            <div className="section-label">
              <span>STRUCTURE // WORKING UNITS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold uppercase tracking-tight text-[var(--color-text)]">
              Support Desks &amp; Committees
            </h2>
            <p className="section-subtext">
              Specialized departments operating behind the scenes to deliver an uninterrupted competitive experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {committees.map((com, index) => (
              <div
                key={com.name}
                className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] space-y-3"
              >
                <div className="font-mono text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest">
                  // UNIT 0{index + 1}
                </div>
                <h4 className="font-display font-bold text-lg text-[var(--color-text)]">
                  {com.name}
                </h4>
                <div className="font-mono text-[11px] text-[var(--color-text-dim)] uppercase tracking-wider">
                  Lead: {com.lead}
                </div>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed font-body pt-1">
                  {com.scope}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Callout Banner */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg)] py-16">
        <div className="content-rail">
          <div className="p-8 sm:p-10 rounded-2xl border border-[var(--color-border-strong)] bg-gradient-to-r from-[rgba(var(--color-primary-rgb),0.06)] via-[var(--color-surface)] to-[rgba(var(--color-secondary-rgb),0.06)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-primary)] font-bold">
                // COMPETE WITH US
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-[var(--color-text)]">
                Ready to Join DecodeXtreme 2026?
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] max-w-xl">
                Open to all students across Sri Lanka and globally for virtual sessions, and SLTC undergraduates for the PreXtreme Hackathon.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onOpenRegister?.('individual')}
                className="px-6 py-3 rounded-lg font-display text-xs font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white hover:bg-[var(--color-electric-aqua)] transition-colors shadow-sm"
              >
                Register Now
              </button>
              <Link
                to="/#timeline"
                className="px-6 py-3 rounded-lg font-mono text-xs uppercase tracking-wider border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors text-[var(--color-text)]"
              >
                View Timeline
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer onOpenRegister={onOpenRegister} />
    </div>
  );
};

export default Team;
