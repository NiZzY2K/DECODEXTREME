"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { assets, nav, navigationCopy, site, story } from "@/app/config";
import { usePageScrollLock } from "@/app/animation/usePageScrollLock";
import RegistrationDialog from "./RegistrationDialog";
import "./Navbar.css";

type NavItem = { label: string; anchor?: string; path?: string; available?: boolean };
type HeroProgressEvent = CustomEvent<{ progress: number }>;

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(false);
  const [glass, setGlass] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [notice, setNotice] = useState("");
  usePageScrollLock(menuOpen || registrationOpen);

  useEffect(() => {
    const hasHero = Boolean(document.querySelector("[data-hero-scene]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const initialScroll = () => {
      if (!hasHero || reducedMotion.matches) {
        setVisible(true);
        setGlass(window.scrollY > 24);
      }
    };
    const onProgress = (event: Event) => {
      const { progress } = (event as HeroProgressEvent).detail;
      setVisible(reducedMotion.matches || progress >= story.awaken.navRevealAt);
      setGlass(progress >= story.awaken.navGlassAt);
    };
    const openRegistration = () => {
      setMenuOpen(false);
      setRegistrationOpen(true);
    };
    initialScroll();
    window.addEventListener("hero-progress", onProgress);
    window.addEventListener("open-registration", openRegistration);
    window.addEventListener("scroll", initialScroll, { passive: true });
    reducedMotion.addEventListener("change", initialScroll);
    return () => {
      window.removeEventListener("hero-progress", onProgress);
      window.removeEventListener("open-registration", openRegistration);
      window.removeEventListener("scroll", initialScroll);
      reducedMotion.removeEventListener("change", initialScroll);
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    mobileMenuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      const items = Array.from(headerRef.current?.querySelectorAll<HTMLElement>(".nav-brand, .nav-actions button, .nav-mobile a") ?? [])
        .filter((item) => item.getClientRects().length > 0 && getComputedStyle(item).visibility !== "hidden" && !item.closest("[inert]"));
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const desktopQuery = window.matchMedia("(min-width: 801px)");
    const onResize = () => { if (desktopQuery.matches) setMenuOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktopQuery.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktopQuery.removeEventListener("change", onResize);
    };
  }, [menuOpen]);

  const goTo = (event: MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = item.anchor ? document.getElementById(item.anchor) : null;
    if (target || (item.path && item.available)) {
      setMenuOpen(false);
      return;
    }
    event.preventDefault();
    setMenuOpen(false);
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    setNotice(`${item.label} — ${navigationCopy.unavailableLabel}`);
    noticeTimerRef.current = setTimeout(() => setNotice(""), 5500);
    if (window.matchMedia("(max-width: 800px)").matches) menuButtonRef.current?.focus();
  };

  const openRegistration = () => {
    setMenuOpen(false);
    setRegistrationOpen(true);
  };

  return (
    <>
      <header ref={headerRef} className={`site-header${visible || menuOpen ? " is-visible" : ""}${glass || menuOpen ? " is-glass" : ""}${menuOpen ? " is-menu-open" : ""}`} data-lenis-prevent={menuOpen ? "" : undefined} inert={!visible && !menuOpen} onClick={(event) => { if (event.target === event.currentTarget) setMenuOpen(false); }}>
        <div className="nav-inner">
          <a className="nav-brand" href="/" aria-label={navigationCopy.homeLabel} onClick={() => setMenuOpen(false)}>
            {/* The supplied wordmark is already optimized; preserve its original artwork. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assets.brand.logo} width="3840" height="1188" alt={site.name} />
          </a>
          <nav className="nav-desktop" aria-label={navigationCopy.label}>
            <ul className="nav-links">
              {(nav as readonly NavItem[]).map((item) => (
                <li key={item.label}>
                  <a href={item.path ?? `/#${item.anchor}`} onClick={(event) => goTo(event, item)}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav-actions">
            <button className="nav-register" type="button" onClick={openRegistration}>
              <span>{navigationCopy.register}</span>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 16 16 4M4 4h12v12" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
            <button ref={menuButtonRef} className={`nav-menu-toggle${menuOpen ? " is-open" : ""}`} type="button" aria-label={menuOpen ? navigationCopy.closeMenu : navigationCopy.openMenu} aria-controls="mobile-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
              <span /><span />
            </button>
          </div>
        </div>
        <nav ref={mobileMenuRef} id="mobile-navigation" className="nav-mobile" aria-label={navigationCopy.label} hidden={!menuOpen} data-scroll-lock-scrollable onClick={(event) => { if (event.target === event.currentTarget) setMenuOpen(false); }}>
          {(nav as readonly NavItem[]).map((item, index) => (
            <a key={item.label} href={item.path ?? `/#${item.anchor}`} onClick={(event) => goTo(event, item)}>
              <span className="nav-mobile-number">{String(index + 1).padStart(2, "0")}</span><span>{item.label}</span>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.2" /></svg>
            </a>
          ))}
        </nav>
      </header>
      <div className={`nav-notice${notice ? " is-visible" : ""}`} role="status" aria-live="polite"><span className="nav-notice-dot" aria-hidden="true" />{notice}</div>
      <RegistrationDialog open={registrationOpen} onClose={() => setRegistrationOpen(false)} />
    </>
  );
}




