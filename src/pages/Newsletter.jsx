import React from 'react';
import Footer from '../components/Footer';
import { Bell, Calendar, ArrowUpRight, Radio, CheckCircle2 } from 'lucide-react';

const updates = [
  {
    date: "09 OCTOBER 2026",
    tag: "PORTAL LAUNCH",
    title: "DecodeXtreme 2026 Portal & Registration Matrix Online",
    summary: "The official event portal has been deployed. Individual registrations for Awareness, Fundamentals, and Strategy sessions are open to students globally.",
    urgent: true
  },
  {
    date: "05 OCTOBER 2026",
    tag: "WIREmatRIX APPROVED",
    title: "SLTC PreXtreme Challenge Roster Protocol Confirmed",
    summary: "Team registration requirements for the 24 October 9-hour HackerRank challenge have been confirmed. Exactly 3 SLTC undergraduate members required per team.",
    urgent: false
  },
  {
    date: "01 OCTOBER 2026",
    tag: "ORGANIZER STATEMENT",
    title: "IEEE Computer Society SLTC Joins Forces with SB",
    summary: "Joint organizing partnership confirmed to facilitate comprehensive algorithmic coaching ahead of the global IEEEXtreme 20.0 competition.",
    urgent: false
  }
];

const Newsletter = ({ onOpenRegister }) => {
  return (
    <div className="relative min-h-screen w-full bg-transparent text-[var(--color-text)] pt-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="section-label mb-4">
          <span>BROADCAST // EVENT DISPATCHES</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight mb-6">
          <span className="section-heading-outline block">EVENT</span>
          <span className="font-display font-bold uppercase tracking-tight text-[var(--color-primary)] block">Updates &amp; Bulletins</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-base md:text-lg max-w-2xl font-body leading-relaxed mb-12">
          Latest official dispatches from the DecodeXtreme organizing team and IEEE Student Branch of SLTC.
        </p>

        {/* Updates Feed */}
        <div className="space-y-6 max-w-4xl">
          {updates.map((item, idx) => (
            <div key={idx} className="animus-card p-6 md:p-8 hud-bracket group hover:border-[var(--color-primary)]/50 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="font-mono text-xs text-[var(--color-primary)] font-semibold flex items-center gap-2">
                  <Radio size={13} className={item.urgent ? "animate-pulse" : ""} />
                  {item.tag}
                </span>
                <span className="font-mono text-xs text-gray-500">{item.date}</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white group-hover:text-[var(--color-primary)] transition-colors mb-3">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed font-body">
                {item.summary}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-white/[0.02] border border-white/10 max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-display font-bold text-xl text-white">Ready to initiate your preparation?</h4>
            <p className="text-xs text-gray-400 font-mono mt-1">Enroll individually or register your 3-member SLTC roster.</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenRegister?.('individual')}
            className="px-8 py-3.5 bg-[var(--color-primary)] text-white rounded-full font-display font-bold text-xs uppercase tracking-wider hover:bg-[var(--color-electric-aqua)] transition-all cursor-pointer whitespace-nowrap shadow-sm"
          >
            Register Now
          </button>
        </div>
      </div>

      <Footer onOpenRegister={onOpenRegister} />
    </div>
  );
};

export default Newsletter;
