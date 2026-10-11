import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Calendar,
  Clock,
  MapPin,
  Radio,
  Terminal,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  Maximize2,
  Crosshair,
  Globe2,
  Compass
} from 'lucide-react';
import './TimelineFullscreenMap.css';

gsap.registerPlugin(ScrollTrigger);

export const timelineData = [
  {
    checkpoint: '01',
    date: '12 OCTOBER 2026',
    time: '8:00 PM – 10:00 PM',
    code: 'SYNC-MEM-01',
    session: 'Awareness Session',
    title: 'Discover the Arena',
    subtitle: 'Global Initiation Protocol',
    description:
      'De-anonymize the mystery of IEEEXtreme. Unpack the contest format, qualification pathways, score weighting, and global competitive dynamics across 100+ countries.',
    platform: 'Zoom · Fully Online',
    audience: 'Open to Everyone Worldwide',
    entry: '100% Free · No IEEE Membership Needed',
    sector: 'SECTOR 01 // GLOBAL TRANSMISSION',
    coordinates: '37°46\'N 122°25\'W',
    city: 'Global Grid (Western Hub)',
    x: 21.5,
    y: 49.0,
    panX: '4%',
    panY: '-2%',
    mobilePanX: '28.5%',
    mobilePanY: '0%'
  },
  {
    checkpoint: '02',
    date: '14 OCTOBER 2026',
    time: '8:00 PM – 10:00 PM',
    code: 'SYNC-MEM-02',
    session: 'Programming Fundamentals',
    title: 'Algorithmic Foundations',
    subtitle: 'Core Complexity Mastery',
    description:
      'Sharpen your hidden blade. Deep-dive into problem decomposition, algorithm classification, time/space complexity, and rigorous edge-case testing.',
    platform: 'Zoom · Fully Online',
    audience: 'Open to Everyone Worldwide',
    entry: '100% Free · Live Coding & Debugging',
    sector: 'SECTOR 02 // CODE ARCHIVE',
    coordinates: '51°30\'N 00°07\'W',
    city: 'EMEA Data Core (Citadel Matrix)',
    x: 43.5,
    y: 33.7,
    panX: '0%',
    panY: '4%',
    mobilePanX: '6.5%',
    mobilePanY: '14%'
  },
  {
    checkpoint: '03',
    date: '21 OCTOBER 2026',
    time: '8:00 PM – 10:00 PM',
    code: 'SYNC-MEM-03',
    session: 'Advanced Strategy',
    title: 'Brotherhood Warfare',
    subtitle: '3-Operative Triage Syndicate',
    description:
      'Contests are won through synergy, not solitude. Master 3-operative problem triage, fast sub-task dispatching, mental stamina, and contest execution under high-pressure scenarios.',
    platform: 'Zoom · Fully Online',
    audience: 'Open to Everyone Worldwide',
    entry: '100% Free · Interactive Team Scenarios',
    sector: 'SECTOR 03 // TACTICAL CELL',
    coordinates: '06°55\'N 79°51\'E',
    city: 'South Asia Nexus (SLTC Ground Command)',
    x: 65.7,
    y: 58.2,
    panX: '-8%',
    panY: '-5%',
    mobilePanX: '-15.5%',
    mobilePanY: '-14%'
  },
  {
    checkpoint: '04',
    date: '24 OCTOBER 2026',
    time: '8:00 AM – 6:00 PM',
    code: 'PREXTREME-FINAL',
    session: 'PreXtreme 9-Hour Challenge',
    title: 'The Final Leap of Faith',
    subtitle: 'SLTC Championship Battleground',
    description:
      'Nine continuous hours of relentless algorithmic battle. Your captain leads a team of exactly three SLTC undergraduates against the live HackerRank leaderboard.',
    platform: 'HackerRank · Real-Time Leaderboard',
    audience: 'SLTC Undergraduates Only (3-Member Teams)',
    entry: 'Free Entry · Exclusive SLTC Roster',
    sector: 'SECTOR 04 // FINAL CITADEL',
    coordinates: '35°41\'N 139°41\'E',
    city: 'The Grand Crucible (Apex Championship)',
    x: 80.5,
    y: 45.2,
    panX: '-16%',
    panY: '0%',
    mobilePanX: '-30.5%',
    mobilePanY: '4%'
  }
];

const TimelineFullscreenMap = ({ onOpenRegister }) => {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const mapCanvasRef = useRef(null);
  const dossierRef = useRef(null);
  const touchStartX = useRef(0);

  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive Screen Check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // GSAP ScrollTrigger Pinned Scrollytelling
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=250%',
      pin: true,
      anticipatePin: 1,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const nextIndex = Math.min(3, Math.floor(self.progress * 4));
        setActive((prev) => {
          if (prev !== nextIndex) {
            return nextIndex;
          }
          return prev;
        });
      }
    });

    triggerRef.current = trigger;

    return () => {
      if (trigger) trigger.kill();
      triggerRef.current = null;
    };
  }, []);

  // Responsive Camera Panning & Zooming
  useEffect(() => {
    const cur = timelineData[active];
    if (mapCanvasRef.current) {
      const scale = isZoomed ? 1.3 : 1;
      gsap.to(mapCanvasRef.current, {
        xPercent: -50 + (50 - cur.x) * scale,
        yPercent: -50 + (50 - cur.y) * scale,
        x: isMobile ? 0 : '-15vw',
        y: isMobile ? '-8dvh' : 0,
        scale,
        duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.85,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }

    if (dossierRef.current) {
      gsap.fromTo(
        dossierRef.current,
        { opacity: 0.7, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [active, isZoomed, isMobile]);

  // Auto-tour interval
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setActive((prev) => (prev + 1) % timelineData.length);
      }, 4500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Jump to specific checkpoint
  const goToStop = (index) => {
    const trigger = triggerRef.current;
    if (trigger) {
      const targetScroll =
        trigger.start + (trigger.end - trigger.start) * ((index + 0.1) / 4);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
    setActive(index);
  };

  const handlePrev = () => {
    goToStop((active - 1 + timelineData.length) % timelineData.length);
  };

  const handleNext = () => {
    goToStop((active + 1) % timelineData.length);
  };

  // Swipe Gestures for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNext(); // Swipe left -> next
      } else {
        handlePrev(); // Swipe right -> prev
      }
    }
  };

  const currentEvent = timelineData[active];

  return (
    <section
      id="timeline"
      ref={sectionRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="timeline-fullscreen relative w-full h-[100dvh] overflow-hidden select-none bg-white text-[#090d16]"
      aria-label="DecodeXtreme 2026 Fullscreen Mission Map"
    >
      {/* 1. Fullscreen Map Background Layer (Kept Natural White) */}
      <div
        ref={mapCanvasRef}
        className="map-canvas-container"
      >
        <div
          className="animus-cartography"
          role="img"
          aria-label="City district map with canals, narrow streets, building courtyards, and four mission landmarks"
        >
          {['harbor', 'west', 'north', 'market', 'central', 'east', 'gardens', 'south', 'citadel'].map((district) => (
            <div key={district} className={`city-district city-district--${district}`}>
              <div className="city-buildings">
                {Array.from({ length: 30 }, (_, block) => (
                  <span key={block} className="city-building" />
                ))}
              </div>
            </div>
          ))}
          <div className="city-canal city-canal--grand" />
          <div className="city-canal city-canal--crossing" />
          {[
            [28, 29, -23], [34, 67, 27], [53, 41, -30],
            [61, 73, 18], [73, 29, 27], [78, 66, -20]
          ].map(([left, top, angle]) => (
            <div key={`${left}-${top}`} className="city-bridge" style={{ left: `${left}%`, top: `${top}%`, rotate: `${angle}deg` }} />
          ))}
          {timelineData.map((stop) => (
            <div key={stop.checkpoint} className={`city-landmark city-landmark--${stop.checkpoint}`} style={{ left: `${stop.x}%`, top: `${stop.y}%` }} />
          ))}
          <div className="city-map-label city-map-label--harbor">WESTERN QUAYS</div>
          <div className="city-map-label city-map-label--market">MARKET DISTRICT</div>
          <div className="city-map-label city-map-label--citadel">THE CITADEL</div>
        </div>

        <div className="animus-routes" aria-hidden="true">
          {timelineData.slice(1).map((stop, index) => {
            const previous = timelineData[index];
            const deltaX = stop.x - previous.x;
            const deltaY = (stop.y - previous.y) / 2;

            return (
              <div
                key={stop.checkpoint}
                className={`animus-route${active > index ? ' is-active' : ''}${index === timelineData.length - 2 ? ' is-final' : ''}`}
                style={{
                  left: `${previous.x}%`,
                  top: `${previous.y}%`,
                  width: `${Math.hypot(deltaX, deltaY)}%`,
                  transform: `rotate(${Math.atan2(deltaY, deltaX)}rad)`
                }}
              />
            );
          })}
        </div>

        {/* Interactive Location Checkpoints on White Map */}
        {timelineData.map((stop, idx) => {
          const isActive = idx === active;
          const isPassed = idx < active;
          const isHovered = hoveredPoint === idx;

          return (
            <div
              key={stop.checkpoint}
              style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <button
                onClick={() => goToStop(idx)}
                onMouseEnter={() => setHoveredPoint(idx)}
                onMouseLeave={() => setHoveredPoint(null)}
                aria-label={`Go to checkpoint ${stop.checkpoint}: ${stop.title}`}
                className={`touch-target-pin relative group cursor-pointer transition-transform duration-300 ${
                  isActive ? 'scale-125' : 'scale-95 hover:scale-115 active:scale-95'
                }`}
              >
                {/* Sonar Radar Beacon Pulse */}
                {isActive && (
                  <>
                    <span className="absolute -inset-4 rounded-full border-2 border-[#00b4d8] opacity-80 animate-ping pointer-events-none" />
                    <span className="absolute -inset-8 rounded-full border border-[#0077b6]/50 opacity-50 animate-pulse pointer-events-none" />
                  </>
                )}

                {/* Targeting HUD Reticle ring for active node */}
                {isActive && (
                  <div className="absolute -inset-3 border-2 border-dashed border-[#00b4d8] rounded-full animate-spin [animation-duration:12s] pointer-events-none" />
                )}

                {/* Pin Core Orb */}
                <div
                  className={`city-checkpoint-core w-9 h-9 md:w-9 md:h-9 flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 border-2 ${
                    isActive
                      ? 'border-[#00b4d8] bg-[#060c14] text-[#00f2fe] active-pin-glow-white shadow-[0_4px_20px_rgba(0,180,216,0.6)]'
                      : isPassed
                      ? 'border-emerald-600 bg-[#062c19] text-emerald-300 shadow-[0_4px_14px_rgba(5,150,105,0.4)]'
                      : 'border-[#1e293b] bg-[#0f172a] text-white group-hover:border-black shadow-md'
                  }`}
                >
                  <span>{stop.checkpoint}</span>
                </div>

                {/* Pin Tooltip Tag (Desktop) */}
                <div
                  className={`hidden md:block absolute top-11 px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap pointer-events-none transition-all duration-300 shadow-xl border ${
                    isActive
                      ? 'bg-[#060c14] text-[#00f2fe] border-[#00b4d8] font-bold translate-y-0 opacity-100'
                      : isHovered
                      ? 'bg-black text-white border-white/30 translate-y-0 opacity-100'
                      : 'bg-[#0f172a]/90 text-gray-200 border-black/20 opacity-90 group-hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-[#00f2fe]' : isPassed ? 'bg-emerald-400' : 'bg-gray-400'
                      }`}
                    />
                    <span>{stop.session}</span>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* 2. Soft Edge Vignette */}
      <div className="absolute inset-0 pointer-events-none white-map-vignette z-10" />

      {/* 3. Top Tactical HUD Header */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-4 md:pt-6 px-4 md:px-12 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 pointer-events-auto">
          {/* Section Heading with High Contrast on White Background */}
          <div>
            <div className="flex items-center gap-2 mb-0.5 md:mb-1">
              <span className="px-2 md:px-2.5 py-0.5 rounded-full bg-[#060c14] text-[#00f2fe] border border-[#00b4d8]/40 font-mono text-[9px] md:text-[10px] tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                <Radio size={11} className="animate-pulse text-[#00f2fe]" />
                RADAR // SECTOR 04
              </span>
              <span className="hidden lg:inline-block font-mono text-[10px] text-gray-600 bg-white/80 px-2 py-0.5 rounded border border-gray-200 backdrop-blur-sm">
                SLT (UTC+05:30)
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <h2 className="font-display text-lg md:text-3xl font-bold uppercase tracking-tight text-[#090d16] drop-shadow-sm">
                THE MISSION PATH
              </h2>
              <span className="hidden sm:inline font-serif italic text-base md:text-2xl text-[#0077b6] font-semibold">
                Four Checkpoints
              </span>
            </div>
          </div>

          {/* Tactical Telemetry HUD Stats & Controls */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#060c14]/90 backdrop-blur-md border border-black/20 font-mono text-xs text-gray-200 shadow-md">
              <div className="flex items-center gap-1.5 text-[#00f2fe]">
                <Crosshair size={13} />
                <span>{currentEvent.coordinates}</span>
              </div>
            </div>

            {/* Auto Tour Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-2.5 md:px-3 py-1.5 rounded-xl border font-mono text-[11px] md:text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md backdrop-blur-md ${
                isPlaying
                  ? 'bg-[#0077b6] border-[#00b4d8] text-white shadow-[0_0_15px_rgba(0,180,216,0.4)]'
                  : 'bg-[#060c14]/90 border-black/20 text-white hover:bg-black'
              }`}
              title="Toggle Auto-Tour Sync"
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              <span>{isPlaying ? 'ACTIVE' : 'TOUR'}</span>
            </button>

            {/* Zoom / Full View Focus Toggle */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className={`p-1.5 md:p-2 rounded-xl border transition-all cursor-pointer shadow-md backdrop-blur-md ${
                isZoomed
                  ? 'bg-[#0077b6] border-[#00b4d8] text-white'
                  : 'bg-[#060c14]/90 border-black/20 text-white hover:bg-black'
              }`}
              title="Toggle Tactical Zoom Focus"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4A. Desktop Floating Dossier Card (Hidden on Mobile) */}
      <div className="hidden md:block absolute right-6 md:right-10 lg:right-12 top-24 md:top-28 z-30 w-[380px] lg:w-[410px] pointer-events-none">
        <div
          ref={dossierRef}
          className="hud-dossier-card-white corner-bracket-cyan rounded-2xl p-5 md:p-6 pointer-events-auto border relative"
        >
          {/* Card Top Telemetry */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe] animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#00f2fe]">
                CHECKPOINT {currentEvent.checkpoint} / 04
              </span>
            </div>
            <span className="font-mono text-[11px] text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              {currentEvent.code}
            </span>
          </div>

          {/* Checkpoint Header & Title */}
          <div className="space-y-1.5 mb-3.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/25 text-[11px] font-mono text-[#00f2fe]">
              <Globe2 size={12} />
              <span>{currentEvent.session}</span>
            </div>

            <h3 className="font-display text-2xl font-bold text-white leading-tight">
              {currentEvent.title}
            </h3>

            <p className="text-gray-300 text-xs font-body leading-relaxed line-clamp-3">
              {currentEvent.description}
            </p>
          </div>

          {/* Telemetry Metadata Grid */}
          <div className="space-y-1.5 pt-2.5 border-t border-white/10 font-mono text-xs mb-4">
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Calendar size={13} className="text-[#00f2fe]" /> DATE
              </span>
              <span className="text-white font-bold">{currentEvent.date}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Clock size={13} className="text-[#00f2fe]" /> TIME (SLT)
              </span>
              <span className="text-white">{currentEvent.time}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-gray-400 flex items-center gap-1.5">
                <MapPin size={13} className="text-[#00f2fe]" /> LOCATION
              </span>
              <span className="text-[#00f2fe] truncate max-w-[190px] text-right">
                {currentEvent.platform}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Terminal size={13} className="text-[#00f2fe]" /> ACCESS
              </span>
              <span className="text-emerald-400 font-bold truncate max-w-[190px] text-right">
                {currentEvent.entry}
              </span>
            </div>
          </div>

          {/* Action CTAs & Navigation Arrows */}
          <div className="flex items-center justify-between gap-2.5 pt-1">
            <button
              onClick={() => onOpenRegister && onOpenRegister('individual')}
              className="flex-grow py-2.5 px-4 bg-[#00f2fe] hover:bg-[#1bc2c5] text-black font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.6)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Register Checkpoint <ArrowUpRight size={14} />
            </button>

            {/* Quick Step Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                aria-label="Previous Checkpoint"
                className="p-2.5 rounded-xl border border-white/15 bg-black/40 hover:bg-white/10 text-white transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Checkpoint"
                className="p-2.5 rounded-xl border border-white/15 bg-black/40 hover:bg-white/10 text-white transition-all cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4B. Mobile Responsive Bottom Sheet / Drawer (Mobile Only) */}
      <div className="block md:hidden absolute bottom-3 left-3 right-3 z-30">
        <div className="hud-dossier-card-white corner-bracket-cyan rounded-2xl p-4 shadow-2xl border">
          {/* Drag Pill / Toggle Header */}
          <div
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="flex flex-col items-center cursor-pointer mb-2"
          >
            <div className="w-8 h-1 bg-white/30 rounded-full mb-1.5" />
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse" />
                <span className="font-mono text-[11px] font-bold text-[#00f2fe] uppercase">
                  CP {currentEvent.checkpoint} / 04: {currentEvent.session}
                </span>
              </div>
              <button
                aria-label="Toggle details"
                className="text-gray-400 hover:text-white p-1"
              >
                {isMobileExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>
          </div>

          {/* Compact View */}
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <h3 className="font-display text-lg font-bold text-white truncate">
              {currentEvent.title}
            </h3>
            <span className="font-mono text-[10px] text-gray-400 whitespace-nowrap">
              {currentEvent.date.split(' ')[0]} {currentEvent.date.split(' ')[1].slice(0, 3)}
            </span>
          </div>

          {/* Expandable Details Area */}
          {isMobileExpanded && (
            <div className="space-y-2 mb-3 pt-2 border-t border-white/10 font-mono text-[11px] animate-fadeIn">
              <p className="text-gray-300 font-body text-xs leading-relaxed">
                {currentEvent.description}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                <div className="bg-white/5 p-1.5 rounded">
                  <span className="text-gray-400 block">TIME (SLT)</span>
                  <span className="text-white font-bold">{currentEvent.time}</span>
                </div>
                <div className="bg-white/5 p-1.5 rounded">
                  <span className="text-gray-400 block">PLATFORM</span>
                  <span className="text-[#00f2fe] truncate block">{currentEvent.platform}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Row & Step Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onOpenRegister && onOpenRegister('individual')}
              className="flex-grow py-2 px-3 bg-[#00f2fe] active:bg-[#1bc2c5] text-black font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              Register <ArrowUpRight size={13} />
            </button>

            <button
              onClick={handlePrev}
              aria-label="Previous Checkpoint"
              className="p-2 rounded-xl border border-white/20 bg-black/50 text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Checkpoint"
              className="p-2 rounded-xl border border-white/20 bg-black/50 text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Quick 4-Step Indicator Bar on Mobile */}
          <div className="grid grid-cols-4 gap-1.5 mt-2.5 pt-2 border-t border-white/10">
            {timelineData.map((item, idx) => (
              <button
                key={item.checkpoint}
                onClick={() => goToStop(idx)}
                className={`py-1 rounded font-mono text-[10px] font-bold transition-all text-center ${
                  idx === active
                    ? 'bg-[#00f2fe] text-black shadow-sm'
                    : idx < active
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {item.checkpoint}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Desktop Bottom Horizontal Scrub Navigation Bar (Desktop Only) */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 z-30 pb-4 px-6 md:px-12 pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto md:mr-32 lg:mr-44">
          {/* Synchronization Progress Line */}
          <div className="w-full h-1 bg-black/15 rounded-full mb-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00b4d8] to-[#e63946] transition-all duration-500 rounded-full"
              style={{ width: `${((active + 1) / timelineData.length) * 100}%` }}
            />
          </div>

          {/* Horizontal Step Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {timelineData.map((item, idx) => {
              const isActive = idx === active;
              const isPassed = idx < active;

              return (
                <button
                  key={item.checkpoint}
                  onClick={() => goToStop(idx)}
                  className={`py-2 px-3 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-between border transition-all cursor-pointer backdrop-blur-md shadow-md ${
                    isActive
                      ? 'border-[#00b4d8] bg-[#060c14] text-white shadow-[0_0_20px_rgba(0,180,216,0.3)] font-bold'
                      : isPassed
                      ? 'border-emerald-700/60 bg-[#062c19] text-emerald-200 hover:border-emerald-500'
                      : 'border-black/20 bg-[#0f172a]/90 text-gray-300 hover:text-white hover:bg-black'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive
                          ? 'bg-[#00f2fe] animate-ping'
                          : isPassed
                          ? 'bg-emerald-400'
                          : 'bg-gray-400'
                      }`}
                    />
                    <span className="font-bold">{item.checkpoint}</span>
                    <span className="hidden sm:inline truncate">{item.session}</span>
                  </div>

                  <span className="text-[10px] text-gray-400 hidden lg:inline">
                    {item.date.split(' ')[0]} {item.date.split(' ')[1].slice(0, 3)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineFullscreenMap;
