import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { MoveRight, Video, Code2, Users, Trophy, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const scrambleText = (element, duration = 0.65) => {
  if (!element) return;
  gsap.killTweensOf(element);
  const finalText = element.dataset.programOriginalText || element.textContent;
  element.dataset.programOriginalText = finalText;
  const letters = [...finalText];
  let frame = 0;
  gsap.to(element, {
    duration,
    ease: 'power2.out',
    onUpdate: function updateScramble() {
      const progress = this.progress();
      const cursor = Math.min(
        letters.length,
        Math.floor(progress * (letters.length + 2)),
      );
      frame += 1;
      const nextText = letters
        .map((character, index) => {
          if (!/[A-Za-z0-9]/.test(character)) return character;
          if (index < cursor || progress === 1) return character;
          if (index < cursor + 2) {
            return SCRAMBLE_CHARS[(index * 7 + frame) % SCRAMBLE_CHARS.length];
          }
          return character;
        })
        .join('');
      element.textContent = nextText;
    },
    onComplete: () => { element.textContent = finalText; },
  });
};

const SESSIONS = [
  {
    id: 'awareness',
    date: '12 OCT 2026',
    num: '01',
    title: 'Awareness Session',
    desc: 'Understand IEEEXtreme, the preparation roadmap, and event format.',
    time: '8:00–10:00 PM SLT',
    platform: 'Zoom',
    icon: Video,
    accent: 'var(--color-primary)',
    isChallenge: false,
  },
  {
    id: 'fundamentals',
    date: '14 OCT 2026',
    num: '02',
    title: 'Programming Fundamentals',
    desc: 'Practice core algorithms, edge cases, and debugging.',
    time: '8:00–10:00 PM SLT',
    platform: 'Zoom',
    icon: Code2,
    accent: 'var(--color-primary)',
    isChallenge: false,
  },
  {
    id: 'strategy',
    date: '21 OCT 2026',
    num: '03',
    title: 'Advanced Strategy',
    desc: 'Assign team roles, prioritize problems, and manage time.',
    time: '8:00–10:00 PM SLT',
    platform: 'Zoom',
    icon: Users,
    accent: 'var(--color-primary)',
    isChallenge: false,
  },
  {
    id: 'prextreme',
    date: '24 OCT 2026',
    num: '04',
    title: 'PreXtreme Team Battle',
    desc: 'A nine-hour team coding challenge with live rankings.',
    time: '9:00 AM–6:00 PM · Check-in 8:00 AM',
    platform: 'HackerRank',
    icon: Trophy,
    accent: '#ff334b',
    isChallenge: true,
  },
];

const CLIP_HIDDEN = 'inset(100% 0% 0% 0%)';

const CLIP_SHOWN = 'inset(0% 0% 0% 0%)';

// Plays forward when the trigger enters, plays backward when scrolled back above it.

const toggleOnScroll = (trigger, start = 'top 85%') => ({
  trigger,
  start,
  toggleActions: 'play none none reverse',
});

// One panel: a curtain wipe, then its content rises in a short stagger.

const revealPanel = (panel, { mobile = false, ...vars } = {}) => {
  const items = panel.querySelectorAll('.prog-panel-item');
  const panelStart = mobile
    ? { clipPath: CLIP_HIDDEN, y: 24 }
    : { clipPath: CLIP_HIDDEN, y: 48 };
  const panelEnd = mobile
    ? { clipPath: CLIP_SHOWN, y: 0, duration: 0.7, ease: 'power4.inOut' }
    : { clipPath: CLIP_SHOWN, y: 0, duration: 0.9, ease: 'power4.inOut' };
  return gsap
    .timeline({ defaults: { ease: 'power3.out' }, ...vars })
    .fromTo(
      panel,
      panelStart,
      panelEnd,
      0,
    )
    .fromTo(
      items,
      { autoAlpha: 0, y: mobile ? 14 : 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: mobile ? 0.45 : 0.6,
        stagger: mobile ? 0.05 : 0.07,
      },
      mobile ? 0.25 : 0.35,
    );
};

const buildHeader = (section, q) => {
  gsap
    .timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: toggleOnScroll(section.querySelector('.prog-header'), 'top 80%'),
    })
    .fromTo(q('.prog-eyebrow-line'), { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.6, ease: 'power2.inOut' }, 0)
    .fromTo(q('.prog-eyebrow-text'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.5 }, 0.1)
    .fromTo(q('.prog-heading-word'), { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.14, ease: 'power4.out' }, 0.2)
    .fromTo(q('.prog-header-note'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.7);
};

const buildFootnote = (section) => {
  const footnote = section.querySelector('.prog-footnote');
  gsap.fromTo(
    footnote,
    { autoAlpha: 0, y: 24 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: toggleOnScroll(footnote, 'top 94%'),
    },
  );
};

// DESKTOP: panels cascade left to right, tied directly to scroll position.
// Scroll down builds them, scroll up unbuilds them. No pin (the About section already pins).

const buildPanelsScrubbed = (section, q) => {
  const master = gsap.timeline({
    scrollTrigger: {
      trigger: section.querySelector('.prog-panels'),
      start: 'top 85%',
      end: 'top 30%',
      scrub: 0.8,
      invalidateOnRefresh: true,
    },
  });
  q('.prog-panel').forEach((panel, i) => {
    const at = i * 0.2;
    const items = panel.querySelectorAll('.prog-panel-item');
    master
      .fromTo(
        panel,
        { clipPath: CLIP_HIDDEN, y: 48 },
        { clipPath: CLIP_SHOWN, y: 0, duration: 0.9, ease: 'power4.inOut' },
        at,
      )
      .fromTo(
        items,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.07,
        },
        at + 0.35,
      );
  });
};

const observeCardScrambles = (section) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target
          .querySelectorAll('[data-program-scramble]')
          .forEach((target, index) => {
            window.setTimeout(() => scrambleText(target, 1 + index * 0.08), index * 80);
          });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -10% 0px' },
  );
  section.querySelectorAll('.prog-panel').forEach((panel) => observer.observe(panel));
  return observer;
};

// TABLET / MOBILE: each panel reveals as it enters and reverses when scrolled back up.

const buildPanelsFlow = (q) => {
  q('.prog-panel').forEach((panel) => {
    revealPanel(panel, {
      mobile: true,
      scrollTrigger: toggleOnScroll(panel, 'top 88%'),
    });
  });
};

const ServicesSection = ({ onOpenRegister }) => {
  const sectionRef = useRef(null);
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const q = gsap.utils.selector(section);
    let disposed = false;
    const cardObserver = observeCardScrambles(section);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          isDesktop: '(min-width: 1024px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions;
          // Reduced motion: no animation, everything stays visible.
          if (reduceMotion) return undefined;
          buildHeader(section, q);
          buildFootnote(section);
          if (isDesktop) {
            buildPanelsScrubbed(section, q);
          } else {
            buildPanelsFlow(q);
          }
          return undefined;
        },
      );
    }, section);
    // Web fonts change heading height, so re-measure trigger positions once they load.
    document.fonts?.ready.then(() => {
      if (!disposed) requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    requestAnimationFrame(() => {
      if (!disposed) ScrollTrigger.refresh();
    });
    return () => {
      disposed = true;
      cardObserver?.disconnect();
      ctx.revert();
    };
  }, []);
  return (
    <section
      id="program"
      ref={sectionRef}
      className="services-section section-dark relative isolate w-full overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg)] py-28"
    >
      {/* Full-section battlefield background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 scale-120 z-0 bg-cover bg-center bg-no-repeat brightness-110"
        style={{
          backgroundImage:
            'url("/backgrounds/servicessection/animus-battlefield-bg.jpg")',
        }}
      />
      {/* Lighter overlay: keeps the image visible and text readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-white/55 via-white/35 to-white/65"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-cyber-grid opacity-30" />
      <div className="pointer-events-none absolute bottom-10 left-10 z-[1] h-96 w-96 rounded-full bg-(--color-primary)/10 blur-[140px]" />
      <div className="content-rail relative z-10">
        <div className="prog-header mb-10 text-left sm:mb-14">
          <h2 className="prog-heading max-w-4xl font-display text-[clamp(3.8rem,12vw,8rem)] font-bold uppercase leading-[0.8] tracking-[-0.08em]">
            <span className="-my-[0.1em] block overflow-hidden py-[0.1em]">
              <span className="prog-heading-word block text-[var(--color-text)] will-change-transform drop-shadow-[0_1px_0_rgba(255,255,255,0.16)]">THE</span>
            </span>
            <span className="-my-[0.1em] block overflow-hidden py-[0.1em]">
              <span className="prog-heading-word block text-[var(--color-primary)] will-change-transform drop-shadow-[0_1px_0_rgba(255,255,255,0.12)]">PROGRAM</span>
            </span>
          </h2>
          <p className="prog-header-note mt-6 inline-block max-w-xl border-l-2 border-[var(--color-primary)] bg-[rgba(255,255,255,0.58)] py-2 pl-4 pr-3 font-mono text-[10px] font-semibold uppercase leading-[1.7] tracking-[0.12em] text-[var(--color-text)] shadow-[0_6px_24px_rgba(8,25,34,0.08)] backdrop-blur-sm sm:mt-8 sm:text-[11px]">
            FOUR PHASES · ONE FINAL CHALLENGE · FREE TO JOIN
          </p>
        </div>
        <div className="prog-panels grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {SESSIONS.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.id}
                aria-labelledby={`session-title-${item.id}`}
                className={`prog-panel group relative isolate flex min-h-[390px] flex-col overflow-hidden border p-5 pt-5 shadow-[0_18px_48px_rgba(0,0,0,0.24)] backdrop-blur-md transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 sm:min-h-[405px] xl:min-h-[420px] ${
                  item.isChallenge
                    ? 'border-rose-200/50 hover:border-rose-300/90 hover:shadow-[0_22px_58px_rgba(255,51,75,0.20)]'
                    : 'border-cyan-100/35 hover:border-cyan-100/80 hover:shadow-[0_22px_58px_rgba(0,218,226,0.17)]'
                }`}
                style={{ '--panel-accent': item.accent }}
              >
                {/* Ambient glass and accent bloom */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: item.isChallenge
                      ? 'radial-gradient(circle at 82% 8%, rgba(255,69,104,0.28), transparent 34%), linear-gradient(135deg, rgba(255,69,104,0.10), transparent 52%)'
                      : `radial-gradient(circle at 82% 8%, color-mix(in srgb, ${item.accent} 28%, transparent), transparent 36%), linear-gradient(135deg, rgba(96,235,242,0.12), transparent 54%)`,
                  }}
                />

                {/* Dark atmospheric top, fading into a readable lower surface */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 z-0 ${
                    item.isChallenge
                      ? 'bg-[linear-gradient(180deg,rgba(25,5,16,0.68)_0%,rgba(34,10,24,0.34)_27%,rgba(255,237,242,0.91)_58%,rgba(255,248,250,0.99)_100%)]'
                      : 'bg-[linear-gradient(180deg,rgba(2,12,20,0.64)_0%,rgba(4,20,28,0.25)_27%,rgba(224,245,247,0.91)_58%,rgba(248,253,253,0.99)_100%)]'
                  }`}
                />

                {/* Fine technical grid */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[1] opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_68%)]"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(117,235,241,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(117,235,241,0.18) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Decorative phase numeral */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-[3.8rem] z-[1] select-none font-display text-[clamp(5.5rem,8vw,7rem)] font-black italic leading-none tracking-[-0.12em]"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: item.isChallenge
                      ? '1.5px rgba(251, 113, 133, 0.30)'
                      : '1.5px rgba(103, 232, 249, 0.28)',
                  }}
                >
                  {item.num}
                </span>

                {/* Luminous top rail */}
                <div
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 z-20 h-[2px] ${
                    item.isChallenge
                      ? 'bg-gradient-to-r from-transparent via-rose-400 to-transparent'
                      : 'bg-gradient-to-r from-transparent via-cyan-300 to-transparent'
                  }`}
                />

                {/* HUD corner markers */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute left-3 top-3 z-20 h-4 w-4 border-l border-t ${
                    item.isChallenge ? 'border-rose-200/70' : 'border-cyan-100/70'
                  }`}
                />
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute bottom-3 right-3 z-20 h-4 w-4 border-b border-r ${
                    item.isChallenge ? 'border-rose-700/45' : 'border-cyan-800/40'
                  }`}
                />

                {/* Compact phase and status row */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.1em] ${
                      item.isChallenge ? 'text-rose-700' : 'text-[var(--color-primary)]'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${
                        item.isChallenge ? 'bg-rose-500' : 'bg-[var(--color-primary)]'
                      }`}
                    />
                    {item.isChallenge ? 'Final event' : 'Scheduled'}
                  </span>
                </div>

                {/* Essential session details only */}
                <div className="prog-panel-content relative z-10 mt-auto pt-16">
                  <div className="prog-panel-item mb-2 flex items-center gap-2">
                    <Icon
                      size={15}
                      style={{ color: item.accent }}
                      aria-hidden="true"
                    />
                    <span
                      data-program-scramble
                      className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-slate-700"
                    >
                      {item.date}
                    </span>
                  </div>

                  <h3
                    id={`session-title-${item.id}`}
                    data-program-scramble
                    className="prog-panel-item mb-2 font-display text-xl font-bold uppercase leading-[1] tracking-[-0.03em] text-[var(--color-text)] transition-colors duration-300 group-hover:text-(--panel-accent) sm:text-[1.35rem]"
                  >
                    {item.title}
                  </h3>

                  <p
                    data-program-scramble
                    className="prog-panel-item mb-4 max-w-[30ch] text-xs leading-relaxed text-slate-700"
                  >
                    {item.desc}
                  </p>

                  {/* Compact time and platform metadata */}
                  <div className="prog-panel-item mb-4 space-y-1.5 border-t border-slate-900/15 pt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.06em] text-slate-600">
                    <p data-program-scramble>{item.time}</p>
                    <p
                      data-program-scramble
                      className={`font-bold ${item.isChallenge ? 'text-rose-700' : 'text-[var(--color-primary)]'}`}
                    >
                      {item.platform}
                    </p>
                  </div>

                  <div className="prog-panel-item">
                    <button
                      type="button"
                      onClick={() => onOpenRegister?.(item.isChallenge ? 'team' : 'individual')}
                      className={`nav-angular-button group/cta inline-flex min-h-10 w-full items-center justify-between gap-3 border px-3 py-2.5 font-display text-[9px] font-bold uppercase tracking-[0.09em] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#007b83] ${
                        item.isChallenge
                          ? 'border-rose-500 bg-[#ff4568] text-white hover:border-rose-600 hover:bg-[#ff7189]'
                          : 'border-cyan-700/30 bg-[var(--color-primary)] text-white hover:border-cyan-700/60 hover:bg-[var(--color-electric-aqua)]'
                      }`}
                    >
                      <span>{item.isChallenge ? 'Register team' : 'Register session'}</span>
                      <MoveRight size={14} className="transition-transform duration-200 group-hover/cta:translate-x-1" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {/* Resources & preparation footnote */}
        <div className="prog-footnote mt-8 flex flex-col items-start justify-between gap-6 border border-[var(--color-border)] bg-[rgba(255,255,255,0.55)] p-5 font-mono text-xs leading-relaxed text-[var(--color-text-muted)] shadow-[0_12px_36px_rgba(8,25,34,0.08)] backdrop-blur-md sm:p-6 md:flex-row md:items-center">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
            <span>
              Preparation guidelines, session slides, and HackerRank sample questions will be shared with registered delegates.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              document.getElementById('guide')?.scrollIntoView({
                behavior: reduceMotion ? 'auto' : 'smooth',
                block: 'start',
              });
            }}
            className="whitespace-nowrap font-bold text-[var(--color-primary)] underline-offset-4 transition-colors hover:text-[var(--color-secondary)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-secondary)]"
          >
            Read Delegate Guide →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
