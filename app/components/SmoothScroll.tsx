"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { story } from "@/app/config";

export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = window.matchMedia(story.reducedMotionQuery);
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let lenis: Lenis | undefined;
    const tick = (seconds: number) => lenis?.raf(seconds * 1000);
    const setup = () => {
      lenis?.destroy();
      lenis = undefined;
      gsap.ticker.remove(tick);
      if (media.matches || connection?.saveData) return;
      lenis = new Lenis({ lerp: story.smoothScroll.lerp, smoothWheel: true, syncTouch: false, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      if (document.documentElement.dataset.pageScrollLocked === "true") lenis.stop();
    };
    const scrollTo = (event: Event) => {
      const { top } = (event as CustomEvent<{ top: number }>).detail;
      if (document.documentElement.dataset.pageScrollLocked === "true") return;
      if (lenis) lenis.scrollTo(top, { duration: story.smoothScroll.jumpDuration });
      else window.scrollTo({ top, behavior: media.matches ? "instant" : "smooth" });
    };
    const scrollLock = (event: Event) => {
      const { locked } = (event as CustomEvent<{ locked: boolean }>).detail;
      if (locked) lenis?.stop();
      else lenis?.start();
    };
    setup();
    window.addEventListener("story-scroll-lock", scrollLock);
    window.addEventListener("story-scroll-to", scrollTo);
    media.addEventListener("change", setup);
    return () => {
      window.removeEventListener("story-scroll-to", scrollTo);
      window.removeEventListener("story-scroll-lock", scrollLock);
      media.removeEventListener("change", setup);
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);
  return null;
}


