import { useCallback, useEffect, useState } from 'react';
import { AudioLines, Menu, Volume2, VolumeX, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import NavOverlay from './NavOverlay';
import SoundAmbiance from './SoundAmbiance';
import logo from '../assets/DecodeXtreme Logo.webp';
import fallbackLogo from '../assets/logo.png';

const NAV_ITEMS = [
  { label: 'The Creed', id: 'about' },
  { label: 'Timeline', id: 'timeline' },
  { label: 'Program', id: 'program' },
  { label: 'Delegate Guide', id: 'guide' },
  { label: 'Our Team', path: '/team' },
];

const Navbar = ({
  onOpenRegister,
  isMuted = true,
  onToggleAudio,
  audioAvailable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Update the visual state only when crossing the threshold, not on every scroll.
  useEffect(() => {
    let frameId = 0;

    const updateScrollState = () => {
      frameId = 0;
      const nextValue = window.scrollY > 24;
      setIsScrolled((currentValue) =>
        currentValue === nextValue ? currentValue : nextValue,
      );
    };

    const handleScroll = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(updateScrollState);
      }
    };

    updateScrollState();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = useCallback((id) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const target = document.getElementById(id);
    if (!target) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    target.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [location.pathname, navigate]);

  const handleRegister = useCallback(() => {
    setIsOpen(false);
    onOpenRegister?.();
  }, [onOpenRegister]);

  return (
    <>
      <NavOverlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNavigate={scrollTo}
        onOpenRegister={handleRegister}
      />

      <header className="fixed inset-x-0 top-0 z-50">
        <nav
          aria-label="Main navigation"
          className={[
            'backdrop-blur-xl',
            'transition-[background-color,border-color,box-shadow] duration-200',
            isScrolled
              ? 'border-b border-slate-900/10 shadow-sm'
              : 'border-b border-slate-900/[0.06]',
          ].join(' ')}
        >
          <div className="content-rail flex min-h-[60px] items-center justify-between gap-1.5 sm:min-h-[68px] sm:gap-3 lg:min-h-[76px]">
            {/* Brand */}
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="group flex min-w-0 shrink items-center gap-1.5 sm:shrink-0 sm:gap-3"
              aria-label="DecodeXtreme 2026 homepage"
            >
              <img
                src={logo}
                onError={(event) => {
                  if (event.currentTarget.dataset.fallbackApplied !== 'true') {
                    event.currentTarget.dataset.fallbackApplied = 'true';
                    event.currentTarget.src = fallbackLogo;
                  }
                }}
                alt="DecodeXtreme 2026"
                width="160"
                height="48"
                className="h-7 w-auto max-w-[104px] object-contain sm:h-8 sm:max-w-[132px] lg:h-9 lg:max-w-[160px]"
              />
              <span className="hidden border-l border-slate-900/15 pl-3 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-slate-500 sm:inline-block">
                Animus 20.0
              </span>
            </Link>

            {/* Desktop section navigation */}
            <div className="nav-angular hidden items-center gap-0.5 px-2 py-1.5 lg:flex">
              {NAV_ITEMS.map((item, index) => {
                const isRoute = Boolean(item.path);
                const isActive = isRoute && location.pathname === item.path;
                return (
                  <span key={item.label} className="flex items-center">
                    {index > 0 && (
                      <span
                        aria-hidden="true"
                        className="mx-1 h-1 w-1 bg-[var(--color-primary)]/70"
                      />
                    )}
                    {isRoute ? (
                      <Link
                        to={item.path}
                        className={`nav-angular-button px-3 py-2 font-hud text-xs font-semibold uppercase tracking-[0.09em] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
                          isActive
                            ? 'text-[var(--color-primary)] font-bold'
                            : 'text-slate-700'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => scrollTo(item.id)}
                        className="nav-angular-button px-3 py-2 font-hud text-xs font-semibold uppercase tracking-[0.09em] text-slate-700 transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                      >
                        {item.label}
                      </button>
                    )}
                  </span>
                );
              })}
            </div>

            {/* Desktop actions */}
            <div className="hidden shrink-0 items-center gap-3 md:flex">
              {audioAvailable ? (
                <SoundAmbiance
                  isMuted={isMuted}
                  onToggle={onToggleAudio}
                />
              ) : (
                <span
                  title="Background ambience will be available when the audio file is added."
                  className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.08em] text-slate-500"
                >
                  <AudioLines size={14} aria-hidden="true" />
                  <span>Ambience</span>
                  <span className="text-[var(--color-secondary)]">Coming soon</span>
                </span>
              )}

              <button
                type="button"
                onClick={handleRegister}
                className="nav-angular-button inline-flex min-h-10 items-center justify-center gap-2 bg-[var(--color-primary)] px-5 py-2.5 font-display text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[var(--color-electric-aqua)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-secondary)] active:translate-y-px"
              >
                Register now
              </button>
            </div>

            {/* Mobile actions */}
            <div className="flex shrink-0 items-center gap-1 md:hidden sm:gap-2">
              {audioAvailable ? (
                <button
                  type="button"
                  onClick={onToggleAudio}
                  aria-label={isMuted ? 'Enable background ambience' : 'Mute background ambience'}
                  aria-pressed={!isMuted}
                  className="nav-angular-button inline-flex h-8 w-8 items-center justify-center border border-slate-900/15 bg-white/90 text-slate-700 transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-secondary)] sm:h-9 sm:w-9"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              ) : (
                <span
                  title="Background ambience coming soon"
                  aria-label="Background ambience coming soon"
                  className="nav-angular-button inline-flex h-8 w-8 items-center justify-center border border-slate-900/15 bg-white/90 text-slate-400 sm:h-9 sm:w-9"
                >
                  <AudioLines size={16} aria-hidden="true" />
                </span>
              )}

              <button
                type="button"
                onClick={handleRegister}
                className="nav-angular-button inline-flex min-h-8 items-center justify-center border border-[var(--color-secondary)] bg-[var(--color-primary)] px-2.5 py-1.5 font-display text-[9px] font-bold uppercase tracking-[0.04em] text-white transition-colors hover:bg-[var(--color-electric-aqua)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-secondary)] sm:min-h-9 sm:px-3.5 sm:py-2 sm:text-[10px] sm:tracking-[0.06em]"
              >
                Register
              </button>

              <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="nav-angular-button inline-flex h-8 w-8 items-center justify-center border border-slate-900/15 bg-white/90 text-slate-800 transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-secondary)] sm:h-10 sm:w-10"
                aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
