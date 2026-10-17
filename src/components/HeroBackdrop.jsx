import { useEffect, useRef, useState } from 'react';
import defaultPoster from '../assets/animus-white-viewpoint.jpg';

const HERO_VIDEO = '/backgrounds/hero/Hooded_character_gazing_at_city_20261007122346.mp4';

export default function HeroBackdrop({ className = '', poster = defaultPoster }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection;
    let inView = false;
    let playbackFailed = false;
    let pendingPlayback = false;
    let requestId = 0;
    let disposed = false;

    const syncPlayback = () => {
      if (disposed) return;
      const permitted = !motionPreference.matches && !connection?.saveData;

      if (!permitted || playbackFailed || !inView || document.hidden) {
        requestId += 1;
        pendingPlayback = false;
        video.pause();
        // Do not download decorative video when a system preference requests a still image.
        if (!permitted && video.hasAttribute('src')) {
          video.removeAttribute('src');
          video.load();
        }
        return;
      }

      if (!video.paused || pendingPlayback) return;
      if (!video.hasAttribute('src')) video.src = HERO_VIDEO;
      if (video.error) video.load();
      video.muted = true;
      const currentRequest = ++requestId;
      pendingPlayback = true;
      video.play().then(() => {
        if (disposed || currentRequest !== requestId) return;
        pendingPlayback = false;
      }).catch(() => {
        if (disposed || currentRequest !== requestId) return;
        pendingPlayback = false;
        playbackFailed = true;
      });
    };

    const failed = () => { playbackFailed = true; pendingPlayback = false; };

    const observer = typeof IntersectionObserver === 'function'
      ? new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncPlayback();
      }, { threshold: 0.05 })
      : null;

    if (observer) observer.observe(video);
    else { inView = true; syncPlayback(); }
    document.addEventListener('visibilitychange', syncPlayback);
    motionPreference.addEventListener('change', syncPlayback);
    connection?.addEventListener?.('change', syncPlayback);
    video.addEventListener('error', failed);

    return () => {
      disposed = true;
      requestId += 1;
      observer?.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      motionPreference.removeEventListener('change', syncPlayback);
      connection?.removeEventListener?.('change', syncPlayback);
      video.removeEventListener('error', failed);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, []);

  return <div className={`hero-backdrop ${className}`}>
    <img className="hero-backdrop__poster" src={poster} alt="" aria-hidden="true" fetchPriority="high" />
    <video
      ref={videoRef}
      className={`hero-backdrop__video${ready ? ' is-ready' : ''}`}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      onLoadedData={() => setReady(true)}
      onEmptied={() => setReady(false)}
      onError={() => setReady(false)}
    />
  </div>;
}
