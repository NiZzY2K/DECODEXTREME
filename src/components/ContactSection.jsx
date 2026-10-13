import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react';
import projectChair from '../assets/projectchair.jpeg';
import contact1 from '../assets/contact_1.png';
import contact2 from '../assets/contact_2.png';
import contact3 from '../assets/contact_3.png';

gsap.registerPlugin(ScrollTrigger);

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const scrambleRuns = new WeakMap();

const scrambleText = (element, duration = 0.6) => {
  if (!element) return;
  const finalText = element.dataset.originalText || element.textContent;
  element.dataset.originalText = finalText;
  scrambleRuns.get(element)?.kill();
  const characters = [...finalText];
  const state = { progress: 0 };
  let frame = 0;
  const tween = gsap.to(state, {
    progress: 1, duration, ease: 'power2.out',
    onUpdate: () => {
      const cursor = Math.min(characters.length, Math.floor(state.progress * (characters.length + 2)));
      frame += 1;
      element.textContent = characters.map((c, i) => {
        if (!/[A-Za-z0-9]/.test(c)) return c;
        if (i < cursor || state.progress === 1) return c;
        if (i < cursor + 2) return SCRAMBLE_CHARS[(i * 7 + frame) % SCRAMBLE_CHARS.length];
        return c;
      }).join('');
    },
    onComplete: () => { element.textContent = finalText; },
  });
  scrambleRuns.set(element, tween);
};

const ContactSection = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.team-header-anim', {
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

      gsap.from('.crew-card-anim', {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.crew-cards-grid',
          start: 'top 80%',
        },
      });

      // Scramble operative IDs on scroll
      document.querySelectorAll('[data-contact-scramble]').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el.closest('.crew-card-anim') || el,
          start: 'top 85%',
          onEnter: () => scrambleText(el, 0.5 + i * 0.05),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const operatives = [
    {
      id: 'OPERATIVE-01',
      name: 'Project Chairperson',
      role: 'Lead Coordinator // DecodeXtreme',
      organization: 'IEEE Student Branch of SLTC',
      status: 'SYNCED // VERIFIED',
      image: projectChair,
      email: 'chair.sltcieee@gmail.com',
      phone: '+94 77 100 2026',
    },
    {
      id: 'OPERATIVE-02',
      name: 'Computer Society Chapter Lead',
      role: 'Technical Operations & Proctor Liaison',
      organization: 'IEEE Computer Society SLTC',
      status: 'ACTIVE // MONITORING',
      image: contact1,
      email: 'cs.chapter.sltc@gmail.com',
      phone: '+94 71 200 2026',
    },
    {
      id: 'OPERATIVE-03',
      name: 'Delegate Affairs Head',
      role: 'Participant Support & WhatsApp Desk',
      organization: 'DecodeXtreme Secretariat',
      status: 'STANDBY // HELPDESK',
      image: contact2,
      email: 'delegates.decodextreme@sltc.edu.lk',
      phone: '+94 76 300 2026',
    },
    {
      id: 'OPERATIVE-04',
      name: 'IEEEXtreme 20.0 Ambassador',
      role: 'Global Competition Ambassador',
      organization: 'IEEE Region 10 (Asia-Pacific)',
      status: 'AUTHORIZED // PROCTOR',
      image: contact3,
      email: 'ambassador.ieeextreme@ieee.org',
      phone: '+94 70 400 2026',
    },
  ];

  return (
    <section
      id="operatives"
      ref={sectionRef}
      className="relative w-full overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg)] py-24 sm:py-28"
    >
      {/* Background ambience */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[8%] h-64 w-64 rounded-full bg-[var(--color-primary)]/7 blur-[120px]" />
        <div className="absolute right-[8%] top-[12%] h-48 w-48 rounded-full bg-[var(--color-secondary)]/8 blur-[90px]" />
        <div className="absolute left-[40%] bottom-[10%] h-56 w-56 rounded-full bg-[var(--color-primary)]/5 blur-[100px]" />
      </div>
      <div className="bg-cyber-grid pointer-events-none absolute inset-0 opacity-[0.04]" />

      <div className="content-rail relative z-10">
        <div className="section-header">
          <div className="section-label team-header-anim">
            <span>Command matrix // operatives &amp; legacy</span>
          </div>

          <div className="section-heading-wrap team-header-anim">
            <span className="section-heading-outline">Our team</span>
            <span className="section-heading-italic">Operatives &amp; Support</span>
          </div>

          <p className="section-subtext team-header-anim">
            IEEE Student Branch of SLTC · Computer Society Chapter Command
          </p>
        </div>

        <div className="crew-cards-grid mb-16 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {operatives.map((op) => (
            <div
              key={op.id}
              className="crew-card-anim animus-card group flex flex-col justify-between p-6 transition-all duration-300 hud-bracket"
            >
              <div>
                <div className="mb-5 flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                  <span data-contact-scramble className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-primary)]">
                    {op.id}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="hidden sm:inline">{op.status.split(' // ')[0]}</span>
                  </div>
                </div>

                <div className="relative mx-auto mb-5 h-24 w-24">
                  <div className="absolute inset-0 rounded-full border-2 border-[rgba(var(--color-primary-rgb),0.3)] transition-all duration-500 group-hover:scale-105 group-hover:border-[rgba(var(--color-primary-rgb),0.7)] animate-[spin_12s_linear_infinite]" />
                  <img
                    src={op.image}
                    alt={op.name}
                    className="h-full w-full rounded-full object-cover p-1 grayscale transition-all duration-500 group-hover:grayscale-0"
                  />
                </div>

                <div className="mb-4 text-center">
                  <h4 className="font-display text-base font-bold text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)] sm:text-lg">
                    {op.name}
                  </h4>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-primary)]">
                    {op.role}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    {op.organization}
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t border-[var(--color-border)] pt-4 font-mono text-[11px] uppercase tracking-[0.12em]">
                <a
                  href={`mailto:${op.email}`}
                  className="flex items-center justify-between gap-3 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                >
                  <span className="flex items-center gap-1.5 text-[var(--color-primary)]">
                    <Mail size={12} /> EMAIL
                  </span>
                  <span className="max-w-[130px] truncate">{op.email}</span>
                </a>

                <a
                  href={`tel:${op.phone}`}
                  className="flex items-center justify-between gap-3 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                >
                  <span className="flex items-center gap-1.5 text-[var(--color-primary)]">
                    <Phone size={12} /> WHATSAPP
                  </span>
                  <span>{op.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Contact info grid */}
        <div className="grid grid-cols-1 gap-6 rounded-[1.25rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 backdrop-blur-sm sm:p-8 md:grid-cols-3">
          <div className="flex items-start gap-4">
            <div className="shrink-0 rounded-xl bg-[rgba(var(--color-primary-rgb),0.08)] p-3 text-[var(--color-primary)]">
              <MessageCircle size={22} />
            </div>
            <div>
              <h5 className="font-display text-base font-bold text-[var(--color-text)]">Delegate WhatsApp hotline</h5>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
                Real-time inquiry assistance for team formation, student ID verification, and Zoom audio test channels.
              </p>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-primary)]">
                +94 77 100 2026 // +94 71 200 2026
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="shrink-0 rounded-xl bg-[rgba(var(--color-primary-rgb),0.08)] p-3 text-[var(--color-primary)]">
              <Mail size={22} />
            </div>
            <div>
              <h5 className="font-display text-base font-bold text-[var(--color-text)]">Official electronic dispatch</h5>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
                Send formal university sponsorship, proctor confirmation requests, or appeal inquiries directly to organizers.
              </p>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-primary)]">
                sltcieeesb@gmail.com
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="shrink-0 rounded-xl bg-[rgba(var(--color-primary-rgb),0.08)] p-3 text-[var(--color-primary)]">
              <MapPin size={22} />
            </div>
            <div>
              <h5 className="font-display text-base font-bold text-[var(--color-text)]">Command base</h5>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
                SLTC Research University, Ingiriya Road, Padukka, Sri Lanka. Fully online competition execution.
              </p>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-dim)]">
                Coordinates: 06.8528° N, 80.1039° E
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
