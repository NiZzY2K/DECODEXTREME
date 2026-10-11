import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight, Calendar, Clock, MapPin, Radio, Terminal } from 'lucide-react';
import questMap from '../assets/timeline-map.png';
import './TimelineSection.css';

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
  {
    checkpoint: '01',
    date: '12 OCTOBER 2026',
    time: '8:00 PM – 10:00 PM',
    code: 'SYNC-MEM-01',
    session: 'Awareness Session',
    title: 'Discover the Arena',
    description: 'De-anonymize the mystery of IEEEXtreme. Unpack the contest format, qualification pathways, score weighting, and global competitive dynamics.',
    platform: 'Zoom · Fully Online',
    audience: 'Open to Everyone Worldwide',
    entry: '100% Free · No IEEE Membership Needed',
    x: 18.2,
    y: 60.5
  },
  {
    checkpoint: '02',
    date: '14 OCTOBER 2026',
    time: '8:00 PM – 10:00 PM',
    code: 'SYNC-MEM-02',
    session: 'Programming Fundamentals',
    title: 'Algorithmic Foundations',
    description: 'Sharpen your hidden blade. Deep-dive into problem decomposition, algorithm classification, time/space complexity, and rigorous edge-case testing.',
    platform: 'Zoom · Fully Online',
    audience: 'Open to Everyone Worldwide',
    entry: '100% Free · Live Coding & Debugging',
    x: 46.4,
    y: 36.0
  },
  {
    checkpoint: '03',
    date: '21 OCTOBER 2026',
    time: '8:00 PM – 10:00 PM',
    code: 'SYNC-MEM-03',
    session: 'Advanced Strategy',
    title: 'Brotherhood Warfare',
    description: 'Contests are won through synergy, not solitude. Master 3-operative problem triage, fast sub-task dispatching, mental stamina, and contest execution.',
    platform: 'Zoom · Fully Online',
    audience: 'Open to Everyone Worldwide',
    entry: '100% Free · Interactive Team Scenarios',
    x: 83.7,
    y: 22.4
  },
  {
    checkpoint: '04',
    date: '24 OCTOBER 2026',
    time: '8:00 AM – 6:00 PM',
    code: 'PREXTREME-FINAL',
    session: 'PreXtreme 9-Hour Challenge',
    title: 'The Final Leap of Faith',
    description: 'Nine continuous hours of relentless algorithmic battle. Your captain leads a team of exactly three SLTC undergraduates against the HackerRank leaderboard.',
    platform: 'HackerRank · Real-Time Leaderboard',
    audience: 'SLTC Undergraduates Only (3-Member Teams)',
    entry: 'Free Entry · Exclusive SLTC Roster',
    x: 84.0,
    y: 69.8
  }
];

const TimelineSection = ({ onOpenRegister }) => {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=200%',
      pin: true,
      anticipatePin: 1,
      scrub: 0.5,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const nextIndex = Math.min(3, Math.floor(self.progress * 4));
        setActive(nextIndex);
      }
    });

    triggerRef.current = trigger;
    return () => {
      if (trigger) trigger.kill();
      triggerRef.current = null;
    };
  }, []);

  const goToStop = (index) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const targetScroll = trigger.start + (trigger.end - trigger.start) * ((index + 0.1) / 4);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  const currentEvent = timelineData[active];

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="quest-timeline relative w-full min-h-screen bg-transparent text-white overflow-hidden py-10"
      aria-label="DecodeXtreme 2026 Mission Path"
    >
      <div className="content-rail flex h-full flex-col justify-between">
        
        {/* Section Header */}
        <div className="section-header !mb-6 pt-4">
          <div className="section-label">
            <span>THE MISSION PATH // SYNCHRONIZING MEMORIES</span>
          </div>
          <div className="section-heading-wrap">
            <span className="section-heading-outline">FOUR CHECKPOINTS</span>
            <span className="section-heading-italic">One Final Leap</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mt-2">
            <Radio size={14} className="text-[var(--color-primary)] animate-pulse" />
            <span>SRI LANKA STANDARD TIME (UTC+05:30) · SCROLL TO SYNCHRONIZE</span>
          </div>
        </div>

        {/* Timeline Interactive Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-grow py-4">
          
          {/* Left: Animus Tactical Map */}
          <div className="lg:col-span-7 relative animus-card overflow-hidden p-2 hud-bracket shadow-2xl">
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#070b10]">
              <img
                src={questMap}
                alt="Tactical Animus Mission Map"
                className="w-full h-full object-cover opacity-60 filter contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040608] via-transparent to-transparent opacity-80" />

              {/* Connecting SVG Circuit Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[var(--color-primary)]/40" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  points="18.2,60.5 46.4,36.0 83.7,22.4 84.0,69.8"
                  fill="none"
                  strokeWidth="0.8"
                  strokeDasharray="2,2"
                />
              </svg>

              {/* Checkpoint Location Pins */}
              {timelineData.map((stop, idx) => (
                <button
                  key={stop.checkpoint}
                  onClick={() => goToStop(idx)}
                  style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300 group z-20 ${
                    idx === active ? 'scale-125' : 'scale-90 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Checkpoint ${stop.checkpoint}: ${stop.session}`}
                >
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border ${
                    idx === active
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/20 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.8)]'
                      : 'border-white/40 bg-black/80'
                  }`}>
                    {idx === active && (
                      <span className="absolute inset-0 rounded-full border border-[var(--color-primary)] animate-ping" />
                    )}
                    <span className="font-mono text-xs font-bold text-white">{stop.checkpoint}</span>
                  </div>

                  {/* Label tooltip */}
                  <span className={`absolute top-9 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap backdrop-blur-md transition-all ${
                    idx === active
                      ? 'bg-[var(--color-primary)] text-black font-bold'
                      : 'bg-black/70 text-gray-400 group-hover:text-white'
                  }`}>
                    {stop.session}
                  </span>
                </button>
              ))}

              <div className="absolute top-4 left-4 font-mono text-[10px] text-[var(--color-primary)] bg-black/80 px-2 py-1 rounded border border-white/10">
                RADAR: SECTOR SLTC // SYNCHRONIZING
              </div>
            </div>
          </div>

          {/* Right: Checkpoint Dossier Display */}
          <div className="lg:col-span-5 animus-card p-6 md:p-8 hud-bracket">
            
            {/* Header step progress */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-primary)]">
                  CHECKPOINT {currentEvent.checkpoint} / 04
                </span>
              </div>
              <span className="font-mono text-xs text-gray-500">{currentEvent.code}</span>
            </div>

            {/* Checkpoint Details */}
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                {currentEvent.session}
              </div>

              <h3 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
                {currentEvent.title}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed font-body">
                {currentEvent.description}
              </p>

              {/* Telemetry metadata rows */}
              <div className="pt-4 border-t border-white/10 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Calendar size={13} className="text-[var(--color-primary)]" /> DATE
                  </span>
                  <span className="text-white font-bold">{currentEvent.date}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Clock size={13} className="text-[var(--color-primary)]" /> TIME (SLT)
                  </span>
                  <span className="text-white">{currentEvent.time}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500 flex items-center gap-2">
                    <MapPin size={13} className="text-[var(--color-primary)]" /> PLATFORM
                  </span>
                  <span className="text-[var(--color-primary)]">{currentEvent.platform}</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Terminal size={13} className="text-[var(--color-primary)]" /> ACCESS
                  </span>
                  <span className="text-emerald-400">{currentEvent.entry}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={onOpenRegister}
                  className="px-6 py-2.5 bg-[var(--color-primary)] text-black rounded-full font-display font-bold text-xs uppercase tracking-wider hover:bg-[#1bc2c5] flex items-center gap-2 transition-all"
                >
                  Register Checkpoint <ArrowUpRight size={14} />
                </button>
                <span className="text-[11px] font-mono text-gray-500">Free Participation</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Horizontal Checkpoint Scrub Navigation */}
        <div className="border-t border-white/10 pt-4 pb-2">
          <div className="flex items-center justify-between gap-2 overflow-x-auto">
            {timelineData.map((item, idx) => (
              <button
                key={item.checkpoint}
                onClick={() => goToStop(idx)}
                className={`flex-1 py-2 px-3 rounded-lg font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
                  idx === active
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/15 text-[var(--color-primary)] font-bold'
                    : 'border-white/10 bg-white/[0.02] text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{item.checkpoint}</span>
                <span className="hidden sm:inline">{item.session}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TimelineSection;
