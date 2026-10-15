import { useEffect, useState } from 'react';
import { ChevronDown, Linkedin } from 'lucide-react';
import Footer from '../components/Footer';

/*
 * Add departments and members here. Portraits should live in Vite's public/
 * directory, for example: /images/team/member-name.webp.
 */
const sectionsAndInfo = [
  {
    id: 'ambassadors',
    sectionName: 'Ambassadors',
    sectionBody: {
      members: [
        // Add confirmed members using this shape:
        // {
        //   id: 'ambassador-01',
        //   name: 'Full Name',
        //   role: 'Lead Ambassador',
        //   image: '/images/team/ambassador-01.webp',
        //   linkedin: 'https://www.linkedin.com/in/profile-slug/',
        // },
      ],
    },
  },
  {
    id: 'technical-team',
    sectionName: 'Technical Team',
    sectionBody: {
      members: [],
    },
  },
  // Add additional teams with the same shape:
  // {
  //   id: 'media-team',
  //   sectionName: 'Media & Communications',
  //   sectionBody: { members: [] },
  // },
];

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function TeamMemberCard({ member, index, isVisible }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = typeof member.image === 'string' ? member.image.trim() : '';
  const linkedinUrl = typeof member.linkedin === 'string' ? member.linkedin.trim() : '';
  const hasImage = Boolean(imageSrc) && !imageFailed;

  return (
    <article
      className={`group flex h-full flex-col items-center px-3 py-3 text-center transition-[opacity,transform] duration-300 ease-[var(--ease-interface)] ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
      style={{ transitionDelay: isVisible ? `${Math.min(index, 8) * 45}ms` : '0ms' }}
    >
      <div className="mb-5 grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-solid)] p-1 shadow-[var(--glow-primary)] transition-transform duration-300 ease-[var(--ease-interface)] group-hover:scale-[1.04] sm:h-28 sm:w-28">
        {hasImage ? (
          <img
            src={imageSrc}
            alt={`${member.name || 'Team member'} portrait`}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <div
            className="grid h-full w-full place-items-center rounded-full bg-[var(--color-bg-elevated)] font-display text-2xl font-semibold tracking-tight text-[var(--color-primary)]"
            aria-label={`Portrait for ${member.name || 'team member'} not added yet`}
          >
            <span aria-hidden="true">{getInitials(member.name) || '?'}</span>
          </div>
        )}
      </div>

      <h3 className="max-w-full break-words font-display text-base font-bold leading-snug tracking-tight text-[var(--color-text)] sm:text-lg">
        {member.name || 'Name to be confirmed'}
      </h3>
      {member.role && (
        <p className="mt-1 max-w-full break-words text-sm leading-relaxed text-[var(--color-primary)] sm:text-base">
          {member.role}
        </p>
      )}

      {linkedinUrl && (
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${member.name || 'team member'}'s LinkedIn profile in a new tab`}
          className="mt-3 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[var(--color-text-muted)] transition-colors duration-200 hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          <Linkedin size={14} aria-hidden="true" />
          <span>LinkedIn</span>
        </a>
      )}
    </article>
  );
}

const Team = ({ onOpenRegister }) => {
  const [expandedSection, setExpandedSection] = useState(
    sectionsAndInfo[0]?.id ?? null,
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <>
      <main className="min-h-screen bg-[var(--color-bg)] px-5 pb-20 pt-28 text-[var(--color-text)] sm:px-8 sm:pt-32 lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          {/* Minimal introduction to keep attention on the people. */}
          <header className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
            <p className="mb-3 font-hud text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] sm:text-sm">
              DecodeXtreme 2026 · Organising Crew
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl md:text-6xl">
              Meet the team
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
              The people behind DecodeXtreme.
            </p>
          </header>

          <div className="mx-auto max-w-6xl" aria-label="Team departments">
            {sectionsAndInfo.map((section, sectionIndex) => {
              const isExpanded = expandedSection === section.id;
              const members = Array.isArray(section.sectionBody?.members)
                ? section.sectionBody.members
                : [];
              const panelId = `team-panel-${section.id}`;
              const triggerId = `team-trigger-${section.id}`;

              return (
                <section
                  key={section.id}
                  className="border-b border-[var(--color-border)] first:border-t"
                  aria-labelledby={triggerId}
                >
                  <h2>
                    <button
                      id={triggerId}
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      onClick={() =>
                        setExpandedSection((current) =>
                          current === section.id ? null : section.id,
                        )
                      }
                      className="group flex min-h-20 w-full items-center gap-4 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:min-h-24 sm:gap-6 sm:py-6"
                    >
                      <span className="w-7 shrink-0 font-mono text-xs text-[var(--color-text-dim)] sm:w-9 sm:text-sm">
                        {String(sectionIndex + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1 font-display text-xl font-semibold tracking-tight text-[var(--color-text)] transition-colors duration-200 group-hover:text-[var(--color-primary)] sm:text-2xl md:text-3xl">
                        {section.sectionName}
                      </span>
                      <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1 font-mono text-[10px] tabular-nums text-[var(--color-text-muted)] sm:text-xs">
                        {String(members.length).padStart(2, '0')}
                      </span>
                      <ChevronDown
                        size={20}
                        aria-hidden="true"
                        className={`shrink-0 text-[var(--color-primary)] transition-transform duration-300 ease-[var(--ease-interface)] ${
                          isExpanded ? 'rotate-180' : 'rotate-0'
                        }`}
                      />
                    </button>
                  </h2>

                  {/* Grid-row animation allows the panel to open and close without fixed heights. */}
                  <div
                    id={panelId}
                    aria-hidden={!isExpanded}
                    inert={!isExpanded}
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-interface)] ${
                      isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="pb-9 pt-2 sm:pb-12 sm:pt-4">
                        {members.length > 0 ? (
                          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
                            {members.map((member, memberIndex) => (
                              <TeamMemberCard
                                key={member.id ?? `${section.id}-${member.name ?? memberIndex}`}
                                member={member}
                                index={memberIndex}
                                isVisible={isExpanded}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="py-8 text-center text-sm text-[var(--color-text-muted)]">
                            Team profiles will be added soon.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

        </div>
      </main>

      <Footer onOpenRegister={onOpenRegister} />
    </>
  );
};

export default Team;
