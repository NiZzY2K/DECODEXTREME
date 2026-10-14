import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ShieldCheck, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE_LINES = ['Think.', 'Solve.', 'Compete.'];
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const LEARNING_TRACKS = [
  {
    num: '01',
    badge: 'ALGORITHMIC VISION',
    title: 'Problem Solving Process',
    desc: 'Break complex algorithmic problems into clear steps, choose suitable data structures, and test important boundary cases.',
    tag: 'Session 2 · 14 Oct',
  },
  {
    num: '02',
    badge: 'BROTHERHOOD TRIAGE',
    title: 'Team Strategy & Time Mastery',
    desc: 'Coordinate your three-member team, prioritise problems, divide tasks effectively, and make decisions under pressure.',
    tag: 'Session 3 · 21 Oct',
  },
  {
    num: '03',
    badge: 'THE LEAP OF FAITH',
    title: 'Contest Confidence',
    desc: 'Prepare for the nine-hour online PreXtreme contest on HackerRank and build confidence for the global 24-hour IEEEXtreme arena.',
    tag: 'PreXtreme · 24 Oct',
  },
];

const scrambleRuns = new WeakMap();

/** Animate a separate state object so the scramble tween never conflicts with GSAP reveals. */
const scrambleText = (element, duration = 0.6) => {
  if (!element) return;

  const finalText = element.dataset.aboutOriginalText || element.textContent;
  element.dataset.aboutOriginalText = finalText;
  scrambleRuns.get(element)?.kill();

  const characters = [...finalText];
  const state = { progress: 0 };
  let frame = 0;

  const tween = gsap.to(state, {
    progress: 1,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      const cursor = Math.min(characters.length, Math.floor(state.progress * (characters.length + 2)));
      frame += 1;

      element.textContent = characters
        .map((character, index) => {
          if (!/[A-Za-z0-9]/.test(character)) return character;
          if (index < cursor || state.progress === 1) return character;
          if (index < cursor + 2) return SCRAMBLE_CHARS[(index * 7 + frame) % SCRAMBLE_CHARS.length];
          return character;
        })
        .join('');
    },
    onComplete: () => {
      element.textContent = finalText;
    },
  });

  scrambleRuns.set(element, tween);
};

const buildScrambleReveals = (section) => {
  section.querySelectorAll('[data-about-scramble]').forEach((target, index) => {
    const trigger = target.closest('.abx-track, .abx-lead-card, .abx-callout, .abx-copy') || target;
    const duration = 0.58 + (index % 3) * 0.08;

    ScrollTrigger.create({
      trigger,
      start: 'top 82%',
      onEnter: () => scrambleText(target, duration),
      onEnterBack: () => scrambleText(target, duration),
    });
  });
};

const buildGlitch = (section) => {
  section.querySelectorAll('.abx-glitch-bar').forEach((bar, index) => {
    gsap.to(bar, {
      x: () => gsap.utils.random(-20, 38),
      scaleX: () => gsap.utils.random(0.65, 1.35),
      duration: 0.14,
      ease: 'steps(2)',
      yoyo: true,
      repeat: -1,
      repeatDelay: 1 + index * 0.7,
      repeatRefresh: true,
    });
  });
};

/** Low-amplitude pointer parallax for the character and distant background only. */
const buildParallax = (section) => {
  const elements = [
    { element: section.querySelector('.abx-character-parallax'), x: 10, y: 6 },
    { element: section.querySelector('.abx-bg'), x: -7, y: -5 },
    { element: section.querySelector('.abx-glow'), x: 18, y: 10 },
  ].filter(({ element }) => element);

  const rigs = elements.map(({ element, x, y }) => ({
    x,
    y,
    moveX: gsap.quickTo(element, 'x', { duration: 0.8, ease: 'power3.out' }),
    moveY: gsap.quickTo(element, 'y', { duration: 0.8, ease: 'power3.out' }),
  }));

  const handlePointerMove = (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    const rect = section.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    rigs.forEach(({ x, y, moveX, moveY }) => {
      moveX(nx * x);
      moveY(ny * y);
    });
  };

  const resetPointer = () => {
    rigs.forEach(({ moveX, moveY }) => {
      moveX(0);
      moveY(0);
    });
  };

  section.addEventListener('pointermove', handlePointerMove);
  section.addEventListener('pointerleave', resetPointer);

  return () => {
    section.removeEventListener('pointermove', handlePointerMove);
    section.removeEventListener('pointerleave', resetPointer);
  };
};

/** Use normal document flow at every breakpoint; no pinned scene to trap short viewports. */
const buildFlowReveals = (section) => {
  const reveals = section.querySelectorAll('.abx-reveal');

  reveals.forEach((element, index) => {
    gsap.fromTo(
      element,
      { autoAlpha: 0, y: index === 1 ? 30 : 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: element.classList.contains('abx-character') ? 0.95 : 0.68,
        delay: index < 4 ? index * 0.035 : 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      },
    );
  });

  const headlineWords = section.querySelectorAll('.abx-headline-word');
  if (headlineWords.length) {
    gsap.fromTo(
      headlineWords,
      { yPercent: 108 },
      {
        yPercent: 0,
        duration: 0.72,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: section.querySelector('.abx-headline'),
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      },
    );
  }

  buildScrambleReveals(section);
};

const AboutSection = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let disposed = false;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          wideScreen: '(min-width: 1280px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        ({ wideScreen, reduceMotion }) => {
          // Leave every item visible and static when reduced motion is requested.
          if (reduceMotion) return undefined;

          buildFlowReveals(section);
          if (wideScreen) return buildParallax(section);
          return undefined;
        },
      );

      // Glitch movement is decorative and stays subtle; skip it for reduced-motion users.
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) buildGlitch(section);
    }, section);

    const refresh = () => {
      if (!disposed) ScrollTrigger.refresh();
    };

    requestAnimationFrame(refresh);
    document.fonts?.ready?.then(refresh);

    return () => {
      disposed = true;
      media.revert();
      context.revert();

      section.querySelectorAll('[data-about-original-text]').forEach((element) => {
        scrambleRuns.get(element)?.kill();
        element.textContent = element.dataset.aboutOriginalText;
      });
    };
  }, []);

  const handleJoinClick = () => {
    const target = document.getElementById('contact');
    if (!target) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="about-section relative isolate flex w-full flex-col overflow-hidden border-b border-black/10 bg-transparent text-[#081922]"
    >
      {/* Subtle atmospheric glow and cyber grid revealing common Animus background */}
      <div
        aria-hidden="true"
        className="abx-glow pointer-events-none absolute right-[11%] top-[6%] -z-20 h-64 w-64 rounded-full bg-[var(--color-primary)]/10 blur-[105px] sm:h-80 sm:w-80 sm:blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-cyber-grid opacity-15"
      />

      {/* Section metadata */}
      <header className="relative z-20 w-full px-5 pt-16 sm:px-8 sm:pt-20 lg:px-10 lg:pt-24 xl:pt-20">
        <div className="mx-auto flex w-full max-w-[90rem] items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="abx-reveal font-mono text-[9px] uppercase tracking-[0.16em] text-[#435b62] sm:text-[10px] sm:tracking-[0.2em]">
              The Animus training network
            </p>
          </div>
          <p className="abx-reveal hidden shrink-0 text-right font-mono text-[9px] uppercase leading-[1.8] tracking-[0.16em] text-[#435b62] sm:block sm:text-[10px]">
            IEEE Student Branch of SLTC
            <br />
            2026 / Online
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 mx-auto w-full max-w-[90rem] flex-1 px-5 sm:px-8 lg:px-10">
        <div className="relative mx-auto grid w-full grid-cols-1 items-center gap-8 py-8 sm:gap-10 sm:py-10 md:grid-cols-2 md:gap-x-8 xl:min-h-[43rem] xl:grid-cols-12 xl:items-stretch xl:gap-x-7 xl:py-8">
          {/* Left column */}
          <div className="abx-copy abx-reveal relative z-20 order-1 flex min-w-0 flex-col items-start justify-center md:col-span-1 xl:col-span-5 xl:col-start-1 xl:row-start-1 xl:justify-between xl:py-7">
            <div className="max-w-[24rem]">
              <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.18em] text-[#435b62] sm:text-[10px]">
                Think beyond the obvious
              </p>
              <h2
                id="about-heading"
                className="abx-headline font-display text-[clamp(3.3rem,14vw,5.2rem)] font-bold uppercase leading-[0.84] tracking-[-0.065em] sm:text-6xl md:text-[clamp(3rem,6.2vw,4.8rem)] xl:text-[clamp(2.6rem,3.5vw,4.25rem)] 2xl:text-[4.5rem]"
              >
                {HEADLINE_LINES.map((line) => (
                  <span key={line} className="-my-[0.08em] block overflow-hidden py-[0.08em]">
                    <span className="abx-headline-word block will-change-transform">{line}</span>
                  </span>
                ))}
              </h2>
              <p data-about-scramble className="abx-intro-text mt-5 max-w-sm font-body text-[13px] leading-6 text-[#4d646b] sm:text-sm">
                DecodeXtreme is an online programming experience by the IEEE Student Branch of SLTC, helping student teams sharpen their algorithms, strategy, and confidence.
              </p>
              <button
                type="button"
                onClick={handleJoinClick}
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-3 border border-(--color-primary) bg-(--color-primary) px-5 py-3 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[#052126] transition duration-200 hover:-translate-y-0.5 hover:bg-(--color-electric-aqua) hover:shadow-[0_8px_28px_rgba(0,255,230,0.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-0 sm:mt-7"
              >
                <span>Join the mission</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>
            </div>

            {/* Recruitment and supporting text sit low on the left on desktop. */}
            <aside className="abx-callout abx-reveal mt-8 w-full max-w-[22rem] border-t border-[#087e87]/25 pt-4 sm:mt-10 xl:mt-12">
              <div className="mb-3 flex items-center gap-3">
                <span className="relative block h-5 w-10 shrink-0 overflow-hidden border border-(--color-primary)/70">
                  <span className="abx-glitch-bar absolute left-0 top-1 h-1.5 w-1/2 bg-(--color-primary)" />
                  <span className="abx-glitch-bar absolute bottom-1 right-0 h-1 w-1/3 bg-white/80" />
                </span>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-(--color-primary)">Now recruiting</p>
              </div>
              <p className="font-display text-3xl font-bold uppercase leading-[0.9] tracking-[-0.045em] text-[#081922] sm:text-4xl">
                Decoders <span className="text-(--color-primary)">wanted.</span>
              </p>
              <p className="mt-3 flex items-start gap-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.11em] text-[#556970] sm:text-[10px]">
                <ShieldCheck size={15} className="mt-px shrink-0 text-(--color-primary)" aria-hidden="true" />
                <span data-about-scramble>Open access · Sri Lanka · 100% online</span>
              </p>
            </aside>
          </div>

          {/* Right column: protocols */}
          <div className="abx-right relative z-20 order-3 min-w-0 md:col-span-2 xl:col-span-7 xl:col-start-6 xl:row-start-1 xl:flex xl:flex-col xl:justify-center xl:py-4">
            <section className="mt-8 sm:mt-10 xl:mt-9" aria-labelledby="about-protocols-heading">
              <div className="abx-reveal mb-4 flex items-center gap-3 sm:mb-5">
                <span aria-hidden="true" className="h-px w-7 shrink-0 bg-(--color-primary)" />
                <h3 id="about-protocols-heading" className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#435b62] sm:text-[10px] sm:tracking-[0.2em]">
                  3 training protocols
                </h3>
              </div>

              <div className="space-y-5 sm:space-y-6">
                {LEARNING_TRACKS.map((track) => (
                  <article key={track.num} className="abx-track abx-reveal group relative min-w-0 border-t border-[#087e87]/20 pt-4 transition-colors duration-300 hover:border-(--color-primary)/60 sm:pt-5">
                    <span aria-hidden="true" className="absolute -top-[7px] left-0 text-(--color-primary)">
                      <X size={13} strokeWidth={2.5} />
                    </span>
                    <div className="mb-2 flex items-start justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.1em] text-(--color-primary) sm:tracking-[0.13em]">
                      <span>{track.badge}</span>
                      <span className="shrink-0 text-[#556970]">{track.num}</span>
                    </div>
                    <h4 className="font-display text-base font-bold uppercase leading-tight tracking-[-0.025em] text-[#081922] sm:text-lg">
                      {track.title}
                    </h4>
                    <p data-about-scramble className="mt-2 text-[11px] leading-[1.7] text-[#4d646b] sm:text-xs sm:leading-[1.75]">
                      {track.desc}
                    </p>
                    <p data-about-scramble className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#556970] sm:tracking-[0.12em]">
                      {track.tag}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </section>
  );
};

export default AboutSection;
