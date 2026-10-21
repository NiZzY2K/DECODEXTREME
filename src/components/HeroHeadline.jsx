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
    if (!ready || !headline) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (headline.getBoundingClientRect().bottom <= 0) return;
      const sequence = gsap.timeline({
        onStart: () => { headline.dataset.motion = 'synchronizing'; },
        onComplete: () => { delete headline.dataset.motion; },
      });

      headline.querySelectorAll('.hero-headline__line').forEach((line, lineIndex) => {
        const start = lineIndex * .32;
        const letters = line.querySelectorAll('.hero-headline__letter');
        const wireframe = line.querySelector('.hero-headline__wireframe');
        const fragments = line.querySelectorAll('.hero-headline__fragment');
        const scan = line.querySelector('.hero-headline__scan');

        // Memory reconstruction: a wireframe resolves into separated type fragments.
        sequence.fromTo(wireframe,
          { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
          { opacity: .65, clipPath: 'inset(0 0% 0 0)', duration: .55, ease: 'power2.inOut' }, start);
        sequence.fromTo(letters,
          { opacity: 0, x: i => (i % 2 ? 1 : -1) * (16 + i * 3), y: i => i % 3 * 7 - 7, scale: .94, filter: 'blur(5px)' },
          { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)', duration: .8,
            stagger: { each: .055, from: 'center' }, ease: 'expo.out', clearProps: 'transform,opacity,filter' }, start + .45);
        sequence.fromTo(fragments,
          { x: i => i % 2 ? 40 : -40, y: i => i % 2 ? -3 : 3, opacity: .55 },
          { x: 0, y: 0, opacity: 0, duration: .7, stagger: .07, ease: 'expo.inOut' }, start + .35);
        sequence.fromTo(scan,
          { yPercent: -15, opacity: 0 },
          { yPercent: 100, opacity: .7, duration: .9, ease: 'power2.inOut' }, start + .25);
        sequence.to([wireframe, scan], { opacity: 0, duration: .3 }, start + 1.2);
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
            {[...word].map((letter, index) => <span className="hero-headline__letter" key={index}>{letter}</span>)}
          </span>
          <span className="hero-headline__wireframe">{word}</span>
          <span className="hero-headline__fragment hero-headline__fragment--upper">{word}</span>
          <span className="hero-headline__fragment hero-headline__fragment--middle">{word}</span>
          <span className="hero-headline__fragment hero-headline__fragment--lower">{word}</span>
          <span className="hero-headline__scan" />
        </span>
      ))}
    </h1>
  );
}
