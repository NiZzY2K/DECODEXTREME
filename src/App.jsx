import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import TimelineFullscreenMap from './components/TimelineFullscreenMap';
import PrizesSection from './components/PrizesSection';
import GuidelinesSection from './components/GuidelinesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import RegistrationModal from './components/RegistrationModal';
import AnimusGlobalBackground from './components/AnimusGlobalBackground';
import BackgroundShapes from './components/BackgroundShapes';

import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import Newsletter from './pages/Newsletter';
import Pages from './pages/Pages';

// Background audio stored in the public directory.
// Correct URL: do not include "public" in the path.
const BACKGROUND_AUDIO_SRC = '/audio/The_Measured_Thought.mp3';
const BACKGROUND_AUDIO_VOLUME = 0.22;
// Change this single value to control whether the site starts muted.
const BACKGROUND_AUDIO_START_MUTED = false;

// Events browsers accept as a "user gesture" for starting audible audio.
// (Scrolling and hovering do not count.)
const AUDIO_UNLOCK_EVENTS = ['pointerdown', 'pointerup', 'touchend', 'keydown'];

gsap.registerPlugin(ScrollTrigger);

const Home = ({ isLoading, onOpenRegister }) => (
  <>
    <Hero
      loading={isLoading}
      onOpenRegister={() => onOpenRegister('individual')}
    />

    <AboutSection />

    <TimelineFullscreenMap onOpenRegister={onOpenRegister} />

    <ServicesSection
      onOpenRegister={() => onOpenRegister('individual')}
    />

    <PrizesSection />
    <GuidelinesSection />
    <ContactSection />

    <Footer
      onOpenRegister={() => onOpenRegister('individual')}
    />
  </>
);

const App = () => {
  const audioRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(BACKGROUND_AUDIO_START_MUTED);
  // True while the browser has blocked audible autoplay and we are waiting
  // for the visitor's first click / tap / key press to switch the sound on.
  const [audioNeedsGesture, setAudioNeedsGesture] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regType, setRegType] = useState('individual');

  // Enforce light theme globally. No theme toggle is provided.
  useLayoutEffect(() => {
    const root = document.documentElement;

    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  }, []);

  // Refresh ScrollTrigger measurements after the preloader disappears.
  useLayoutEffect(() => {
    if (!isLoading) {
      ScrollTrigger.refresh();
    }
  }, [isLoading]);

  // 1. Try to start audible playback as early as possible.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    let cancelled = false;

    const startAudio = async () => {
      audio.volume = BACKGROUND_AUDIO_VOLUME;
      audio.muted = BACKGROUND_AUDIO_START_MUTED;

      if (BACKGROUND_AUDIO_START_MUTED) {
        setIsMuted(true);
        try {
          await audio.play();
        } catch {
          // Playback can start after the visitor uses the audio control.
        }
        return;
      }

      try {
        // Attempt immediate audible playback.
        await audio.play();

        if (!cancelled && !audio.muted) {
          setIsMuted(false);
        }
      } catch {
        if (cancelled) return;

        // Audible autoplay was blocked by the browser. Keep the track running
        // muted and switch the sound on at the visitor's first interaction.
        audio.muted = true;
        setIsMuted(true);
        setAudioNeedsGesture(true);

        try {
          await audio.play();
        } catch {
          // The first interaction will start it.
        }
      }
    };

    void startAudio();

    return () => {
      cancelled = true;
      audio.pause();
    };
  }, []);

  // 2. If autoplay was blocked, turn the sound on at the first real gesture.
  useEffect(() => {
    if (!audioNeedsGesture) return undefined;

    const audio = audioRef.current;
    if (!audio) return undefined;

    const unlock = (event) => {
      // The audio toggle buttons handle their own click; don't fight them.
      if (event.target instanceof Element && event.target.closest('[aria-pressed]')) return;
      // Escape is not accepted by browsers as a gesture.
      if (event.type === 'keydown' && event.key === 'Escape') return;

      audio.volume = BACKGROUND_AUDIO_VOLUME;
      audio.muted = false;

      audio
        .play()
        .then(() => {
          setIsMuted(false);
          setAudioNeedsGesture(false);
        })
        .catch(() => {
          // This event was not accepted as a gesture (e.g. a touch
          // pointerdown). Go back to muted playback and wait for the next one.
          audio.muted = true;
          audio.play().catch(() => {});
        });
    };

    AUDIO_UNLOCK_EVENTS.forEach((name) =>
      window.addEventListener(name, unlock, { capture: true, passive: true }),
    );

    return () => {
      AUDIO_UNLOCK_EVENTS.forEach((name) =>
        window.removeEventListener(name, unlock, { capture: true }),
      );
    };
  }, [audioNeedsGesture]);

  const openRegister = (type = 'individual') => {
    setRegType(type);
    setIsRegisterOpen(true);
  };

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });
  };

  // Handles both boolean values and functional state updates from Navbar.
  const handleSetMuted = async (nextValue) => {
    const nextMuted =
      typeof nextValue === 'function'
        ? nextValue(isMuted)
        : nextValue;

    // The visitor is now in control; stop waiting for a gesture.
    setAudioNeedsGesture(false);

    const audio = audioRef.current;

    // Stop playback when the visitor mutes the audio.
    if (nextMuted) {
      if (audio) {
        audio.pause();
        audio.muted = true;
      }
      setIsMuted(true);
      return;
    }

    if (!audio) {
      setIsMuted(true);
      return;
    }

    try {
      // Keep background audio subtle.
      audio.volume = BACKGROUND_AUDIO_VOLUME;
      audio.muted = false;

      // Playback is initiated by the visitor's sound-control interaction.
      await audio.play();

      setIsMuted(false);
    } catch (error) {
      // Playback can fail if the codec is unsupported or the browser
      // blocks playback. Keep the requested unmuted state for the next
      // user interaction, which can satisfy the browser's autoplay policy.
      console.warn('Background audio could not be played:', error);
    }
  };

  const toggleAudio = () => {
    void handleSetMuted((currentMuted) => !currentMuted);
  };

  const handleAudioError = () => {
    setIsMuted(true);
    setAudioNeedsGesture(false);
    console.error(
      'Unable to load background audio:',
      BACKGROUND_AUDIO_SRC
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-[var(--color-bg)] text-[var(--color-text)] selection:bg-[var(--color-primary)] selection:text-[#05090d]">
      {/* Background ambience starts when the initial page loading completes. */}
      <audio
        ref={audioRef}
        src={BACKGROUND_AUDIO_SRC}
        loop
        preload="auto"
        autoPlay
        onError={handleAudioError}
        aria-label="Ambient background audio"
      />

      {/* Initial loading screen */}
      {isLoading && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      <AnimusGlobalBackground />
      <BackgroundShapes />

      {/* Navigation: light theme, no theme toggle */}
      <Navbar
        onOpenRegister={() => openRegister('individual')}
        isMuted={isMuted}
        onToggleAudio={toggleAudio}
        audioAvailable={Boolean(BACKGROUND_AUDIO_SRC)}
      />

      {/* Application routes */}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              isLoading={isLoading}
              onOpenRegister={openRegister}
            />
          }
        />

        <Route
          path="/portfolio"
          element={
            <Portfolio
              onOpenRegister={() => openRegister('individual')}
            />
          }
        />

        <Route
          path="/services"
          element={
            <Services
              onOpenRegister={() => openRegister('individual')}
            />
          }
        />

        <Route
          path="/newsletter"
          element={
            <Newsletter
              onOpenRegister={() => openRegister('individual')}
            />
          }
        />

        <Route
          path="/pages"
          element={
            <Pages
              onOpenRegister={() => openRegister('individual')}
            />
          }
        />
      </Routes>

      {/* Registration modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        defaultType={regType}
      />

    </div>
  );
};

export default App;