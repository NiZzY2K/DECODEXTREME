import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, ChevronDown, Clock, Laptop, BookOpen, AlertTriangle, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const GuidelinesSection = () => {
  const sectionRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".guide-header-anim", {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      gsap.from(".guide-card-anim", {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".guide-bento-grid",
          start: "top 80%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const ruleTopics = [
    {
      id: "eligibility",
      title: "01 / Eligibility & 3-Member Roster",
      summary: "Three currently registered SLTC undergraduate students per team.",
      content: "The PreXtreme challenge is strictly reserved for undergraduate students currently registered at SLTC Research University. Each team must consist of exactly three members. One designated team captain must submit all member contacts and student IDs during registration.",
      icon: Users
    },
    {
      id: "environment",
      title: "02 / Permitted Languages & Platform",
      summary: "HackerRank online contest engine supporting C++, Java, and Python.",
      content: "All problems will be hosted on HackerRank. Delegates are advised to verify their personal HackerRank accounts prior to contest day. Official documentation for languages (e.g. cppreference, docs.python.org, Oracle Java docs) is permitted. External communication or forums are strictly prohibited.",
      icon: Laptop
    },
    {
      id: "ai_policy",
      title: "03 / AI & Collaboration Integrity",
      summary: "Zero tolerance for automated code generators and team collusion.",
      content: "All submitted solutions must be the original work of the registered team members. The use of generative AI tools (such as ChatGPT, Copilot, Claude) to write or debug code during active contest hours is strictly forbidden and monitored via automated plagiarism analysis.",
      icon: AlertTriangle
    },
    {
      id: "scoring",
      title: "04 / Scoring & Tie-Break Logic",
      summary: "Test case score weighting with execution time penalties.",
      content: "Scores are determined by test cases successfully passed. In the event of a point tie, rankings will be resolved according to cumulative penalty time (time elapsed between contest start and each successful submission, including incorrect attempt penalty increments).",
      icon: BookOpen
    },
    {
      id: "incidents",
      title: "05 / Technical Incidents & Appeals",
      summary: "Direct delegate desk escalation and 30-minute review window.",
      content: "If a verified platform disruption occurs, the team captain must notify the delegate support desk immediately via the dedicated WhatsApp helpline. A formal 30-minute inquiry window will open after the leaderboard freeze for proctor review.",
      icon: Shield
    }
  ];

  return (
    <section
      id="guide"
      ref={sectionRef}
      className="section-dark relative w-full overflow-hidden border-b border-[var(--color-border)] py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(var(--color-primary-rgb),0.12),transparent_26rem)]" />

      <div className="content-rail relative z-10">
        <div className="section-header">
          <div className="section-label guide-header-anim">
            <span>Delegate protocols // operational rules</span>
          </div>

          <div className="section-heading-wrap guide-header-anim">
            <span className="section-heading-outline">Delegate guide</span>
            <span className="section-heading-italic">Rules &amp; Readiness</span>
          </div>

          <p className="section-subtext guide-header-anim">
            Essential requirements for SLTC PreXtreme challenge delegates
          </p>
        </div>

        <div className="guide-bento-grid mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="guide-card-anim animus-card flex items-start gap-4 p-6 hud-bracket">
            <div className="shrink-0 rounded-xl bg-[rgba(var(--color-primary-rgb),0.08)] p-3 text-[var(--color-primary)]">
              <Clock size={24} />
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)]">24 October 2026</div>
              <h4 className="mt-0.5 font-display text-lg font-bold text-[var(--color-text)]">8:00 AM check-in</h4>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
                Coding kicks off sharp at 9:00 AM and ends at 6:00 PM (9 continuous hours).
              </p>
            </div>
          </div>

          <div className="guide-card-anim animus-card flex items-start gap-4 p-6 hud-bracket">
            <div className="shrink-0 rounded-xl bg-[rgba(var(--color-primary-rgb),0.08)] p-3 text-[var(--color-primary)]">
              <Laptop size={24} />
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)]">Contest environment</div>
              <h4 className="mt-0.5 font-display text-lg font-bold text-[var(--color-text)]">HackerRank platform</h4>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
                Fully online format. Ensure steady power backup and uninterrupted broadband connectivity.
              </p>
            </div>
          </div>

          <div className="guide-card-anim animus-card flex items-start gap-4 p-6 hud-bracket">
            <div className="shrink-0 rounded-xl bg-[rgba(var(--color-primary-rgb),0.08)] p-3 text-[var(--color-primary)]">
              <Users size={24} />
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)]">Membership status</div>
              <h4 className="mt-0.5 font-display text-lg font-bold text-[var(--color-text)]">Zero membership barrier</h4>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
                Participation in DecodeXtreme is 100% free. No prior IEEE membership is required.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl space-y-4">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
            // official contest regulations
          </div>

          {ruleTopics.map((item, idx) => {
            const isOpen = openIndex === idx;
            const Icon = item.icon;
            return (
              <div key={item.id} className="animus-card overflow-hidden transition-all duration-300 hud-bracket">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-[rgba(255,255,255,0.14)]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`rounded-lg border p-2.5 transition-colors ${
                      isOpen
                        ? 'border-[var(--color-primary)] bg-[rgba(var(--color-primary-rgb),0.1)] text-[var(--color-primary)]'
                        : 'border-[var(--color-border)] bg-[rgba(255,255,255,0.26)] text-[var(--color-text-muted)]'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-bold text-[var(--color-text)]">
                        {item.title}
                      </h4>
                      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className={`rounded-full p-2 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'
                  }`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-[var(--color-border)] bg-[rgba(255,255,255,0.22)] px-6 pb-6 pt-4 font-body text-sm leading-relaxed text-[var(--color-text-muted)]">
                    <p>{item.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default GuidelinesSection;
