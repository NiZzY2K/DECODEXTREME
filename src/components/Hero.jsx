import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { ArrowDown, Crosshair, MoveRight } from 'lucide-react';

import gsap from 'gsap';



import heroImage from '../assets/hero.png';

import sbLogo from '../assets/sb-logo-color.webp';

import csLogo from '../assets/IEEE-CS_LogoTM-orange.webp';



// Put files inside Vite's public/ directory, then reference them from the root.

const HERO_VARIANT = 0;

const HERO_VARIANTS = [

  {

    desktopVideo: '/backgrounds/hero/Hooded_character_gazing_at_city_20261007122346.mp4',

    desktopCharacter: '',

    mobileVideo: '/backgrounds/hero/Hooded_character_gazing_at_city_20261007122346.mp4',

    mobileCharacter: '',

  },

  {

    desktopVideo: '/backgrounds/hero/Hooded_character_gazing_at_city_20261007122346.mp4',

    desktopCharacter: '',

    mobileVideo: '/backgrounds/hero/Hooded_character_gazing_at_city_20261007122346.mp4',

    mobileCharacter: '',

  },

];



const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&';

const scrambleRuns = new WeakMap();





function scrambleText(element, duration = 0.7) {

  if (!element) return null;



  const finalText = element.dataset.heroOriginalText ?? element.textContent ?? '';

  element.dataset.heroOriginalText = finalText;

  scrambleRuns.get(element)?.kill();



  const characters = [...finalText];

  const scrambled = characters.map((character) => (

    /[a-z0-9]/i.test(character)

      ? SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]

      : character

  ));

  const state = { progress: 0 };

  let lastRendered = '';



  const tween = gsap.to(state, {

    progress: 1,

    duration,

    ease: 'power2.out',

    onStart: () => {

      element.textContent = scrambled.join('');

      lastRendered = element.textContent;

    },

    onUpdate: () => {

      const revealed = Math.floor(state.progress * characters.length);

      const nextText = characters.map((character, index) => {

        if (!/[a-z0-9]/i.test(character) || index < revealed || state.progress === 1) {

          return character;

        }

        return scrambled[index];

      }).join('');



      if (nextText !== lastRendered) {

        element.textContent = nextText;

        lastRendered = nextText;

      }

    },

    onComplete: () => {

      element.textContent = finalText;

      scrambleRuns.set(element, null);

    },

  });



  scrambleRuns.set(element, tween);

  return tween;

}



const Hero = ({ loading, onOpenRegister }) => {

  const containerRef = useRef(null);

  const titleRef = useRef(null);

  const videoRef = useRef(null);

  const [isMobileCreative, setIsMobileCreative] = useState(false);



  const heroVariant = HERO_VARIANTS[HERO_VARIANT] ?? HERO_VARIANTS[0];

  const backgroundVideoSrc = isMobileCreative

    ? heroVariant.mobileVideo

    : heroVariant.desktopVideo;

  // Use the existing hero artwork as the foreground character unless a variant overrides it.
  const characterImageSrc = isMobileCreative
    ? (heroVariant.mobileCharacter || heroImage)
    : (heroVariant.desktopCharacter || heroImage);



  useEffect(() => {

    const mediaQuery = window.matchMedia('(max-width: 1023px)');

    const syncCreative = () => setIsMobileCreative(mediaQuery.matches);



    syncCreative();

    if (mediaQuery.addEventListener) {

      mediaQuery.addEventListener('change', syncCreative);

      return () => mediaQuery.removeEventListener('change', syncCreative);

    }



    // Compatibility for older Safari versions.

    mediaQuery.addListener(syncCreative);

    return () => mediaQuery.removeListener(syncCreative);

  }, []);



  // Play the intro only after the preloader has completed its exit transition.

  useLayoutEffect(() => {

    const root = containerRef.current;

    if (loading || !root) return undefined;



    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) return undefined;



    const context = gsap.context(() => {

      const isMobile = window.matchMedia('(max-width: 1023px)').matches;

      const titleLines = titleRef.current?.querySelectorAll('[data-hero-title-line]') ?? [];

      const scrambleTargets = [...root.querySelectorAll('[data-hero-scramble]')];

      const introTargets = [

        ...root.querySelectorAll('.hero-kicker, .hero-index, .hero-subtitle, .hero-date-line, .hero-action-dock, .hero-stage, .hero-organizer'),

        ...titleLines,

      ];



      gsap.set(introTargets, { autoAlpha: 0 });



      const timeline = gsap.timeline({

        defaults: { ease: 'power2.out', overwrite: 'auto' },

      });



      timeline

        .fromTo(

          root.querySelectorAll('.hero-kicker, .hero-index'),

          { y: isMobile ? 8 : 12 },

          { y: 0, autoAlpha: 1, duration: isMobile ? 0.32 : 0.42 },

        )

        .fromTo(

          titleLines,

          { y: isMobile ? 18 : 26 },

          {

            y: 0,

            autoAlpha: 1,

            duration: isMobile ? 0.48 : 0.62,

            stagger: isMobile ? 0.06 : 0.09,

            ease: 'power3.out',

          },

          '-=0.16',

        )

        .fromTo(

          root.querySelectorAll('.hero-subtitle, .hero-date-line, .hero-action-dock'),

          { y: isMobile ? 10 : 14 },

          {

            y: 0,

            autoAlpha: 1,

            duration: isMobile ? 0.34 : 0.44,

            stagger: isMobile ? 0.05 : 0.07,

          },

          '-=0.18',

        )

        .add(() => {

          scrambleTargets.forEach((target, index) => {

            scrambleText(target, isMobile ? 0.42 + index * 0.06 : 0.55 + index * 0.08);

          });

        }, '-=0.12')

        .fromTo(

          root.querySelectorAll('.hero-stage'),

          { y: isMobile ? 10 : 18, scale: isMobile ? 0.995 : 0.98 },

          { y: 0, scale: 1, autoAlpha: 1, duration: isMobile ? 0.42 : 0.62, ease: 'power2.out' },

          '-=0.2',

        )

        .fromTo(

          root.querySelectorAll('.hero-organizer'),

          { y: 10 },

          { y: 0, autoAlpha: 1, duration: 0.36 },

          '-=0.16',

        );



      const scanLine = root.querySelector('.hero-scan-line');

      if (scanLine) {

        gsap.fromTo(

          scanLine,

          { xPercent: -100, autoAlpha: 0.1 },

          {

            xPercent: 100,

            autoAlpha: 0.6,

            duration: 3.2,

            ease: 'none',

            repeat: -1,

            repeatDelay: 1.4,

          },

        );

      }



      const orbit = root.querySelector('.hero-orbit');

      if (orbit) {

        gsap.to(orbit, {

          rotate: 360,

          duration: 30,

          ease: 'none',

          repeat: -1,

        });

      }

    }, root);



    return () => {

      context.revert();

      root.querySelectorAll('[data-hero-scramble]').forEach((element) => {

        scrambleRuns.get(element)?.kill();

        scrambleRuns.set(element, null);

        if (element.dataset.heroOriginalText !== undefined) {

          element.textContent = element.dataset.heroOriginalText;

        }

      });

    };

  }, [loading]);



  // Run the decorative video only while this section is visible.

  useEffect(() => {

    const video = videoRef.current;

    const hero = containerRef.current;

    if (loading || !video || !hero || !backgroundVideoSrc) {

      video?.pause();

      return undefined;

    }



    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const saveData = Boolean(navigator.connection?.saveData);

    if (reduceMotion || saveData) {

      video.pause();

      return undefined;

    }



    let isVisible = false;

    let observer;



    const syncPlayback = () => {

      if (isVisible && document.visibilityState === 'visible') {

        video.play().catch(() => { });

      } else {

        video.pause();

      }

    };



    const onVisibilityChange = () => syncPlayback();

    document.addEventListener('visibilitychange', onVisibilityChange);



    if ('IntersectionObserver' in window) {

      observer = new IntersectionObserver(([entry]) => {

        isVisible = entry.isIntersecting;

        syncPlayback();

      }, { threshold: 0.12 });

      observer.observe(hero);

    } else {

      isVisible = true;

      syncPlayback();

    }



    return () => {

      observer?.disconnect();

      document.removeEventListener('visibilitychange', onVisibilityChange);

      video.pause();

    };

  }, [loading, backgroundVideoSrc]);



  const scrollToTimeline = () => {

    document.getElementById('timeline')?.scrollIntoView({

      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',

      block: 'start',

    });

  };



  return (

    <section

      ref={containerRef}

      aria-labelledby="hero-title"

      className="relative isolate flex min-h-svh w-full flex-col overflow-hidden bg-[var(--color-bg)] pt-20 text-[var(--color-text)] sm:pt-24 lg:pt-20"

    >

      {/* Full-bleed cinematic backdrop */}

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">

        <video

          ref={videoRef}

          src={backgroundVideoSrc || undefined}

          poster={heroImage}

          muted

          loop

          playsInline

          preload="none"

          tabIndex={-1}

          className="absolute inset-0 h-full w-full object-cover object-[center_38%] opacity-100 saturate-100"

        />

      </div>

      <div className="content-rail hero-content relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-8 py-9 sm:gap-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.96fr)] lg:gap-x-8 lg:py-10 xl:gap-x-12">

        <div className="hero-copy relative z-20 flex min-w-0 max-w-[36rem] flex-col items-start text-left">

          <div ref={titleRef} className="w-full">

            <h1

              id="hero-title"

              className="max-w-full font-display text-[clamp(3.25rem,11vw,5.1rem)] font-bold uppercase leading-[0.86] tracking-[-0.065em] text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.72)] sm:text-[clamp(4.2rem,8vw,5.9rem)] lg:text-[clamp(4rem,5.2vw,6.1rem)] xl:text-[6.4rem]"

            >

              <span className="block overflow-hidden py-[0.05em]" data-hero-title-line>DECODE</span>

              <span className="block overflow-hidden py-[0.05em] text-[var(--color-primary)]" data-hero-title-line>XTREME</span>

            </h1>

          </div>



          <p data-hero-scramble className="hero-subtitle mt-3 max-w-md font-mono text-xs leading-6 tracking-wide text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:mt-4 sm:text-sm sm:leading-7">

            <span className="mr-2 font-bold text-[var(--color-primary)]" aria-hidden="true">

              &gt;_

            </span>

            Sharpen your skills, solve boldly, and compete together.

          </p>



          <div className="hero-date-line mt-6 grid w-full max-w-[34rem] grid-cols-1 gap-3 border-l-2 border-[var(--color-primary)] pl-4 sm:mt-7 sm:grid-cols-2 sm:gap-5">

            <div>

              <p className="mb-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/60 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">Event window</p>

              <p className="font-mono text-[11px] font-semibold uppercase leading-relaxed tracking-[0.08em] text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] sm:text-xs">

                <span data-hero-scramble>October 12–24, 2026</span>

              </p>

            </div>

            <div>

              <p className="mb-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/60 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">Format</p>

              <p className="flex flex-wrap items-center gap-2 font-mono text-[11px] font-semibold uppercase leading-relaxed tracking-[0.08em] text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] sm:text-xs">

                <span data-hero-scramble>Online · Sri Lanka</span>

                <span

                  className="inline-flex translate-y-px items-center"

                  title="Sri Lankan flag"

                  aria-label="Sri Lankan flag"

                  role="img"

                >

                  <svg aria-hidden="true" className="h-3 w-5 rounded-[1px] border border-white/15" viewBox="0 0 30 20" role="presentation">

                    <rect width="30" height="20" fill="#f6c344" />

                    <rect x="1" y="1" width="28" height="18" fill="#ffb81c" />

                    <rect x="2" y="2" width="5" height="16" fill="#0b7a3e" />

                    <rect x="7" y="2" width="5" height="16" fill="#eb1c2d" />

                    <rect x="12" y="2" width="16" height="16" fill="#8d153a" />

                    <circle cx="20" cy="10" r="3" fill="#f6c344" />

                    <path d="M20 6.8 20.8 9l2.2.2-1.7 1.4.5 2.2-1.8-1.2-1.8 1.2.5-2.2L17 9.2l2.2-.2L20 6.8Z" fill="#8d153a" />

                  </svg>

                </span>

              </p>

            </div>

          </div>



          <div className="hero-action-dock mt-6 flex w-full max-w-[34rem] flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap">

            <button

              type="button"

              onClick={onOpenRegister}

              className="nav-angular-button group inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[var(--color-primary)] px-5 py-3 font-display text-[11px] font-bold uppercase tracking-[0.1em] text-white shadow-sm transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-electric-aqua)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)] active:translate-y-px sm:w-auto sm:min-w-44"

            >

              <span>Register now</span>

              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white transition-colors duration-200 group-hover:bg-white/30">

                <MoveRight size={14} aria-hidden="true" />

              </span>

            </button>



            <button

              type="button"

              onClick={scrollToTimeline}

              className="nav-angular-button inline-flex min-h-12 w-full items-center justify-center gap-2.5 border border-white/40 bg-black/25 px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-white/90 backdrop-blur-sm transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:bg-black/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)] active:translate-y-px sm:w-auto"

            >

              <span>View timeline</span>

              <ArrowDown size={14} className="text-[var(--color-primary)]" aria-hidden="true" />

            </button>

          </div>

        </div>



        {characterImageSrc && (

          <div className="hero-stage pointer-events-none absolute right-[-16%] top-24 z-0 flex h-[23rem] w-[82%] items-center justify-center opacity-20 sm:right-[-11%] sm:top-20 sm:h-[31rem] sm:w-[72%] sm:opacity-30 lg:relative lg:right-auto lg:top-auto lg:z-10 lg:col-start-2 lg:row-start-1 lg:h-full lg:min-h-[34rem] lg:w-full lg:opacity-100">

            <div className="hero-orbit absolute aspect-square w-[78%] rounded-full border border-[var(--color-border)] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

            <div className="absolute left-[12%] top-[15%] h-16 w-16 border-l border-t border-[var(--color-primary)]/50 sm:left-[8%] sm:top-[12%] sm:h-24 sm:w-24" />

            <div className="absolute bottom-[13%] right-[9%] h-20 w-20 border-b border-r border-[var(--color-primary)]/50 sm:bottom-[10%] sm:right-[8%] sm:h-28 sm:w-28" />

            <img

              key={characterImageSrc}

              src={characterImageSrc}

              alt="Hooded character overlooking the city"

              fetchPriority="high"

              decoding="async"

              className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.55)]"

            />

            <div className="hero-scan-line absolute inset-y-[12%] left-0 z-20 w-px bg-[var(--color-primary)] shadow-[0_0_12px_var(--color-primary)]" />

            <div className="hero-index absolute bottom-[8%] left-[7%] hidden items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)] xl:flex">

              <Crosshair size={13} aria-hidden="true" />

              <span>Online qualifier · 2026</span>

            </div>

          </div>

        )}

      </div>



      {/* Organizer ribbon */}

      <div className="hero-organizer relative z-10 mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 backdrop-blur-md sm:px-6">

        <div className="content-rail mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between sm:gap-8">

          <div className="flex items-center gap-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-dim)] sm:text-[10px]">

            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />

            <span>Organized by</span>

          </div>



          <div className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:w-auto sm:justify-end sm:gap-x-8 md:gap-x-10" role="group" aria-label="Event organizers">

            <img

              src={sbLogo}

              alt="SLTC IEEE Student Branch"

              loading="lazy"

              decoding="async"

              className="h-7 w-auto max-w-[42vw] object-contain opacity-70 transition-opacity duration-200 hover:opacity-100 md:h-8"

              style={{ filter: 'brightness(1.8) saturate(0.6)' }}

            />

            <span className="hidden h-6 w-px bg-[var(--color-border)] sm:block" aria-hidden="true" />

            <img

              src={csLogo}

              alt="IEEE Computer Society SLTC"

              loading="lazy"

              decoding="async"

              className="h-6 w-auto max-w-[42vw] object-contain opacity-70 transition-opacity duration-200 hover:opacity-100 md:h-7"

              style={{ filter: 'brightness(1.6) saturate(0.7)' }}

            />

          </div>

        </div>

      </div>

    </section>

  );

};



export default Hero;
