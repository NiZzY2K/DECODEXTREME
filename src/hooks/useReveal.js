import { useContext, useLayoutEffect } from 'react';
import MotionReadyContext from '../context/MotionReadyContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function useReveal(ref) {
  const ready = useContext(MotionReadyContext);
  useLayoutEffect(() => {
    if (!ready || !ref.current) return undefined;

    const media = gsap.matchMedia();
    media.add({
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 900px)',
    }, context => {
      if (!context.conditions.motion) return undefined;

      const root = ref.current;
      const revealElements = root.querySelectorAll('[data-reveal]');

      revealElements.forEach((element, index) => {
        // Content already passed on a restored scroll position stays readable.
        if (element.getBoundingClientRect().bottom <= 0) return;

        gsap.fromTo(element, { y: 26, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.85,
          delay: Math.min(index % 3, 2) * 0.045,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: element,
            start: 'top 94%',
            end: 'bottom top',
            once: true,
            fastScrollEnd: true,
            onLeave: self => self.animation?.progress(1),
          },
        });
      });

      root.querySelectorAll('section[data-section]').forEach(section => {
        const bridge = section.querySelector('.section-bridge');
        if (!bridge) return;

        gsap.fromTo(bridge, {
          scaleX: 0,
          opacity: 0.3,
          transformOrigin: 'left center',
        }, {
          scaleX: 1,
          opacity: 1,
          duration: 1.3,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            end: 'top 20%',
            once: true,
            fastScrollEnd: true,
          },
        });
      });

      if (context.conditions.desktop) {
        root.querySelectorAll('[data-parallax]').forEach(element => {
          const section = element.closest('[data-section]') || element;
          gsap.fromTo(element, { y: -22 }, {
            y: 22,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
        });
      }

      return undefined;
    }, ref);

    return () => media.revert();
  }, [ref, ready]);
}

