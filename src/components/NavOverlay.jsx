import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';

const NAV_ITEMS = [
  { num: '01', label: 'The Creed', target: 'about' },
  { num: '02', label: 'Mission Timeline', target: 'timeline' },
  { num: '03', label: 'Program & Sessions', target: 'program' },
  { num: '04', label: 'Recognition & Prizes', target: 'prizes' },
  { num: '05', label: 'Delegate Guide', target: 'guide' },
  { num: '06', label: 'Operatives & Team', target: 'operatives' },
];

const CLOSE_DURATION = 0.38;

const NavOverlay = ({ isOpen, onClose, onNavigate, onOpenRegister }) => {
  const overlayRef = useRef(null);
  const linksRef = useRef(null);
  const closeTimerRef = useRef(0);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return undefined;

    const links = linksRef.current?.querySelectorAll('[data-overlay-link]') ?? [];
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // Kill the previous state transition without reverting its current transform;
    // this lets the close animation start from the overlay's actual position.
    gsap.killTweensOf(overlay);
    gsap.killTweensOf(links);

    let timeline;
    if (prefersReducedMotion) {
      gsap.set(overlay, { xPercent: isOpen ? 0 : 100 });
      gsap.set(links, { clearProps: 'opacity,transform,visibility' });
    } else if (isOpen) {
      timeline = gsap.timeline();
      timeline.fromTo(
        overlay,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.48, ease: 'power3.out', overwrite: true },
      );
      timeline.fromTo(
        links,
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.38,
          stagger: 0.055,
          ease: 'power2.out',
          clearProps: 'transform',
        },
        '-=0.28',
      );
    } else {
      timeline = gsap.to(overlay, {
        xPercent: 100,
        duration: CLOSE_DURATION,
        ease: 'power3.inOut',
        overwrite: true,
      });
    }

    return () => {
      timeline?.kill();
      gsap.killTweensOf(overlay);
      gsap.killTweensOf(links);
    };
  }, [isOpen]);

  // Lock page scrolling while the navigation behaves as a modal overlay.
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';

    const focusFrame = window.requestAnimationFrame(() => {
      overlayRef.current?.querySelector('button[data-overlay-link]')?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();

      // Keep keyboard focus inside the open navigation.
      if (event.key !== 'Tab') return;
      const focusable = overlayRef.current?.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [isOpen, onClose]);

  useEffect(() => () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
  }, []);

  const handleNavClick = (target) => {
    onClose?.();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);

    closeTimerRef.current = window.setTimeout(() => {
      onNavigate?.(target);
      closeTimerRef.current = 0;
    }, reduceMotion ? 0 : CLOSE_DURATION * 1000 + 30);
  };

  const handleRegister = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    onClose?.();
    onOpenRegister?.();
  };

  return (
    <div
      id="site-navigation-overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!isOpen}
      inert={!isOpen}
      className="fixed inset-0 z-40 flex h-[100svh] w-full flex-col justify-start overflow-y-auto bg-[#040608]/[0.98] px-5 pb-10 pt-24 text-white shadow-2xl backdrop-blur-2xl will-change-transform max-md:bg-[var(--color-bg)] max-md:text-[#081922] sm:px-8 sm:pb-12 sm:pt-28 md:justify-center md:px-16 md:pt-12 xl:px-24"
      style={{ transform: 'translateX(100%)' }}
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-primary)] sm:mb-8 sm:text-xs sm:tracking-widest">
          <span className="h-px w-8 bg-[var(--color-primary)]" aria-hidden="true" />
          <span>System navigation matrix</span>
        </div>

        <div ref={linksRef} className="space-y-1 sm:space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.num}
              type="button"
              data-overlay-link
              onClick={() => handleNavClick(item.target)}
              className="group nav-angular-button flex w-full items-baseline gap-3 border-b border-white/10 py-3 text-left text-white transition-colors hover:bg-white/[0.04] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] max-md:border-slate-900/10 max-md:text-[#081922] max-md:hover:bg-[var(--color-bg-elevated)] sm:gap-4 sm:py-3.5"
            >
              <span className="w-6 shrink-0 font-mono text-[10px] text-[var(--color-primary)] opacity-70 sm:w-8 sm:text-xs">
                {item.num}
              </span>
              <span className="font-display text-[clamp(1.35rem,5.8vw,2.5rem)] font-bold leading-tight tracking-[-0.035em] sm:text-4xl md:text-5xl">
                {item.label}
              </span>
              <ArrowUpRight
                size={18}
                aria-hidden="true"
                className="ml-auto shrink-0 translate-y-0.5 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              />
            </button>
          ))}
        </div>

        <div className="flex flex-col items-start gap-4 pt-7 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
          <p className="max-w-sm font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-white/45 max-md:text-slate-500 sm:text-[10px]">
            DecodeXtreme 2026 · IEEE Student Branch of SLTC
          </p>
          <button
            type="button"
            onClick={handleRegister}
            className="nav-angular-button inline-flex min-h-11 items-center justify-center gap-3 border border-[var(--color-secondary)] bg-[var(--color-primary)] px-5 py-3 font-display text-[10px] font-bold uppercase tracking-[0.08em] text-[#052126] transition-colors hover:bg-[var(--color-electric-aqua)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-secondary)] sm:px-7 sm:text-xs"
          >
            <span>Register for DecodeXtreme</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavOverlay;
