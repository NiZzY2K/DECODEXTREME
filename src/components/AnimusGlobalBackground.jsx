import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import viewpointBg from '../assets/animus-white-viewpoint.jpg';
import sanctuaryBg from '../assets/animus-white-sanctuary.jpg';

gsap.registerPlugin(ScrollTrigger);

const SEQUENCE_NAMES = [
  'SEQ 01 // BATTLEFIELD INITIATION',
  'SEQ 02 // THE BROTHERHOOD CREED',
  'SEQ 03 // EAGLE VISION TIMELINE',
  'SEQ 04 // CHOOSE YOUR PATH',
  'SEQ 05 // CHAMPION RECOGNITION',
  'SEQ 06 // DELEGATE CODEX',
  'SEQ 07 // SYNCHRONIZATION COMPLETE',
];

const AnimusGlobalBackground = () => {
  const crestRef = useRef(null);
  const viewpointRef = useRef(null);
  const sanctuaryRef = useRef(null);
  const aura1Ref = useRef(null);
  const aura2Ref = useRef(null);

  const [syncProgress, setSyncProgress] = useState(0);
  const [activeSeq, setActiveSeq] = useState(0);

  // Floating Animus glyphs config — pure CSS animation, no canvas
  const ANIMUS_GLYPHS = [
    { id: 'g1', top: '12%',  left: '7%',   size: 48,  delay: '0s',    dur: '22s',  rotate: 0   },
    { id: 'g2', top: '68%',  left: '4%',   size: 36,  delay: '-7s',   dur: '28s',  rotate: 45  },
    { id: 'g3', top: '25%',  right: '6%',  size: 56,  delay: '-3s',   dur: '20s',  rotate: 30  },
    { id: 'g4', top: '78%',  right: '8%',  size: 42,  delay: '-12s',  dur: '25s',  rotate: -20 },
    { id: 'g5', top: '48%',  left: '14%',  size: 32,  delay: '-5s',   dur: '32s',  rotate: 60  },
    { id: 'g6', top: '55%',  right: '15%', size: 44,  delay: '-18s',  dur: '19s',  rotate: -45 },
  ];

  // 2. GSAP ScrollTrigger for Parallax & Seamless Crossfade between the 2 Images
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add({
      compact: '(max-width: 1023px), (pointer: coarse)',
      desktop: '(min-width: 1024px) and (pointer: fine)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const { compact, reduceMotion } = context.conditions;
      if (reduceMotion) {
        gsap.set(viewpointRef.current, { opacity: 0.85 });
        gsap.set(sanctuaryRef.current, { opacity: 0 });
        return;
      }

      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          setSyncProgress(Math.round(progress * 100));

          const seqIndex = Math.min(
            SEQUENCE_NAMES.length - 1,
            Math.floor(progress * SEQUENCE_NAMES.length)
          );
          setActiveSeq(seqIndex);

          // Subtle ambient glow shifting with sections
          if (!compact && aura1Ref.current && aura2Ref.current) {
            if (progress < 0.3) {
              gsap.to(aura1Ref.current, { backgroundColor: 'rgba(8, 209, 216, 0.08)', duration: 0.6 });
              gsap.to(aura2Ref.current, { backgroundColor: 'rgba(244, 250, 251, 0.4)', duration: 0.6 });
            } else if (progress < 0.65) {
              gsap.to(aura1Ref.current, { backgroundColor: 'rgba(234, 179, 8, 0.07)', duration: 0.6 });
              gsap.to(aura2Ref.current, { backgroundColor: 'rgba(8, 126, 135, 0.08)', duration: 0.6 });
            } else {
              gsap.to(aura1Ref.current, { backgroundColor: 'rgba(8, 209, 216, 0.09)', duration: 0.6 });
              gsap.to(aura2Ref.current, { backgroundColor: 'rgba(220, 38, 38, 0.05)', duration: 0.6 });
            }
          }
        },
      });

      // Layer 1: Assassin Viewpoint Landscape (Active at Top: Hero, About, Timeline)
      if (viewpointRef.current) {
        gsap.to(viewpointRef.current, {
          yPercent: compact ? 3 : 16,
          scale: compact ? 1.02 : 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: '55% top',
            scrub: true,
          },
        });

        // Visible from the very beginning (Hero & About)
        gsap.fromTo(
          viewpointRef.current,
          { opacity: 0.85 },
          {
            opacity: 0.95,
            ease: 'none',
            scrollTrigger: {
              trigger: document.body,
              start: 'top top',
              end: '25% top',
              scrub: true,
            },
          }
        );

        // Crossfades into the Sanctuary as user scrolls into Timeline and Program
        gsap.to(viewpointRef.current, {
          opacity: 0.15,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: '32% top',
            end: '62% top',
            scrub: true,
          },
        });
      }

      // Layer 2: Assassin Eagle Vision Sanctuary (Emerges from Timeline, Program, Prizes, Footer)
      if (sanctuaryRef.current) {
        gsap.fromTo(
          sanctuaryRef.current,
          { opacity: 0, scale: compact ? 1.02 : 1.08, yPercent: compact ? -2 : -6 },
          {
            opacity: 0.88,
            scale: 1.0,
            yPercent: compact ? 3 : 14,
            ease: 'none',
            scrollTrigger: {
              trigger: document.body,
              start: '30% top',
              end: '70% top',
              scrub: true,
            },
          }
        );

        // Retains gentle presence through the lower sections
        gsap.to(sanctuaryRef.current, {
          opacity: 0.65,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: '75% top',
            end: '96% top',
            scrub: true,
          },
        });
      }

      // Layer 3: Rotating Assassin Insignia Crest
      if (crestRef.current) {
        gsap.to(crestRef.current, {
          rotation: compact ? 45 : 210,
          scale: compact ? 0.95 : 0.85,
          xPercent: compact ? 0 : 15,
          yPercent: compact ? 35 : 120,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
          },
        });
      }
    });

    return () => media.revert();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="animus-global-background fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#F4FAFB] [--glyph-scale:0.65] md:[--glyph-scale:0.8] lg:[--glyph-scale:1]"
    >
      {/* 1. Assassin's Creed Viewpoint Artwork (Ice White #F4FAFB Palette) */}
      <div
        ref={viewpointRef}
        className="animus-viewpoint absolute -inset-y-[20%] inset-x-0 opacity-85 overflow-hidden max-lg:-inset-y-[8%] [@media(pointer:coarse)]:-inset-y-[8%]"
      >
        <img
          src={viewpointBg}
          alt="Assassin's Creed Ice White Viewpoint"
          className="w-full h-full object-cover object-center portrait:object-[72%_center] filter contrast-105 brightness-100 saturate-105"
        />
        {/* Soft atmospheric Ice White feathering */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F4FAFB]/80 via-transparent to-[#F4FAFB]/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F4FAFB]/40 via-transparent to-[#F4FAFB]/40 pointer-events-none" />
      </div>

      {/* 2. Assassin's Creed Sanctuary & Eagle Horizon Artwork (Ice White #F4FAFB Palette) */}
      <div
        ref={sanctuaryRef}
        className="animus-sanctuary absolute -inset-y-[20%] inset-x-0 opacity-0 overflow-hidden max-lg:-inset-y-[8%] [@media(pointer:coarse)]:-inset-y-[8%]"
      >
        <img
          src={sanctuaryBg}
          alt="Assassin's Creed Ice White Sanctuary"
          className="w-full h-full object-cover object-center portrait:object-[65%_center] filter contrast-105 brightness-100 saturate-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F4FAFB]/80 via-transparent to-[#F4FAFB]/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F4FAFB]/40 via-transparent to-[#F4FAFB]/40 pointer-events-none" />
      </div>

      {/* 3. Subtle Ambient Lighting Auras */}
      <div
        ref={aura1Ref}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1300px] h-[50%] rounded-full blur-[60px] lg:blur-[150px] bg-[rgba(8,209,216,0.08)]"
      />
      <div
        ref={aura2Ref}
        className="absolute bottom-1/4 right-0 w-[80%] max-w-[900px] h-[45%] rounded-full blur-[60px] lg:blur-[160px] bg-[rgba(244,250,251,0.5)]"
      />

      {/* 4. Global Cyber Perspective Grid */}
      <div className="absolute inset-0 bg-cyber-grid opacity-15" />

      {/* 5. Horizontal Animus Scanning Horizon Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(8,126,135,0.02)_50%,transparent_100%)] bg-[length:100%_8px] opacity-25 pointer-events-none" />

      {/* 6. CSS-animated Animus Glyphs (replaces canvas bubbles) */}
      {ANIMUS_GLYPHS.map((g) => (
        <div
          key={g.id}
          aria-hidden="true"
          className="animus-glyph pointer-events-none absolute"
          style={{
            top: g.top,
            left: g.left,
            right: g.right,
            width: `calc(${g.size}px * var(--glyph-scale))`,
            height: `calc(${g.size}px * var(--glyph-scale))`,
            opacity: 0.18,
            animationDelay: g.delay,
            animationDuration: g.dur,
            '--glyph-rot': `${g.rotate}deg`,
          }}
        >
          <svg viewBox="0 0 60 60" className="w-full h-full" style={{ animationDelay: g.delay }}>
            {/* Outer diamond ring */}
            <polygon
              points="30,4 56,30 30,56 4,30"
              fill="none"
              stroke="#087e87"
              strokeWidth="0.6"
              strokeDasharray="3 3"
            />
            {/* Inner cross-hair */}
            <line x1="30" y1="10" x2="30" y2="50" stroke="#08d1d8" strokeWidth="0.4" strokeOpacity="0.7" />
            <line x1="10" y1="30" x2="50" y2="30" stroke="#08d1d8" strokeWidth="0.4" strokeOpacity="0.7" />
            {/* Centre dot */}
            <circle cx="30" cy="30" r="2.5" fill="#087e87" fillOpacity="0.5" />
            {/* Corner ticks */}
            <line x1="30" y1="4"  x2="30" y2="10" stroke="#08d1d8" strokeWidth="1" />
            <line x1="56" y1="30" x2="50" y2="30" stroke="#08d1d8" strokeWidth="1" />
            <line x1="30" y1="56" x2="30" y2="50" stroke="#08d1d8" strokeWidth="1" />
            <line x1="4"  y1="30" x2="10" y2="30" stroke="#08d1d8" strokeWidth="1" />
          </svg>
        </div>
      ))}

      {/* 7. Rotating Assassin's Creed Insignia Crest */}
      <div
        ref={crestRef}
        className="animus-crest absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(75vw,65svh,720px)] aspect-square opacity-20 text-[var(--color-primary)] pointer-events-none"
      >
        <svg
          viewBox="0 0 200 240"
          className="w-full h-full stroke-current fill-none stroke-[0.8] filter drop-shadow-[0_0_15px_rgba(8,126,135,0.3)]"
        >
          <path
            d="M100,10 L165,135 L135,145 L100,75 L65,145 L35,135 Z"
            strokeWidth="0.8"
          />
          <path
            d="M100,55 L135,130 L115,138 L100,105 L85,138 L65,130 Z"
            strokeWidth="0.6"
            strokeDasharray="4,2"
          />
          <path
            d="M100,140 L125,200 L100,225 L75,200 Z"
            strokeWidth="0.7"
          />
          <circle cx="100" cy="115" r="75" strokeWidth="0.3" strokeDasharray="3,4" />
          <circle cx="100" cy="115" r="95" strokeWidth="0.25" />
          <circle cx="100" cy="115" r="45" strokeWidth="0.3" strokeDasharray="1,5" />
          <line x1="10" y1="115" x2="190" y2="115" strokeWidth="0.25" />
          <line x1="100" y1="5" x2="100" y2="235" strokeWidth="0.25" />
          <polygon points="100,5 95,15 105,15" fill="currentColor" />
          <polygon points="190,115 180,110 180,120" fill="currentColor" />
          <polygon points="10,115 20,110 20,120" fill="currentColor" />
          <polygon points="100,235 95,225 105,225" fill="currentColor" />
        </svg>
      </div>

      {/* 8. Live Animus Telemetry Status Widget (Ice White / Glassmorphic) */}
      <div className="fixed bottom-6 left-6 z-[60] hidden lg:flex items-center gap-3 px-3.5 py-2 rounded-full bg-white/85 border border-[#087e87]/20 backdrop-blur-md text-[10px] font-mono tracking-widest text-[#435b62] shadow-[0_4px_20px_rgba(8,126,135,0.08)]">
        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse shadow-[0_0_8px_var(--color-primary)]" />
        <span className="text-[#081922] font-bold">{SEQUENCE_NAMES[activeSeq]}</span>
        <span className="text-[#087e87]/30">|</span>
        <span className="text-[var(--color-primary)] font-semibold">SYNC: {syncProgress}%</span>
        <span className="text-[#087e87]/30">|</span>
        <span className="text-[#556970]">LOC: SLTC [6.8402° N, 80.0034° E]</span>
      </div>
    </div>
  );
};

export default AnimusGlobalBackground;
