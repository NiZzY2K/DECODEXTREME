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
  const viewpointRef = useRef(null);
  const sanctuaryRef = useRef(null);
  const aura1Ref = useRef(null);
  const aura2Ref = useRef(null);

  const [syncProgress, setSyncProgress] = useState(0);
  const [activeSeq, setActiveSeq] = useState(0);

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

      {/* 6. Live Animus Telemetry Status Widget (Ice White / Glassmorphic) */}
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
