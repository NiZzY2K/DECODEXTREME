import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, ChevronDown, CheckCircle2, Clock, Laptop, BookOpen, AlertTriangle, Users } from 'lucide-react';

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
      className="section-dark relative w-full py-28 bg-transparent text-white overflow-hidden border-b border-white/10"
    >
      <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-25" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-[var(--color-primary)]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="content-rail relative z-10">
        
        {/* CodeSprint Signature Section Header */}
        <div className="section-header">
          <div className="section-label guide-header-anim">
            <span>DELEGATE PROTOCOLS // OPERATIONAL RULES</span>
          </div>

          <div className="section-heading-wrap guide-header-anim">
            <span className="section-heading-outline">DELEGATE GUIDE</span>
            <span className="section-heading-italic">Rules &amp; Readiness</span>
          </div>

          <p className="section-subtext guide-header-anim">
            ESSENTIAL REQUIREMENTS FOR SLTC PREXTREME CHALLENGE DELEGATES
          </p>
        </div>

        {/* Bento Grid: Event Day Protocol Quick Facts */}
        <div className="guide-bento-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="guide-card-anim animus-card p-6 hud-bracket flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white/5 text-[var(--color-primary)] shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <div className="text-[11px] font-mono text-[var(--color-primary)] uppercase">24 OCTOBER 2026</div>
              <h4 className="font-display font-bold text-lg text-white mt-0.5">8:00 AM Check-In</h4>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                Coding kicks off sharp at 9:00 AM and ends at 6:00 PM (9 continuous hours).
              </p>
            </div>
          </div>

          <div className="guide-card-anim animus-card p-6 hud-bracket flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white/5 text-[var(--color-primary)] shrink-0">
              <Laptop size={24} />
            </div>
            <div>
              <div className="text-[11px] font-mono text-[var(--color-primary)] uppercase">CONTEST ENVIRONMENT</div>
              <h4 className="font-display font-bold text-lg text-white mt-0.5">HackerRank Platform</h4>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                Fully online format. Ensure steady power backup and uninterrupted broadband connectivity.
              </p>
            </div>
          </div>

          <div className="guide-card-anim animus-card p-6 hud-bracket flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white/5 text-[var(--color-primary)] shrink-0">
              <Users size={24} />
            </div>
            <div>
              <div className="text-[11px] font-mono text-[var(--color-primary)] uppercase">MEMBERSHIP STATUS</div>
              <h4 className="font-display font-bold text-lg text-white mt-0.5">Zero Membership Barrier</h4>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                Participation in DecodeXtreme is 100% free. No prior IEEE membership is required.
              </p>
            </div>
          </div>
        </div>

        {/* Expandable Rules Accordion Matrix */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-xs font-mono uppercase text-gray-400 tracking-wider mb-2">
            // OFFICIAL CONTEST REGULATIONS
          </div>

          {ruleTopics.map((item, idx) => {
            const isOpen = openIndex === idx;
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="animus-card overflow-hidden transition-all duration-300 hud-bracket"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg border transition-colors ${
                      isOpen
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                        : 'border-white/10 bg-white/5 text-gray-400'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-bold text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className={`p-2 rounded-full text-gray-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-[var(--color-primary)]' : ''
                  }`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm text-gray-300 font-body leading-relaxed border-t border-white/5 bg-black/20">
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
