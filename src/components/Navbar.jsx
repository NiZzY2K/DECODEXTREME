import { useCallback, useEffect, useState } from 'react';
import { AudioLines, Menu, Volume2, VolumeX, X } from 'lucide-react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import NavOverlay from './NavOverlay';
import SoundAmbiance from './SoundAmbiance';
import logo from '../assets/DecodeXtreme Logo.webp';
import fallbackLogo from '../assets/logo.png';

const NAV_ITEMS = [
  { label: 'The Creed', id: 'about' },
  { label: 'Timeline', id: 'timeline' },
  { label: 'Program', id: 'program' },
  { label: 'Delegate Guide', id: 'guide' },
  { label: 'Our Team', id: 'operatives', path: '/team' },
];

const Navbar = ({
  onOpenRegister,
  isMuted = true,
  onToggleAudio,
  audioAvailable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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

  
  const handleNavItemClick = useCallback(
    (item) => {
      setIsOpen(false);

      // Navigate to a separate page.
      if (item.path) {
        navigate(item.path);
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        return;
      }

      if (!item.id) return;

      // Return home if the requested section isn't on this page.
      if (location.pathname !== '/') {
        navigate('/', { state: { scrollTo: item.id } });
        return;
      }

      // Scroll directly when already on the homepage.
      const target = document.getElementById(item.id);
      if (!target) return;

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    },
    [navigate, location.pathname],
  );
  
  useEffect(() => {
    const sectionId = location.state?.scrollTo;

    if (location.pathname !== '/' || !sectionId) return;

    const frameId = window.requestAnimationFrame(() => {
      const target = document.getElementById(sectionId);

      if (target) {
        const reduceMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;

        target.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }

      // Remove the one-time scroll request.
      navigate('/', { replace: true, state: null });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [location.pathname, location.state, navigate]);

  const handleRegister = useCallback(() => {
    setIsOpen(false);
    onOpenRegister?.();
  }, [onOpenRegister]);

  return (
    <>
      <NavOverlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNavigate={handleNavItemClick}
        onOpenRegister={handleRegister}
      />

      <header className="fixed inset-x-0 top-0 z-50">
        <nav
          aria-label="Main navigation"
          className={[
            'backdrop-blur-xl',
            'transition-[background-color,border-color,box-shadow] duration-200',
            isScrolled
              ? 'border-slate-900/10'
              : 'border-slate-900/[0.06]',
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
            <div className="nav-angular hidden items-center gap-0.5 px-2 py-1.5 xl:flex">
              {NAV_ITEMS.map((item, index) => (
                <span key={item.id} className="flex items-center">
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="mx-1 h-1 w-1 bg-[var(--color-primary)]/70"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => handleNavItemClick(item)}
                    className="nav-angular-button px-3 py-2 font-hud text-xs font-semibold uppercase tracking-[0.09em] text-slate-600 transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-secondary)]"
                  >
                    {item.label}
                  </button>
                </span>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="hidden shrink-0 items-center gap-3 xl:flex">
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
                className="nav-angular-button inline-flex min-h-10 items-center justify-center gap-2 bg-[var(--color-primary)] px-5 py-2.5 font-display text-[11px] font-bold uppercase tracking-[0.1em] text-[#052126] transition-colors hover:bg-[var(--color-electric-aqua)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-secondary)] active:translate-y-px"
              >
                Register now
              </button>
            </div>

            {/* Mobile actions */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2 xl:hidden">
              {audioAvailable ? (
                <button
                  type="button"
                  onClick={onToggleAudio}
                  aria-label={isMuted ? 'Enable background ambience' : 'Mute background ambience'}
                  aria-pressed={!isMuted}
                  className="nav-angular-button inline-flex h-11 w-11 items-center justify-center border border-slate-900/15 bg-white/90 text-slate-700 transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-secondary)]"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              ) : (
                <span
                  title="Background ambience coming soon"
                  aria-label="Background ambience coming soon"
                  className="nav-angular-button inline-flex h-11 w-11 items-center justify-center border border-slate-900/15 bg-white/90 text-slate-400"
                >
                  <AudioLines size={16} aria-hidden="true" />
                </span>
              )}

              <button
                type="button"
                onClick={handleRegister}
                className="nav-angular-button inline-flex min-h-11 items-center justify-center border border-[var(--color-secondary)] bg-[var(--color-primary)] px-2.5 py-2 font-display text-[10px] font-bold uppercase tracking-[0.04em] text-[#052126] transition-colors hover:bg-[var(--color-electric-aqua)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-secondary)] sm:px-3.5 sm:tracking-[0.06em]"
              >
                Register
              </button>

              <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="nav-angular-button inline-flex h-11 w-11 items-center justify-center border border-slate-900/15 bg-white/90 text-slate-800 transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-secondary)]"
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
