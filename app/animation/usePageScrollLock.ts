"use client";

import { useEffect } from "react";

const locks = new Set<symbol>();
let restorePage: (() => void) | undefined;

function notifyScrollLock(locked: boolean) {
  window.dispatchEvent(new CustomEvent("story-scroll-lock", { detail: { locked } }));
}

function isScrollableTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  const scroller = target.closest<HTMLElement>("[data-scroll-lock-scrollable]");
  return Boolean(scroller && scroller.scrollHeight > scroller.clientHeight);
}

function lockPage() {
  const html = document.documentElement;
  const body = document.body;
  const content = document.getElementById("main-content");
  const original = {
    htmlOverflow: html.style.overflow,
    bodyOverflow: body.style.overflow,
    htmlOverscroll: html.style.overscrollBehavior,
    bodyOverscroll: body.style.overscrollBehavior,
    bodyPadding: body.style.paddingRight,
    inert: content?.inert ?? false,
  };
  const scrollbar = window.innerWidth - html.clientWidth;
  const padding = parseFloat(getComputedStyle(body).paddingRight) || 0;

  html.dataset.pageScrollLocked = "true";
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
  html.style.overscrollBehavior = "none";
  body.style.overscrollBehavior = "none";
  if (scrollbar > 0) body.style.paddingRight = padding + scrollbar + "px";
  if (content) content.inert = true;
  notifyScrollLock(true);

  const preventBackgroundScroll = (event: Event) => {
    if (!isScrollableTarget(event.target)) event.preventDefault();
  };
  const preventKeyboardScroll = (event: KeyboardEvent) => {
    if (![" ", "Spacebar", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    const element = event.target;
    if (element instanceof HTMLElement && (element.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(element.tagName))) return;
    if ((event.key === " " || event.key === "Spacebar") && element instanceof Element && element.closest("button, [role=button]")) return;
    if (!isScrollableTarget(element)) event.preventDefault();
  };
  document.addEventListener("wheel", preventBackgroundScroll, { passive: false });
  document.addEventListener("touchmove", preventBackgroundScroll, { passive: false });
  document.addEventListener("keydown", preventKeyboardScroll);

  return () => {
    document.removeEventListener("wheel", preventBackgroundScroll);
    document.removeEventListener("touchmove", preventBackgroundScroll);
    document.removeEventListener("keydown", preventKeyboardScroll);
    html.style.overflow = original.htmlOverflow;
    body.style.overflow = original.bodyOverflow;
    html.style.overscrollBehavior = original.htmlOverscroll;
    body.style.overscrollBehavior = original.bodyOverscroll;
    body.style.paddingRight = original.bodyPadding;
    delete html.dataset.pageScrollLocked;
    if (content) content.inert = original.inert;
    notifyScrollLock(false);
  };
}

/** Shared by overlays so a menu-to-dialog handoff cannot unlock the page early. */
export function usePageScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const token = Symbol("page-scroll-lock");
    locks.add(token);
    if (locks.size === 1) restorePage = lockPage();
    return () => {
      locks.delete(token);
      if (!locks.size) {
        restorePage?.();
        restorePage = undefined;
      }
    };
  }, [active]);
}

