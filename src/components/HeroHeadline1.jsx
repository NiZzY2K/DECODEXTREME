import { useContext, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import MotionReadyContext from '../context/MotionReadyContext';
import '../styles/hero-headline.css';

const words = ['Think.', 'Solve.', 'Compete.'];

export default function HeroHeadline() {
  const headlineRef = useRef(null);
  const ready = useContext(MotionReadyContext);

  useLayoutEffect(() => {
    const headline = headlineRef.current;
    if (!ready || !headline) return undefined;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      // A restored deep link should not animate a headline already above the viewport.
      if (headline.getBoundingClientRect().bottom <= 0) return undefined;

      const timeline = gsap.timeline({
        onStart: () => { headline.dataset.motion = 'assembling'; },
        onComplete: () => { delete headline.dataset.motion; },
      });

      headline.querySelectorAll('.hero-headline__line').forEach((line, lineIndex) => {
        const letters = line.querySelectorAll('.hero-headline__letter');
        const echoes = line.querySelectorAll('.hero-headline__echo');
        const scan = line.querySelector('.hero-headline__scan');
        const start = 0.12 + lineIndex * 0.24;

        timeline.fromTo(letters, {
          yPercent: 105,
          rotationX: -85,
          x: index => index % 2 ? 8 : -8,
          opacity: 0,
          willChange: 'transform,opacity',
        }, {
          yPercent: 0,
          rotationX: 0,
          x: 0,
          opacity: 1,
          duration: 0.78,
          stagger: { each: 0.035, from: lineIndex === 1 ? 'end' : 'start' },
          ease: 'power4.out',
          clearProps: 'transform,opacity,willChange',
        }, start);

        // Two narrow signal echoes converge once, then leave the headline completely still.
        timeline.fromTo(echoes, {
          x: index => index === 0 ? -24 : 24,
          opacity: 0.48,
        }, {
          x: 0,
          opacity: 0,
          duration: 0.55,
          ease: 'expo.out',
        }, start + 0.28);

        timeline.fromTo(scan, { xPercent: -4, opacity: 0 }, {
          xPercent: 103,
          opacity: 0.75,
          duration: 0.68,
          ease: 'power2.inOut',
        }, start + 0.1)
          .to(scan, { opacity: 0, duration: 0.15 }, start + 0.74);
      });

      return () => { delete headline.dataset.motion; };
    }, headline);

    return () => media.revert();
  }, [ready]);

  return (
    <h1 ref={headlineRef} id="hero-title" className="hero-headline" aria-label="Think. Solve. Compete.">
      {words.map((word, lineIndex) => (
        <span className={`hero-headline__line${lineIndex === 2 ? ' hero-headline__line--accent' : ''}`} key={word} aria-hidden="true">
          <span className="hero-headline__word">
            {[...word].map((letter, index) => <span className="hero-headline__letter" key={`${word}-${index}`}>{letter}</span>)}
          </span>
          <span className="hero-headline__echo hero-headline__echo--upper">{word}</span>
          <span className="hero-headline__echo hero-headline__echo--lower">{word}</span>
          <span className="hero-headline__scan" />
        </span>
      ))}
    </h1>
  );
}
