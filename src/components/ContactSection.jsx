import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, ExternalLink, Shield, MessageCircle, MapPin, Radio, Users } from 'lucide-react';
import projectChair from '../assets/projectchair.jpeg';
import contact1 from '../assets/contact_1.png';
import contact2 from '../assets/contact_2.png';
import contact3 from '../assets/contact_3.png';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".team-header-anim", {
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

      gsap.from(".crew-card-anim", {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".crew-cards-grid",
          start: "top 80%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const operatives = [
    {
      id: "OPERATIVE-01",
      name: "Project Chairperson",
      role: "Lead Coordinator // DecodeXtreme",
      organization: "IEEE Student Branch of SLTC",
      status: "SYNCED // VERIFIED",
      image: projectChair,
      email: "chair.sltcieee@gmail.com",
      phone: "+94 77 100 2026"
    },
    {
      id: "OPERATIVE-02",
      name: "Computer Society Chapter Lead",
      role: "Technical Operations & Proctor Liaison",
      organization: "IEEE Computer Society SLTC",
      status: "ACTIVE // MONITORING",
      image: contact1,
      email: "cs.chapter.sltc@gmail.com",
      phone: "+94 71 200 2026"
    },
    {
      id: "OPERATIVE-03",
      name: "Delegate Affairs Head",
      role: "Participant Support & WhatsApp Desk",
      organization: "DecodeXtreme Secretariat",
      status: "STANDBY // HELPDESK",
      image: contact2,
      email: "delegates.decodextreme@sltc.edu.lk",
      phone: "+94 76 300 2026"
    },
    {
      id: "OPERATIVE-04",
      name: "IEEEXtreme 20.0 Ambassador",
      role: "Global Competition Ambassador",
      organization: "IEEE Region 10 (Asia-Pacific)",
      status: "AUTHORIZED // PROCTOR",
      image: contact3,
      email: "ambassador.ieeextreme@ieee.org",
      phone: "+94 70 400 2026"
    }
  ];

  return (
    <section
      id="operatives"
      ref={sectionRef}
      className="section-dark relative w-full py-28 bg-transparent text-white overflow-hidden border-b border-white/10"
    >
      <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-30" />
      <div className="absolute top-20 left-1/3 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="content-rail relative z-10">
        
        {/* CodeSprint Signature Section Header */}
        <div className="section-header">
          <div className="section-label team-header-anim">
            <span>COMMAND MATRIX // OPERATIVES &amp; LEGACY</span>
          </div>

          <div className="section-heading-wrap team-header-anim">
            <span className="section-heading-outline">OUR TEAM</span>
            <span className="section-heading-italic">Operatives &amp; Support</span>
          </div>

          <p className="section-subtext team-header-anim">
            IEEE STUDENT BRANCH OF SLTC · COMPUTER SOCIETY CHAPTER COMMAND
          </p>
        </div>

        {/* CodeSprint Style Crew Dossier Cards */}
        <div className="crew-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {operatives.map((op) => (
            <div
              key={op.id}
              className="crew-card-anim animus-card p-6 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300 hud-bracket"
            >
              <div>
                {/* Card Top: ID Tag + Status */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-primary)]">
                    {op.id}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{op.status}</span>
                  </div>
                </div>

                {/* Avatar with Circular Ring */}
                <div className="relative w-24 h-24 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)]/30 group-hover:border-[var(--color-primary)] group-hover:scale-105 transition-all duration-500 animate-spin-slow" />
                  <img
                    src={op.image}
                    alt={op.name}
                    className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 p-1"
                  />
                </div>

                {/* Name & Role */}
                <div className="text-center mb-4">
                  <h4 className="font-display font-bold text-lg text-white group-hover:text-[var(--color-primary)] transition-colors">
                    {op.name}
                  </h4>
                  <p className="font-mono text-xs text-[var(--color-primary)] mt-0.5">
                    {op.role}
                  </p>
                  <p className="text-gray-500 text-[11px] font-mono mt-1">
                    {op.organization}
                  </p>
                </div>
              </div>

              {/* Contact Telemetry Rows */}
              <div className="pt-4 border-t border-white/10 font-mono text-[11px] space-y-2">
                <a
                  href={`mailto:${op.email}`}
                  className="flex items-center justify-between text-gray-400 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Mail size={12} className="text-[var(--color-primary)]" /> EMAIL
                  </span>
                  <span className="truncate max-w-[130px]">{op.email}</span>
                </a>

                <a
                  href={`tel:${op.phone}`}
                  className="flex items-center justify-between text-gray-400 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Phone size={12} className="text-[var(--color-primary)]" /> WHATSAPP
                  </span>
                  <span>{op.phone}</span>
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* Delegate Support Desk Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-2xl bg-[#070b10] border border-white/10 hud-bracket">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] shrink-0">
              <MessageCircle size={22} />
            </div>
            <div>
              <h5 className="font-display font-bold text-white text-base">Delegate WhatsApp Hotline</h5>
              <p className="text-xs text-gray-400 mt-1">
                Real-time inquiry assistance for team formation, student ID verification, and Zoom audio test channels.
              </p>
              <div className="font-mono text-xs text-[var(--color-primary)] mt-2">
                +94 77 100 2026 // +94 71 200 2026
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] shrink-0">
              <Mail size={22} />
            </div>
            <div>
              <h5 className="font-display font-bold text-white text-base">Official Electronic Dispatch</h5>
              <p className="text-xs text-gray-400 mt-1">
                Send formal university sponsorship, proctor confirmation requests, or appeal inquiries directly to organizers.
              </p>
              <div className="font-mono text-xs text-[var(--color-primary)] mt-2">
                sltcieeesb@gmail.com
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <h5 className="font-display font-bold text-white text-base">Command Base</h5>
              <p className="text-xs text-gray-400 mt-1">
                SLTC Research University, Ingiriya Road, Padukka, Sri Lanka. Fully online competition execution.
              </p>
              <div className="font-mono text-xs text-gray-500 mt-2">
                COORDINATES: 06.8528° N, 80.1039° E
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
