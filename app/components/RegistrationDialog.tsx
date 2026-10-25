"use client";

import { useEffect, useRef } from "react";
import { registration } from "@/app/config";
import { usePageScrollLock } from "@/app/animation/usePageScrollLock";

type Props = { open: boolean; onClose: () => void };

export default function RegistrationDialog({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  usePageScrollLock(open);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [open]);

  return (
    <dialog data-scroll-lock-scrollable data-lenis-prevent ref={dialogRef} className="registration-dialog" aria-labelledby="registration-title" aria-describedby="registration-description" onCancel={onClose} onClose={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="registration-content">
        <button className="registration-close" type="button" onClick={onClose} aria-label={registration.closeLabel}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
        <p className="registration-eyebrow">{registration.eyebrow}</p>
        <h2 id="registration-title">{registration.heading}</h2>
        <p id="registration-description" className="registration-description">{registration.line}</p>
        <div className="registration-closed"><span className="registration-small-label">{registration.eventTitle}</span><p>{registration.closedNote}</p></div>
        <div className="registration-card">
          <span className="registration-small-label">{registration.hackathonAudience}</span>
          <h3>{registration.hackathonTitle}</h3><p>{registration.hackathonLine}</p>
          <a className="registration-cta" href={registration.url} target="_blank" rel="noopener noreferrer">
            {registration.cta}<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 16 16 4M4 4h12v12" stroke="currentColor" strokeWidth="1.5" /></svg>
          </a>
        </div>
        <a className="registration-help" href={registration.helpHref}>{registration.helpLabel}</a>
      </div>
    </dialog>
  );
}




