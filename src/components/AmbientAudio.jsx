import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AUDIO_SOURCE = '/audio/The_Measured_Thought.mp3';

/** Global ambience. An explicit mute is preserved across tab visibility changes. */
export default function AmbientAudio({ enabled = true }) {
  const audioRef = useRef(null);
  const lifecycleRef = useRef({
    mounted: false,
    enabled: false,
    desired: true,
    request: 0,
    pending: false,
  });
  const [status, setStatus] = useState('idle');

  const requestPlayback = useCallback(() => {
    const audio = audioRef.current;
    const lifecycle = lifecycleRef.current;
    if (!audio || !lifecycle.mounted || !lifecycle.enabled || !lifecycle.desired
      || document.visibilityState === 'hidden') return;

    const request = ++lifecycle.request;
    lifecycle.pending = true;
    audio.play().then(() => {
      if (request !== lifecycle.request || !lifecycle.mounted) return;
      lifecycle.pending = false;
      // Media events, rather than the promise, report the actual playback state.
    }, (error) => {
      if (request !== lifecycle.request || !lifecycle.mounted) return;
      lifecycle.pending = false;
      if (!lifecycle.desired || !lifecycle.enabled) return;
      setStatus(error.name === 'NotAllowedError' ? 'blocked'
        : error.name === 'AbortError' ? 'paused' : 'error');
    });
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const lifecycle = lifecycleRef.current;
    lifecycle.mounted = true;
    lifecycle.enabled = enabled;
    audio.volume = 0.18;

    const onPlay = () => setStatus('loading');
    const onPlaying = () => {
      if (!lifecycle.desired || !lifecycle.enabled || document.visibilityState === 'hidden') {
        audio.pause();
        return;
      }
      lifecycle.pending = false;
      setStatus('playing');
    };
    const onPause = () => setStatus((previous) => (
      previous === 'blocked' || previous === 'error' ? previous : 'paused'
    ));
    const onError = () => {
      lifecycle.pending = false;
      lifecycle.request += 1;
      setStatus('error');
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        lifecycle.request += 1;
        lifecycle.pending = false;
        audio.pause();
      } else if (lifecycle.desired && lifecycle.enabled) {
        requestPlayback();
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    document.addEventListener('visibilitychange', onVisibilityChange);
    if (enabled && lifecycle.desired) requestPlayback();

    return () => {
      lifecycle.mounted = false;
      lifecycle.enabled = false;
      lifecycle.request += 1;
      lifecycle.pending = false;
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [enabled, requestPlayback]);

  const toggleSound = () => {
    const audio = audioRef.current;
    const lifecycle = lifecycleRef.current;
    if (!enabled || !audio || status === 'error') return;

    if (!audio.paused || lifecycle.pending) {
      lifecycle.desired = false;
      lifecycle.pending = false;
      lifecycle.request += 1;
      audio.pause();
      setStatus('paused');
    } else {
      lifecycle.desired = true;
      requestPlayback();
    }
  };

  const isPlaying = status === 'playing';
  const isStarting = status === 'loading';
  const label = isPlaying || isStarting ? 'Mute sound'
    : status === 'blocked' || status === 'idle' ? 'Enable sound'
      : status === 'error' ? 'Sound unavailable' : 'Play sound';
  const Icon = isPlaying || isStarting ? Volume2 : VolumeX;

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SOURCE} preload="none" loop aria-hidden="true" />
      <button
        type="button"
        className="ambient-audio-control"
        onClick={toggleSound}
        hidden={!enabled}
        disabled={!enabled || status === 'error'}
        aria-label={label}
        aria-pressed={isPlaying}
        title={label}
        data-playing={isPlaying}
      >
        <Icon size={17} aria-hidden="true" />
        <span>{label}</span>
        <span className="ambient-audio-indicator" aria-hidden="true"><i /><i /><i /></span>
      </button>
    </>
  );
}
