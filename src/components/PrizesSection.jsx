import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Award, Medal, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PrizesSection = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.prize-header-anim', {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      gsap.from('.prize-podium-card', {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.prize-grid-container',
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const podiums = [
    {
      place: '2ND PLACE',
      title: '1st Runners-Up',
      badge: 'SILVER LAUREL',
      status: 'Official Details Pending',
      icon: Medal,
      accent: '#94a3b8',
      glowColor: 'rgba(148, 163, 184, 0.15)',
      order: 'order-2 md:order-1',
      height: 'h-auto md:h-[340px]',
    },
    {
      place: 'CHAMPIONS',
      title: 'PreXtreme Winner',
      badge: 'GRAND LAUREL // GOLD',
      status: 'Official Details Pending',
      icon: Trophy,
      accent: 'var(--color-primary)',
      glowColor: 'rgba(8, 126, 135, 0.12)',
      order: 'order-1 md:order-2',
      height: 'h-auto md:h-[380px]',
      featured: true,
    },
    {
      place: '3RD PLACE',
      title: '2nd Runners-Up',
      badge: 'BRONZE LAUREL',
      status: 'Official Details Pending',
      icon: Award,
      accent: '#d97706',
      glowColor: 'rgba(217, 119, 6, 0.12)',
      order: 'order-3 md:order-3',
      height: 'h-auto md:h-[320px]',
    },
  ];

  return (
    <section
      id="prizes"
      ref={sectionRef}
      className="section-dark relative w-full overflow-hidden border-b border-[var(--color-border)] py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(var(--color-primary-rgb),0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.2),transparent)]" />
      <div className="content-rail relative z-10">
        <div className="section-header">
          <div className="section-label prize-header-anim">
            <span>Honors &amp; recognition // the spoils of war</span>
          </div>

          <div className="section-heading-wrap prize-header-anim">
            <span className="section-heading-outline">Recognition</span>
            <span className="section-heading-italic">Prizes &amp; Awards</span>
          </div>

          <p className="section-subtext prize-header-anim">
            Competition merit · SLTC PreXtreme challenge recognition
          </p>
        </div>

        <div className="prize-grid-container mx-auto mb-16 grid max-w-5xl grid-cols-1 items-end gap-6 md:grid-cols-3">
          {podiums.map((podium) => {
            const Icon = podium.icon;
            return (
              <div
                key={podium.place}
                className={`prize-podium-card ${podium.order} ${podium.height} animus-card group relative flex flex-col justify-between p-8 text-center hud-bracket ${
                  podium.featured
                    ? 'border-[var(--color-primary)]/60 bg-gradient-to-b from-[rgba(var(--color-primary-rgb),0.12)] via-[rgba(255,255,255,0.75)] to-transparent shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.12)]'
                    : 'border-[var(--color-border)] bg-[rgba(255,255,255,0.38)]'
                }`}
              >
                {podium.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-primary)] px-4 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#06292c] shadow-md">
                    Championship laurels
                  </div>
                )}

                <div>
                  <div
                    className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110"
                    style={{
                      borderColor: podium.accent,
                      backgroundColor: podium.glowColor,
                      color: podium.accent,
                    }}
                  >
                    <Icon size={32} />
                  </div>

                  <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
                    {podium.place}
                  </span>

                  <h3 className="mb-2 font-display text-2xl font-bold text-[var(--color-text)]">
                    {podium.title}
                  </h3>

                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    {podium.badge}
                  </div>
                </div>

                <div className="mt-6 border-t border-[var(--color-border)] pt-6">
                  <div className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                    {podium.status}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    PreXtreme 2026 Finale
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-[1.25rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.4)] p-6 text-center sm:flex-row sm:text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(var(--color-primary-rgb),0.1)] text-[var(--color-primary)]">
            <Sparkles size={22} />
          </div>
          <div className="space-y-1">
            <h4 className="font-display text-base font-bold text-[var(--color-text)]">Digital certificates &amp; verification</h4>
            <p className="font-body text-xs leading-relaxed text-[var(--color-text-muted)]">
              Every eligible delegate who attends the three instructional sessions and participates in the PreXtreme challenge will receive an official verifiable Certificate of Participation issued by the IEEE Student Branch of SLTC.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrizesSection;
