import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RegistrationModal from './components/RegistrationModal';
import Preloader from './components/Preloader';
import AmbientAudio from './components/AmbientAudio';
import AnimusGlobalBackground from './components/AnimusGlobalBackground';
import MotionReadyContext from './context/MotionReadyContext';

gsap.registerPlugin(ScrollTrigger);

const Team = lazy(() => import('./pages/Team'));

export default function App() {
  const [registration, setRegistration] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const completeLoading = useCallback(() => {
    setIsLoading(false);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      ScrollTrigger.refresh();
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [isLoading]);

  const location = useLocation();

  useEffect(() => {
    document.title = `${location.pathname === '/team' ? 'Our team' : 'Think. Solve. Compete.'} | DecodeXtreme 2026`;
    const frame = requestAnimationFrame(() => {
      const target = location.hash && document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [location]);

  const openRegister = (type = 'choose') => setRegistration(type);

  return (
    <MotionReadyContext.Provider value={!isLoading}>
      <AnimusGlobalBackground />
      <div inert={isLoading} aria-hidden={isLoading || undefined} style={{ position: 'relative', zIndex: 1 }}>
        <a className="skip-link" href="#main">Skip to content</a>
        <Navbar onOpenRegister={() => openRegister()} />
        <Suspense fallback={<main id="main" className="page-loading" aria-busy="true">Loading the team…</main>}>
          <Routes>
            <Route path="/" element={<Home onOpenRegister={openRegister} />} />
            <Route path="/team" element={<Team />} />
            <Route path="*" element={<main id="main" className="page-intro container"><p className="eyebrow">404 / Off the map</p><h1>Let’s find your way back.</h1><Link className="button" to="/">Back to home</Link></main>} />
          </Routes>
        </Suspense>
        <Footer onOpenRegister={() => openRegister()} />
        {registration && <RegistrationModal type={registration} onClose={() => setRegistration(null)} />}
        <AmbientAudio enabled={!isLoading} />
      </div>
      {isLoading && <Preloader onComplete={completeLoading} />}
    </MotionReadyContext.Provider>
  );
}

