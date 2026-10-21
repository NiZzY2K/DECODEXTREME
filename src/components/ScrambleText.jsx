import { useContext, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import MotionReadyContext from '../context/MotionReadyContext';
import '../styles/scramble-text.css';

const GLYPHS = '01X+<>/{}';

/** Keeps the real text in the accessibility tree and reserves its exact layout. */
export default function ScrambleText({ as = 'p', children, className = '', enabled = true, active = true, ...props }) {
  const Tag = as;
  const ready = useContext(MotionReadyContext);
  const root = useRef(null);
  const text = typeof children === 'string' ? children : '';

  useLayoutEffect(() => {
    const element = root.current;
    if (!ready || !enabled || !active || !text) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const words = [...element.querySelectorAll('.scramble-text__word')].map(word => ({
        original: word.querySelector('.scramble-text__source').textContent,
        visual: word.querySelector('.scramble-text__visual'),
      }));
      const characterCount = words.reduce((count, word) => count + word.original.length, 0);
      const progress = { value: 0 };
      let animation;
      let frame = -1;
      const restore = () => {
        delete element.dataset.scrambling;
        words.forEach(word => { word.visual.textContent = ''; });
      };
      const render = () => {
        const nextFrame = Math.floor(progress.value * 28);
        if (nextFrame === frame) return;
        frame = nextFrame;
        let position = 0;
        const revealed = Math.floor(progress.value * characterCount);
        words.forEach(word => {
          word.visual.textContent = [...word.original].map(character => {
            const index = position++;
            if (index < revealed || index > revealed + 20 || !/[a-z0-9]/i.test(character)) return character;
            return GLYPHS[(index + frame * 3) % GLYPHS.length];
          }).join('');
        });
      };
      // IntersectionObserver also works for dialogs and newly expanded FAQ answers.
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        render();
        element.dataset.scrambling = 'true';
        animation = gsap.to(progress, { value: 1, duration: 1.15, ease: 'none', onUpdate: render, onComplete: restore });
      }, { rootMargin: '0px 0px -5% 0px' });
      observer.observe(element);
      const finishWhenHidden = () => { if (document.hidden) animation?.progress(1); };
      document.addEventListener('visibilitychange', finishWhenHidden);
      return () => {
        observer.disconnect();
        animation?.kill();
        document.removeEventListener('visibilitychange', finishWhenHidden);
        restore();
      };
    });
    return () => media.revert();
  }, [text, ready, enabled, active]);

  return (
    <Tag {...props} ref={root} className={`scramble-text ${className}`.trim()}>
      {text && enabled ? text.split(/(\s+)/).map((word, index) => /\s/.test(word) ? word : (
        <span className="scramble-text__word" key={index}>
          <span className="scramble-text__source">{word}</span>
          <span className="scramble-text__visual" aria-hidden="true" />
        </span>
      )) : children}
    </Tag>
  );
}

