import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Linkedin, Users, Search } from "lucide-react";
import { sectionsAndInfo } from "../config/team";
import './Team.css';
import useReveal from "../hooks/useReveal";


function MemberCard({ member }) {
    const [failed, setFailed] = useState(false);
    const initials = (member.name || "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join("");
    const profile = /^https:\/\/(www\.)?linkedin\.com\//i.test(
        member.linkedin || "",
    )
        ? member.linkedin
        : null;
    return (
        <article className="member-card">
            <div className="member-portrait">
                {member.image && !failed ? (
                    <img
                        src={member.image}
                        alt={`${member.name} portrait`}
                        width="360"
                        height="400"
                        loading="lazy"
                        decoding="async"
                        onError={() => setFailed(true)}
                    />
                ) : (
                    <span aria-label={`Portrait of ${member.name} unavailable`}>
                        {initials || "—"}
                    </span>
                )}
                {profile && (
                    <a
                        className="member-link"
                        href={profile}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} on LinkedIn (opens in new tab)`}
                    >
                        <Linkedin size={18} />
                    </a>
                )}
            </div>
            <h3>{member.name}</h3>
            <p>{member.role}</p>
        </article>
    );
}
export default function Team() {
    const root = useRef(null);
    const [active, setActive] = useState("all");
    const [query, setQuery] = useState("");
    useReveal(root);
    const groups = sectionsAndInfo.map((section) => ({
        ...section,
        members: (section.sectionBody?.members || []).filter(
            (member) => member.name,
        ),
    }));
    const count = groups.reduce(
        (total, group) => total + group.members.length,
        0,
    );
    const visible = groups
        .filter((group) => active === "all" || active === group.id)
        .map((group) => ({
            ...group,
            members: group.members.filter((member) =>
                `${member.name} ${member.role || ""}`
                    .toLowerCase()
                    .includes(query.trim().toLowerCase()),
            ),
        }));
    const hasResults = visible.some((group) => group.members.length);
    return (
        <main id="main" ref={root} className="team-page">
            <div className="team-scene" data-section><div className="team-linework" aria-hidden="true"><span /><span /><span /><span /></div>
                <header className="container page-intro" data-reveal>
                    <Link className="text-link back-link" to="/">
                        ← Back to the experience
                    </Link>
                    <p className="eyebrow">The people / DecodeXtreme 2026</p>
                    <h1>
                        The minds.
                        <br />
                        <em>Behind the mission.</em>
                    </h1>
                    <p className="section-description">
                        The organisers, builders, and ambassadors behind
                        DecodeXtreme. One crew. One shared mission.
                    </p>
                </header>
            </div>
            <div className="container team-directory">
                <div className="team-toolbar">
                    <div
                        className="team-filters"
                        role="group"
                        aria-label="Filter by department"
                    >
                        <button
                            className={active === "all" ? "is-active" : ""}
                            aria-pressed={active === "all"}
                            onClick={() => setActive("all")}
                        >
                            Everyone{count > 0 && <span>{count}</span>}
                        </button>
                        {groups.map((group) => (
                            <button
                                key={group.id}
                                className={
                                    active === group.id ? "is-active" : ""
                                }
                                aria-pressed={active === group.id}
                                onClick={() => setActive(group.id)}
                            >
                                {group.sectionName}
                            </button>
                        ))}
                    </div>
                    {count > 0 && (
                        <label className="team-search">
                            <Search size={17} />
                            <span className="sr-only">Search team members</span>
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Find a person"
                            />
                        </label>
                    )}
                </div>
                <div aria-live="polite" aria-atomic="true" className="sr-only">
                    {visible.reduce(
                        (total, group) => total + group.members.length,
                        0,
                    )}{" "}
                    team members shown
                </div>
                {hasResults ? (
                    visible
                        .filter((group) => group.members.length)
                        .map((group) => (
                            <section
                                key={group.id}
                                className="team-group"
                                aria-labelledby={`group-${group.id}`}
                            >
                                <div className="team-group-heading">
                                    <h2 id={`group-${group.id}`}>
                                        {group.sectionName}
                                    </h2>
                                    <p>{group.description}</p>
                                </div>
                                <div className="member-grid">
                                    {group.members.map((member) => (
                                        <MemberCard
                                            key={member.id || member.name}
                                            member={member}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))
                ) : (
                    <div className="team-empty">
                        <span className="line-icon">
                            <Users size={28} strokeWidth={1.4} />
                        </span>
                        <p className="eyebrow">
                            {count ? "Keep exploring" : "Behind the experience"}
                        </p>
                        <h2>
                            {count
                                ? "No matching people yet."
                                : "Crew profiles incoming."}
                        </h2>
                        <p>
                            {count
                                ? "Try another name or choose a different department."
                                : "Our organising team profiles will be shared here soon."}
                        </p>
                        {count ? (
                            <button
                                className="text-link"
                                onClick={() => {
                                    setQuery("");
                                    setActive("all");
                                }}
                            >
                                Clear filters <ArrowUpRight size={17} />
                            </button>
                        ) : (
                            <Link className="text-link" to="/#contact">
                                Get in touch <ArrowUpRight size={17} />
                            </Link>
                        )}
                    </div>
                )}
                <aside className="team-note">
                    <p>
                        An initiative of the{" "}
                        <strong>IEEE Student Branch of SLTC</strong>
                        <br />
                        and the Computer Society Student Chapter.
                    </p>
                    <Link className="text-link" to="/#timeline">
                        Explore the journey <ArrowUpRight size={17} />
                    </Link>
                </aside>
            </div>
        </main>
    );
}
