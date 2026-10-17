import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import logo from '../assets/DecodeXtreme Logo.webp';
import '../styles/dna-preloader.css';

const PHASES = ['Acquiring DNA signal', 'Aligning the strands', 'Decoding the sequence', 'Synchronization complete'];

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const hudRef = useRef(null);
  const wipeRef = useRef(null);
  const logoRef = useRef(null);
  const countRef = useRef(null);
  const phaseRef = useRef(null);
  const progressRef = useRef(null);
  const skipRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const logoImage = logoRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let ctx;
    try { ctx = canvas.getContext('2d'); } catch { /* The intro also works without canvas. */ }
    let disposed = false;
    let finished = false;
    let completed = false;
    let minimumElapsed = false;
    let resourcesReady = 0;
    let width = 0;
    let height = 0;
    let rotation = 0;
    let lastCount = -1;
    let lastFrame = -1;
    let minimumTimer;
    let maximumTimer;
    let sequence;
    let exitTimeline;
    let nodes = [];
    const visual = { spread: 1, glow: 0.65, disperse: 0, speed: 1, turn: 0 };
    const progress = { value: 0 };

    const renderProgress = () => {
      const nextCount = Math.round(progress.value);
      if (nextCount !== lastCount) {
        countRef.current.textContent = String(nextCount).padStart(3, '0');
        lastCount = nextCount;
      }
      progressRef.current.style.transform = `scaleX(${progress.value / 100})`;
    };

    // The original horizontal double helix: cyan/crimson strands, base pairs and data nodes.
    const draw = () => {
      if (!ctx || disposed) return;
      ctx.clearRect(0, 0, width, height);
      const amplitude = Math.min(125, Math.max(60, height * 0.16)) * visual.spread;
      const cycles = width > 768 ? 3 : 2;
      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        const phase = node.t * Math.PI * cycles + rotation + visual.turn;
        const depth = Math.cos(phase);
        const perspective = 0.68 + 0.16 * (depth + 1);
        node.x = width * 0.5 + node.t * width * 0.52;
        node.y = Math.sin(phase) * amplitude * perspective;
        node.z = depth;
      }
      for (let index = 1; index < nodes.length; index += 2) {
        const node = nodes[index];
        const depth = (node.z + 1) / 2;
        const alpha = (0.12 + 0.42 * depth) * node.fade * (1 - visual.disperse);
        const y1 = height * 0.5 + node.y;
        const y2 = height * 0.5 - node.y;
        const gradient = ctx.createLinearGradient(node.x, y1, node.x, y2);
        gradient.addColorStop(0, `rgba(8, 180, 190, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(120, 145, 155, ${alpha * 0.8})`);
        gradient.addColorStop(1, `rgba(195, 55, 70, ${alpha})`);
        ctx.beginPath();
        ctx.moveTo(node.x, y1);
        ctx.lineTo(node.x, y2);
        ctx.lineWidth = 0.85;
        ctx.strokeStyle = gradient;
        ctx.stroke();
      }
      for (let strand = 0; strand < 2; strand += 1) {
        const direction = strand === 0 ? 1 : -1;
        const color = strand === 0 ? '8, 180, 190' : '195, 55, 70';
        for (let pass = 0; pass < 3; pass += 1) {
          ctx.beginPath();
          nodes.forEach((node, index) => {
            const y = height * 0.5 + node.y * direction + (pass - 1) * (1.8 + Math.abs(node.z) * 2.8);
            if (index === 0) ctx.moveTo(node.x, y);
            else ctx.lineTo(node.x, y);
          });
          ctx.strokeStyle = `rgba(${color}, ${pass === 1 ? 0.4 + 0.4 * visual.glow : 0.12 * visual.glow})`;
          ctx.lineWidth = pass === 1 ? 1.8 : 3.4;
          ctx.stroke();
        }
        for (let index = 0; index < nodes.length; index += 2) {
          const node = nodes[index];
          const depth = Math.max(0, (node.z * direction + 1) / 2);
          const alpha = (0.22 + 0.75 * depth) * node.fade * (0.4 + visual.glow * 0.6);
          const size = 1.2 + 2.8 * depth;
          const y = height * 0.5 + node.y * direction;
          ctx.fillStyle = `rgba(${color}, ${alpha})`;
          ctx.fillRect(node.x - size / 2, y - size / 2, size, size);
          if (index % 14 === 0) {
            ctx.strokeStyle = `rgba(${color}, ${alpha * 0.55})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(node.x, y - 7);
            ctx.lineTo(node.x, y + 7);
            ctx.stroke();
          }
        }
      }
    };

    const resize = () => {
      if (!ctx || disposed) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(180, Math.max(80, Math.floor(width / 7)));
      nodes = Array.from({ length: count }, (_, index) => {
        const t = (index / (count - 1) - 0.5) * 2;
        return { t, x: 0, y: 0, z: 0, fade: Math.pow(Math.max(0, 1 - t * t), 0.4) };
      });
      draw();
    };

    const tick = (time, deltaTime) => {
      if (disposed || preference.matches || document.hidden) return;
      rotation += Math.min(deltaTime, 50) * 0.00055 * visual.speed;
      // Cap drawing at 60 fps without changing GSAP's shared ticker settings.
      if (time - lastFrame < 1 / 60) return;
      lastFrame = time;
      draw();
    };

    const complete = () => {
      if (disposed || completed) return;
      completed = true;
      gsap.ticker.remove(tick);
      onComplete?.();
    };

    const finish = () => {
      if (disposed || finished) return;
      finished = true;
      clearTimeout(minimumTimer);
      clearTimeout(maximumTimer);
      sequence?.kill();
      phaseRef.current.textContent = PHASES[3];
      if (preference.matches) {
        progress.value = 100;
        renderProgress();
        gsap.set(container, { opacity: 0 });
        complete();
        return;
      }
      exitTimeline = gsap.timeline({ onComplete: complete })
        .to(progress, { value: 100, duration: 0.15, onUpdate: renderProgress, ease: 'power2.out' }, 0)
        .to(visual, { spread: 0.015, disperse: 1, glow: 1.1, speed: 2, duration: 0.34, ease: 'power3.inOut' }, 0)
        .to(hudRef.current, { opacity: 0, y: -6, duration: 0.2, ease: 'power2.in' }, 0.12)
        .to(wipeRef.current, { opacity: 0.7, duration: 0.14, ease: 'power2.out' }, 0.24)
        .to(container, { opacity: 0, duration: 0.18, ease: 'power2.out' }, 0.3);
    };

    const settled = () => {
      if (disposed || finished) return;
      resourcesReady += 1;
      if (resourcesReady === 2 && minimumElapsed) finish();
    };

    const preferenceChanged = () => {
      if (!preference.matches || disposed) return;
      gsap.ticker.remove(tick);
      sequence?.kill();
      draw();
      if (finished) {
        exitTimeline?.kill();
        gsap.set(container, { opacity: 0 });
        complete();
      } else finish();
    };

    gsap.set(container, { opacity: 1 });
    gsap.set(hudRef.current, { opacity: 1, y: 0 });
    gsap.set(wipeRef.current, { opacity: 0 });
    phaseRef.current.textContent = PHASES[0];
    renderProgress();
    resize();
    skipRef.current = finish;
    window.addEventListener('resize', resize);
    preference.addEventListener('change', preferenceChanged);

    if (!preference.matches) {
      if (ctx) gsap.ticker.add(tick);
      sequence = gsap.timeline();
      [24, 52, 78, 94].forEach((value, index) => {
        sequence.call(() => { phaseRef.current.textContent = PHASES[Math.min(index, 2)]; });
        sequence.to(progress, { value, duration: 0.36, ease: 'power1.inOut', onUpdate: renderProgress });
        sequence.to(visual, { speed: 1 + index * 0.2, glow: 0.65 + index * 0.1, turn: (index + 1) * 0.15, duration: 0.36, ease: 'sine.inOut' }, '<');
      });
    }

    minimumTimer = setTimeout(() => {
      minimumElapsed = true;
      if (resourcesReady === 2) finish();
    }, preference.matches ? 450 : 1450);
    // Fonts, images or a failed canvas must never hold the visitor in the intro.
    maximumTimer = setTimeout(finish, preference.matches ? 650 : 1850);
    Promise.resolve(document.fonts?.ready).then(settled, settled);
    if (typeof logoImage.decode === 'function') logoImage.decode().then(settled, settled);
    else if (logoImage.complete) Promise.resolve().then(settled);
    else {
      logoImage.addEventListener('load', settled, { once: true });
      logoImage.addEventListener('error', settled, { once: true });
    }

    return () => {
      disposed = true;
      skipRef.current = null;
      clearTimeout(minimumTimer);
      clearTimeout(maximumTimer);
      sequence?.kill();
      exitTimeline?.kill();
      gsap.ticker.remove(tick);
      preference.removeEventListener('change', preferenceChanged);
      window.removeEventListener('resize', resize);
      logoImage.removeEventListener('load', settled);
      logoImage.removeEventListener('error', settled);
      ctx?.clearRect(0, 0, width, height);
    };
  }, [onComplete]);

  return <div ref={containerRef} className="dna-preloader" role="status" aria-label="Loading DecodeXtreme">
    <canvas ref={canvasRef} className="dna-preloader__canvas" aria-hidden="true" />
    <div ref={hudRef} className="dna-preloader__hud">
      <header className="dna-preloader__header" aria-hidden="true">
        <img ref={logoRef} src={logo} alt="" width="200" height="62" fetchPriority="high" />
        <span>DNA sequence / 2026</span>
      </header>
      <div className="dna-preloader__telemetry" aria-hidden="true">
        <p className="dna-preloader__eyebrow">Memory synchronization</p>
        <p className="dna-preloader__count"><span ref={countRef}>000</span><span className="dna-preloader__percent">%</span></p>
        <p ref={phaseRef} className="dna-preloader__phase">Acquiring DNA signal</p>
        <div className="dna-preloader__track"><span ref={progressRef} /></div>
      </div>
      <footer className="dna-preloader__footer">
        <span aria-hidden="true">Think. Solve. Compete.</span>
        <button type="button" className="dna-preloader__skip" onClick={() => skipRef.current?.()}>Skip intro <span aria-hidden="true">↗</span></button>
        <span aria-hidden="true">DecodeXtreme 2026</span>
      </footer>
    </div>
    <div ref={wipeRef} className="dna-preloader__wipe" aria-hidden="true" />
  </div>;
}
