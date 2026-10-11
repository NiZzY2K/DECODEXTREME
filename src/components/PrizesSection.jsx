import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Award, Medal, ShieldAlert, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PrizesSection = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".prize-header-anim", {
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

      gsap.from(".prize-podium-card", {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".prize-grid-container",
          start: "top 80%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const podiums = [
    {
      place: "2ND PLACE",
      title: "1st Runners-Up",
      badge: "SILVER LAUREL",
      status: "Official Details Pending",
      icon: Medal,
      accent: "#94a3b8",
      glowColor: "rgba(148, 163, 184, 0.15)",
      order: "order-2 md:order-1",
      height: "h-auto md:h-[340px]"
    },
    {
      place: "CHAMPIONS",
      title: "PreXtreme Winner",
      badge: "GRAND LAUREL // GOLD",
      status: "Official Details Pending",
      icon: Trophy,
      accent: "var(--color-primary)",
      glowColor: "rgba(0, 242, 254, 0.25)",
      order: "order-1 md:order-2",
      height: "h-auto md:h-[380px]",
      featured: true
    },
    {
      place: "3RD PLACE",
      title: "2nd Runners-Up",
      badge: "BRONZE LAUREL",
      status: "Official Details Pending",
      icon: Award,
      accent: "#d97706",
      glowColor: "rgba(217, 119, 6, 0.15)",
      order: "order-3 md:order-3",
      height: "h-auto md:h-[320px]"
    }
  ];

  return (
    <section
      id="prizes"
      ref={sectionRef}
      className="section-dark relative w-full py-28 bg-transparent text-white overflow-hidden border-b border-white/10"
    >
      <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-primary)]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="content-rail relative z-10">
        
        {/* CodeSprint Signature Section Header */}
        <div className="section-header">
          <div className="section-label prize-header-anim">
            <span>HONORS &amp; RECOGNITION // THE SPOILS OF WAR</span>
          </div>

          <div className="section-heading-wrap prize-header-anim">
            <span className="section-heading-outline">RECOGNITION</span>
            <span className="section-heading-italic">Prizes &amp; Awards</span>
          </div>

          <p className="section-subtext prize-header-anim">
            COMPETITION MERIT · SLTC PREXTREME CHALLENGE RECOGNITION
          </p>
        </div>

        {/* Podium Grid */}
        <div className="prize-grid-container grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto mb-16">
          {podiums.map((podium) => {
            const Icon = podium.icon;
            return (
              <div
                key={podium.place}
                className={`prize-podium-card ${podium.order} ${podium.height} animus-card p-8 flex flex-col justify-between text-center relative group hud-bracket ${
                  podium.featured
                    ? 'border-[var(--color-primary)]/60 bg-gradient-to-b from-[var(--color-primary)]/10 via-white/[0.03] to-transparent shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.2)]'
                    : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                {/* Featured Badge */}
                {podium.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--color-primary)] text-black font-mono text-[10px] font-bold uppercase tracking-widest shadow-md">
                    CHAMPIONSHIP LAUREL
                  </div>
                )}

                <div>
                  {/* Icon Container */}
                  <div
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110"
                    style={{
                      borderColor: podium.accent,
                      backgroundColor: podium.glowColor,
                      color: podium.accent
                    }}
                  >
                    <Icon size={32} />
                  </div>

                  <span className="block font-mono text-xs tracking-[0.25em] uppercase text-gray-400 mb-2">
                    {podium.place}
                  </span>

                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    {podium.title}
                  </h3>

                  <div className="text-[11px] font-mono text-gray-500 uppercase">
                    {podium.badge}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 mt-6">
                  <div className="font-mono text-xs text-[var(--color-primary)] font-semibold">
                    {podium.status}
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 mt-1">
                    PreXtreme 2026 Finale
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Certificate & Transparency Callout */}
        <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="p-3 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] shrink-0">
            <Sparkles size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="font-display font-bold text-white text-base">Digital Certificates &amp; Verification</h4>
            <p className="text-xs text-gray-400 font-body leading-relaxed">
              Every eligible delegate who attends the three instructional sessions and participates in the PreXtreme challenge will receive an official verifiable Certificate of Participation issued by the IEEE Student Branch of SLTC.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PrizesSection;
