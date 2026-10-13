import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimusGlobalBackground = () => {
  const canvasRef = useRef(null);
  const crestRef = useRef(null);
  const animRef = useRef(null);

  // Lightweight particle canvas — no images, no layout shift
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let particles = [];
    let rafId;

    const PARTICLE_COUNT = reduceMotion ? 0 : 60;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      spawnParticles();
    };

    const spawnParticles = () => {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.12,
        size: Math.random() * 1.4 + 0.4,
        alpha: Math.random() * 0.35 + 0.08,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(8, 209, 216, ${p.alpha})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    animRef.current = rafId;
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Parallax crest on scroll
  useEffect(() => {
    const crest = crestRef.current;
    if (!crest) return undefined;

    const ctx = gsap.context(() => {
      gsap.to(crest, {
        rotation: 200,
        scale: 0.85,
        yPercent: 80,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
    >
      {/* CSS cyber grid overlay */}
      <div className="absolute inset-0 bg-cyber-grid opacity-[0.07]" />

      {/* Radial gradient ambient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(8,209,216,0.06),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(8,126,135,0.05),transparent)]" />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-70"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Scan line sweep */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(8,209,216,0.015),transparent)] bg-[length:100%_6px] opacity-30" />

      {/* Floating crest watermark */}
      <div
        ref={crestRef}
        className="absolute left-1/2 top-1/4 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 text-[var(--color-primary)] opacity-[0.06] sm:h-[520px] sm:w-[520px] md:h-[700px] md:w-[700px]"
      >
        <svg
          viewBox="0 0 200 240"
          className="h-full w-full fill-none stroke-current stroke-[0.6] drop-shadow-[0_0_30px_rgba(8,209,216,0.3)]"
        >
          <path d="M100,10 L165,135 L135,145 L100,75 L65,145 L35,135 Z" />
          <path d="M100,55 L135,130 L115,138 L100,105 L85,138 L65,130 Z" strokeDasharray="4,2" />
          <path d="M100,140 L125,200 L100,225 L75,200 Z" />
          <circle cx="100" cy="115" r="75" strokeDasharray="3,4" />
          <circle cx="100" cy="115" r="95" />
          <circle cx="100" cy="115" r="45" strokeDasharray="1,5" />
          <line x1="10" y1="115" x2="190" y2="115" />
          <line x1="100" y1="5" x2="100" y2="235" />
        </svg>
      </div>
    </div>
  );
};

export default AnimusGlobalBackground;
