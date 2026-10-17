import { useContext, useLayoutEffect, useRef } from 'react';
import MotionReadyContext from '../context/MotionReadyContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GLYPHS = '01X+<>/{}';

export default function ScrambleText({ as = 'p', children, className = '', ...props }) {
  const ready = useContext(MotionReadyContext);
  const Tag = as;
  const root = useRef(null);
  const text = typeof children === 'string' ? children : '';

  useLayoutEffect(() => {
    const element = root.current;
    if (!ready || !element || !text) return undefined;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const words = Array.from(element.querySelectorAll('.scramble-text__word'), word => ({
        original: word.querySelector('.scramble-text__source').textContent,
        visual: word.querySelector('.scramble-text__visual'),
      }));
      const characterCount = words.reduce((count, word) => count + word.original.length, 0);
      const progress = { value: 0 };
      let animation;
      let played = false;
      let lastFrame = -1;

      const restore = () => {
        element.removeAttribute('data-scrambling');
        words.forEach(word => { word.visual.textContent = ''; });
      };

      const render = () => {
        // Cap glyph replacement at 24fps, independent of the display refresh rate.
        const frame = Math.floor(progress.value * 24);
        if (frame === lastFrame) return;
        lastFrame = frame;
        const revealed = Math.floor(progress.value * characterCount);
        let position = 0;

        words.forEach(word => {
          word.visual.textContent = Array.from(word.original, character => {
            const index = position++;
            if (index < revealed || !/[a-z0-9]/i.test(character)) return character;
            // Most letters stay readable; a short moving band carries the effect.
            if (index > revealed + 18) return character;
            return GLYPHS[(index + frame * 3) % GLYPHS.length];
          }).join('');
        });
      };

      const play = () => {
        if (played || element.getBoundingClientRect().bottom <= 0) return;
        played = true;
        render();
        element.setAttribute('data-scrambling', 'true');
        animation = gsap.to(progress, {
          value: 1,
          duration: 1,
          ease: 'none',
          onUpdate: render,
          onComplete: restore,
        });
      };

      const trigger = ScrollTrigger.create({
        trigger: element,
        start: 'top 88%',
        end: 'bottom top',
        once: true,
        onEnter: play,
        onLeave: () => {
          animation?.kill();
          restore();
        },
      });

      return () => {
        trigger.kill();
        animation?.kill();
        restore();
      };
    });

    return () => media.revert();
  }, [text, ready]);

  return (
    <Tag {...props} ref={root} className={`scramble-text ${className}`.trim()}>
      {text ? text.split(/(\s+)/).map((word, index) => (
        /\s/.test(word) ? word : (
          <span className="scramble-text__word" key={index}>
            <span className="scramble-text__source">{word}</span>
            <span className="scramble-text__visual" aria-hidden="true" />
          </span>
        )
      )) : children}
    </Tag>
  );
}

