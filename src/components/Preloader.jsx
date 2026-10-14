import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const PHASE_LABELS = [
  {
    phase: '01 / DNA SIGNAL ACQUISITION',
    detail: 'Searching encoded memory fragments...',
    tag: 'ACQUIRING SIGNAL'
  },
  {
    phase: '02 / STRAND ALIGNMENT',
    detail: 'Rebuilding sequence structure...',
    tag: 'MAPPING STRANDS'
  },
  {
    phase: '03 / CIPHER DECRYPTION',
    detail: 'Resolving encrypted memory sectors...',
    tag: 'DECODING ARCHIVE'
  },
  {
    phase: '04 / FULL SYNCHRONIZATION',
    detail: 'Memory reconstruction complete.',
    tag: 'SYNCHRONIZING'
  }
];

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const wipeRef = useRef(null);
  const hudRef = useRef(null);

  const [count, setCount] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let now = 0;
    let raf = 0;
    let finished = false;

    const visual = {
      speed: 1,
      spread: 1,
      resolve: 0,
      glow: 0.65,
      disperse: 0,
      turn: 0
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', resize);
    resize();

    const fract = (x) => x - Math.floor(x);
    const rnd = (x) => fract(Math.sin(x * 127.1 + 78.233) * 43758.5453123);

    // Horizontal DNA Double Helix strand calculation
    const strand = (t, s) => {
      const cycles = W > 768 ? 3 : 2;
      const ph = t * Math.PI * cycles + now * 0.42 + visual.turn;
      const rad = Math.cos(ph);
      const scale = Math.min(W / 1200, H / 760, 1.5);
      const A = Math.min(125, Math.max(50, H * 0.16)) * visual.spread;
      const perspective = 0.68 + (0.32 * (rad + 1)) / 2;

      return {
        // x spans horizontally across screen width with edge bleed
        x: W * 0.5 + t * (W * 0.52),
        // y oscillates vertically around center
        y: H * 0.5 + Math.sin(ph) * A * s * perspective,
        z: rad * s,
        scale,
        perspective
      };
    };

    const draw = () => {
      now += 0.012 * visual.speed;
      ctx.clearRect(0, 0, W, H);

      // Atmospheric radial gradient for pristine white Animus corridor
      const g = ctx.createRadialGradient(W * 0.5, H * 0.5, 10, W * 0.5, H * 0.5, Math.max(W, H) * 0.55);
      g.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      g.addColorStop(0.55, 'rgba(235, 240, 242, 0.08)');
      g.addColorStop(1, 'rgba(215, 222, 226, 0.03)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // Compute DNA nodes along horizontal span
      const count = Math.min(220, Math.max(100, Math.floor(W / 6.5)));
      const DNA = [];
      for (let i = 0; i < count; i++) {
        const t = (i / (count - 1) - 0.5) * 2;
        const a = strand(t, 1);
        const b = strand(t, -1);
        DNA.push([a, b, t]);
      }

      // Connecting horizontal base-pair rungs
      for (let i = 1; i < count; i += 2) {
        const [a, b, t] = DNA[i];
        const near = Math.max(0, Math.cos(t * Math.PI * 0.5) * 0.35 + 0.65);
        const depth = (a.z + 1) / 2;
        const alpha = (0.12 + 0.42 * depth) * near * (1 - visual.disperse);

        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, `rgba(8, 170, 185, ${alpha})`);
        grad.addColorStop(0.5, `rgba(120, 145, 155, ${alpha * 0.8})`);
        grad.addColorStop(1, `rgba(195, 55, 70, ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineWidth = 0.85;
        ctx.strokeStyle = grad;
        ctx.stroke();
      }

      // Dual strands as long continuous ribbons (Strand 0 = Cyan/Slate, Strand 1 = Crimson)
      for (let s = 0; s < 2; s++) {
        for (let pass = 0; pass < 3; pass++) {
          ctx.beginPath();
          for (let i = 0; i < count; i++) {
            const p = DNA[i][s];
            const j = pass - 1;
            const x = p.x;
            const y = p.y + j * (1.8 + Math.abs(p.z) * 2.8);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          if (s === 0) {
            // Cyan / Slate strand
            ctx.strokeStyle =
              pass === 1
                ? `rgba(8, 165, 180, ${0.4 + 0.45 * visual.glow})`
                : `rgba(50, 120, 135, ${0.12 * visual.glow})`;
            ctx.lineWidth = pass === 1 ? 1.8 : 3.4;
          } else {
            // Crimson strand
            ctx.strokeStyle =
              pass === 1
                ? `rgba(195, 55, 70, ${0.4 + 0.45 * visual.glow})`
                : `rgba(215, 75, 90, ${0.12 * visual.glow})`;
            ctx.lineWidth = pass === 1 ? 1.8 : 3.4;
          }
          ctx.stroke();
        }
      }

      // Genomic data pixels (Base nodes)
      for (let i = 0; i < count; i += 2) {
        const [a, b, t] = DNA[i];
        for (let s = 0; s < 2; s++) {
          const p = s ? b : a;
          const z = Math.max(0, (p.z + 1) / 2);
          const fade = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(t), 2)), 0.4);
          const n = rnd(i * 19 + s * 7);
          const alpha = (0.22 + 0.75 * z) * fade * (0.4 + visual.glow * 0.6);
          const size = 1.2 + 2.8 * z;

          ctx.fillStyle = s === 0 ? `rgba(8, 160, 175, ${alpha})` : `rgba(195, 50, 65, ${alpha})`;
          ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);

          if (n > 0.88) {
            ctx.strokeStyle = s === 0 ? `rgba(8, 160, 175, ${alpha * 0.55})` : `rgba(195, 50, 65, ${alpha * 0.55})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - 7);
            ctx.lineTo(p.x, p.y + 7);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    // GSAP Timeline for progression
    let tl = gsap.timeline({ delay: 0.1 });

    const finish = () => {
      if (finished) return;
      finished = true;

      const endTl = gsap.timeline();
      endTl
        .to(visual, {
          spread: 0.02,
          speed: 2.5,
          disperse: 1,
          glow: 1.6,
          duration: 0.45,
          ease: 'power3.inOut'
        })
        .to(hudRef.current, {
          opacity: 0,
          scale: 0.98,
          duration: 0.2,
          ease: 'power2.in'
        }, '<+0.1')
        .to(wipeRef.current, {
          opacity: 0.95,
          duration: 0.08,
          ease: 'power2.in'
        }, '-=0.08')
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.1,
          ease: 'power2.out',
          onStart: () => {
            if (onComplete) onComplete();
          }
        }, '<');
    };

    // Store finish handler on container for Skip button
    if (containerRef.current) {
      containerRef.current.__finish = () => {
        if (tl) tl.kill();
        finish();
      };
    }

    const counterObj = { value: 0 };
    const stepDuration = 0.38;

    PHASE_LABELS.forEach((label, i) => {
      tl.call(() => {
        setPhaseIdx(i);
      });

      tl.to(counterObj, {
        value: (i + 1) * 25,
        duration: stepDuration,
        ease: 'power1.inOut',
        onUpdate: () => {
          setCount(Math.round(counterObj.value));
        }
      });

      tl.to(
        visual,
        {
          speed: 1.15 + i * 0.15,
          glow: 0.65 + i * 0.12,
          spread: 1 + i * 0.06,
          turn: (i + 1) * 0.2,
          duration: stepDuration,
          ease: 'sine.inOut'
        },
        '<'
      );

      tl.to({}, { duration: 0.03 });
    });

    tl.call(finish);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      if (tl) tl.kill();
      gsap.killTweensOf(visual);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (containerRef.current && containerRef.current.__finish) {
      containerRef.current.__finish();
    } else if (onComplete) {
      onComplete();
    }
  };

  const activePhase = PHASE_LABELS[phaseIdx] || PHASE_LABELS[0];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] overflow-hidden select-none"
      style={{
        background: 'radial-gradient(ellipse 80% 67% at 52% 48%, #ffffff 5%, #f2f8f9 62%, #e5eff1 100%)',
        color: '#081922'
      }}
    >
      {/* Horizontal DNA Canvas */}
      <canvas
        ref={canvasRef}
        aria-label="Animated horizontal DNA memory helix"
        className="absolute inset-0 w-full h-full block z-10 pointer-events-none"
      />

      {/* HUD Telemetry Frame */}
      <div ref={hudRef} className="absolute inset-0 z-30 flex flex-col justify-between p-6 md:p-10 pointer-events-none">
        {/* Top Header */}
        <header className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#5f7179]">
          <span className="flex items-center gap-2 font-display font-bold tracking-[0.16em] text-[#081922]">
            <span className="h-2 w-2 bg-[#08d1d8]" />
            <span>DecodeXtreme</span>
          </span>
          <span className="text-[#087e87]">20.0 / Loading</span>
        </header>

        {/* Center Loading Information */}
        <section className="self-center w-full max-w-lg px-4 text-center">
          {/* Status Tag */}
          <div className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[#087e87]">
            [ {activePhase.tag} ]
          </div>

          {/* Subtitle */}
          <div className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-[#4a5860]">
            Synchronizing signal
          </div>

          {/* Progress Percentage Display */}
          <div className="my-2 font-display text-7xl font-bold tracking-tight text-[#1c2c34] tabular-nums drop-shadow-[0_2px_12px_rgba(255,255,255,0.9)] md:my-4 md:text-9xl">
            {String(count).padStart(3, '0')}
            <span className="text-3xl md:text-4xl text-[#08d1d8] ml-1 font-semibold">%</span>
          </div>

          {/* Current Phase */}
          <div className="min-h-[20px] font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#34424a]">
            {activePhase.phase.split(' / ')[1]}
          </div>

          {/* Progress Bar */}
          <div className="mx-auto mt-5 h-1 w-64 max-w-full overflow-hidden bg-[#c7d0d3]">
            <div
              className="h-full bg-[#08d1d8] transition-all duration-75"
              style={{ width: `${count}%` }}
            />
          </div>
        </section>

        <footer className="flex items-center justify-center">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleSkip}
              className="pointer-events-auto flex cursor-pointer items-center gap-1.5 border border-[#8fa3a8] bg-white/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#475760] transition-all duration-200 hover:border-[#08d1d8] hover:bg-white hover:text-[#087e87]"
            >
              <span>SKIP INTRO</span>
              <span className="text-[#08d1d8]">↗</span>
            </button>
          </div>
        </footer>
      </div>

      {/* Animus Flash Wipe Overlay */}
      <div
        ref={wipeRef}
        className="absolute inset-0 bg-white pointer-events-none opacity-0 z-40 transition-opacity"
      />
    </div>
  );
};

export default Preloader;
