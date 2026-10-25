"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { assets, awaken, site, story } from "@/app/config";
import { createFrameSequence } from "@/app/animation/frameSequence";

export default function Awaken() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;

    media.add({
      mobile: story.mobileQuery,
      reduced: story.reducedMotionQuery,
      normal: "(prefers-reduced-motion: no-preference)",
    }, (scope) => {
      const { mobile, reduced } = scope.conditions!;
      const staticScene = reduced || connection?.saveData;
      root.dataset.static = String(!!staticScene);
      const emit = (progress: number) => {
        window.dispatchEvent(new CustomEvent("hero-progress", { detail: { progress } }));
      };
      if (staticScene) {
        gsap.set("[data-hero-reveal], [data-hero-word]", { opacity: 1, y: 0, clipPath: "none" });
        setCtaVisible(true);
        emit(1);
        return () => { delete root.dataset.static; };
      }

      const sequenceConfig = mobile ? assets.awaken.sequence.mobile : assets.awaken.sequence.desktop;
      const sequence = createFrameSequence({
        canvas,
        count: sequenceConfig.count,
        frameUrl: sequenceConfig.url,
        cacheSize: sequenceConfig.cacheSize,
        initialFrames: story.awaken.initialFrames,
        idleBatch: story.awaken.idleBatch,
        onReady() { canvas.dataset.ready = "true"; },
      });
      const playhead = { progress: 0 };
      const update = () => {
        const progress = playhead.progress;
        sequence.setProgress(progress);
        if (progressRef.current) progressRef.current.style.transform = "scaleX(" + progress + ")";
        if (counterRef.current) counterRef.current.textContent = String(Math.round(progress * 100)).padStart(3, "0");
        setCtaVisible(progress >= story.awaken.ctaAt);
        root.dataset.started = String(progress > story.awaken.navRevealAt);
        emit(progress);
      };
      gsap.set("[data-hero-reveal]", { opacity: 0, y: 18 });
      gsap.set("[data-hero-word]", { opacity: 0, yPercent: 105, clipPath: "inset(0 0 100% 0)" });
      const timeline = gsap.timeline({
        scrollTrigger: {
          id: "awaken",
          trigger: root,
          start: "top top",
          end: mobile ? story.awaken.mobilePin : story.awaken.pin,
          pin: true,
          scrub: story.awaken.scrub,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      timeline.to(playhead, { progress: 1, duration: 1, ease: "none", onUpdate: update }, 0);
      timeline.to("[data-hero-reveal]", { opacity: 1, y: 0, duration: story.awaken.revealDuration, stagger: story.awaken.revealStagger, ease: "power2.out" }, story.awaken.revealAt);
      story.awaken.headlineAt.forEach((at, index) => {
        timeline.to('[data-hero-word="' + index + '"]', {
          opacity: 1, yPercent: 0, clipPath: "inset(0 0 0% 0)",
          duration: story.awaken.headlineDuration, ease: "power2.out",
        }, at);
      });
      timeline.to("[data-hero-copy]", {
        opacity: 0, y: mobile ? -45 : -85,
        duration: story.awaken.headlineExitDuration, ease: "power1.in",
      }, story.awaken.headlineExitAt);
      timeline.to("[data-hero-organisers]", { opacity: 0, duration: story.awaken.organisersExitDuration }, story.awaken.organisersExitAt);
      timeline.to("[data-hero-veil]", { opacity: story.awaken.veilOpacity, duration: story.awaken.veilDuration }, story.awaken.veilAt);

      update();
      let active = true;
      const refresh = () => { if (active) ScrollTrigger.refresh(); };
      void document.fonts.ready.then(refresh);
      return () => {
        active = false;
        sequence.destroy();
        timeline.scrollTrigger?.kill();
        timeline.kill();
        delete canvas.dataset.ready;
      };
    }, root);
    return () => media.revert();
  }, []);

  const advance = () => {
    const trigger = ScrollTrigger.getById("awaken");
    if (trigger) window.dispatchEvent(new CustomEvent("story-scroll-to", { detail: { top: trigger.start + (trigger.end - trigger.start) * story.awaken.advanceTo } }));
  };
  const replay = () => window.dispatchEvent(new CustomEvent("story-scroll-to", { detail: { top: 0 } }));

  return (
    <section ref={rootRef} id="awaken" className="awaken" data-hero-scene="true" aria-label={awaken.eyebrow}>
      <picture className="hero-poster">
        <source media={story.mobileQuery} srcSet={assets.awaken.posterMobile} />
        {/* A native image makes the exact first frame visible before hydration. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assets.awaken.poster} alt={awaken.imageDescription} fetchPriority="high" />
      </picture>
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
      <div className="hero-wash" aria-hidden="true" />
      <div className="hero-end-veil" data-hero-veil aria-hidden="true" />


      <div className="hero-edge hero-edge--top" aria-hidden="true" />

      <div className="hero-copy" data-hero-copy>
        <p className="hero-eyebrow" data-hero-reveal><span className="signal-dot" />{awaken.eyebrow}</p>
        <h1 className="hero-headline" aria-label={awaken.lines.join(" ")}>
          {awaken.lines.map((line, index) => (
            <span className="hero-word-mask" key={line} aria-hidden="true">
              <span className="hero-word" data-hero-word={index}>{line}</span>
            </span>
          ))}
        </h1>
        <p className="hero-tagline" data-hero-reveal>{awaken.tagline}</p>
      </div>

      <div className="hero-organisers" data-hero-organisers>
        <p data-hero-reveal>{awaken.organisedBy}</p>
        <div className="hero-organiser-logos" data-hero-reveal>
          {site.organisers.map((organiser) => (
            <Image key={organiser.image} src={assets.brand[organiser.image]} width={organiser.image === "sltcSb" ? 174 : 112} height={44} alt={organiser.name} unoptimized />
          ))}
        </div>
      </div>

      <div className="hero-invitation-wrap">
        <motion.div
          className="hero-invitation"
          initial={false}
          animate={{ opacity: ctaVisible ? 1 : 0, y: ctaVisible ? 0 : 24 }}
          transition={{ duration: story.awaken.ctaDuration }}
          style={{ pointerEvents: ctaVisible ? "auto" : "none" }}
          aria-hidden={!ctaVisible}
          inert={!ctaVisible}
        >
          <p className="hero-eyebrow"><span className="signal-dot" />{awaken.endEyebrow}</p>
          <h2>{awaken.endHeading}</h2>
          <p>{awaken.tagline}</p>
          <div className="hero-actions">
            <button type="button" className="hero-button hero-button--primary" onClick={() => window.dispatchEvent(new Event("open-registration"))}>
              {awaken.primary}<Arrow />
            </button>
            <button type="button" className="hero-button hero-button--secondary" onClick={() => {
              const mission = document.getElementById("mission");
              if (mission) mission.scrollIntoView({ behavior: "smooth" });
              else setNotice(awaken.missionUnavailable);
            }}>{awaken.secondary}<Arrow diagonal /></button>
          </div>
          <p className="hero-notice" role="status">{notice}</p>
        </motion.div>
      </div>

      <div className="hero-bottom">
        <span className="hero-chapter">{awaken.label}</span>
        <button className="hero-scroll-cue" type="button" onClick={ctaVisible ? replay : advance}>
          <span>{ctaVisible ? awaken.replay : awaken.scrollLabel}</span>
          <span className={ctaVisible ? "scroll-icon scroll-icon--up" : "scroll-icon"} aria-hidden="true"><span /></span>
        </button>
        <div className="hero-counter" aria-hidden="true"><span ref={counterRef}>000</span><span>/ 100</span></div>
      </div>
      <div className="hero-progress-track" role="img" aria-label={awaken.progressLabel}><div ref={progressRef} /></div>
    </section>
  );
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" style={diagonal ? { transform: "rotate(-45deg)" } : undefined}><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}





