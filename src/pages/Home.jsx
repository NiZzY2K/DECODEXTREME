import { createElement, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowDown,
    ArrowRight,
    ArrowUpRight,
    Code2,
    Users,
    Trophy,
    Plus,
    Minus,
    Mail,
} from "lucide-react";
import useReveal from "../hooks/useReveal";
import { event } from "../config/event";
import TimelineFullscreenMap from "../components/TimelineFullscreenMap";
import HeroBackdrop from "../components/HeroBackdrop";
import HeroHeadline from "../components/HeroHeadline";
import ScrambleText from "../components/ScrambleText";
import sbLogo from "../assets/sb-logo-color.webp";
import csLogo from "../assets/IEEE-CS_LogoTM-orange.webp";

const questions = [
    [
        "Who can join?",
        "The three online learning sessions are open to everyone. The PreXtreme challenge is for currently registered SLTC undergraduates, in teams of exactly three.",
    ],
    [
        "Do I need an IEEE membership?",
        "No. DecodeXtreme sessions and the PreXtreme challenge are free to enter, with no IEEE membership required.",
    ],
    [
        "What should I prepare?",
        "Bring a laptop, a reliable internet connection, and a working HackerRank account. The challenge supports C++, Java, and Python. Check-in starts at 8 AM on 24 October.",
    ],
    [
        "Can we use AI tools during the challenge?",
        "Submitted solutions must be the original work of your registered team. Generative AI tools and collaboration with other teams are not permitted during the contest.",
    ],
    [
        "How does scoring work?",
        "Scores depend on test cases passed, with cumulative penalty time used to resolve ties. The organising team will share final contest instructions before the challenge.",
    ],
];
const principles = [
    [
        Code2,
        "Build your foundation",
        "Turn programming concepts into confident problem solving.",
    ],
    [
        Users,
        "Find your rhythm",
        "Think together, share the workload, and develop a team strategy.",
    ],
    [
        Trophy,
        "Rise to the challenge",
        "Put your skills into practice in a nine-hour coding contest.",
    ],
];
function SectionBridge() {
    return (
        <div className="section-bridge" aria-hidden="true">
            <span />
            <i />
            <span />
        </div>
    );
}
function SectionHeading({ number, label, title, description, className = "" }) {
    return (
        <div className={`section-heading ${className}`} data-reveal>
            <p className="eyebrow">
                <span>{number}</span> / {label}
            </p>
            <h2>{title}</h2>
            {description && (
                <ScrambleText className="section-description">
                    {description}
                </ScrambleText>
            )}
        </div>
    );
}
export default function Home({ onOpenRegister }) {
    const root = useRef(null);
    const [openQuestion, setOpenQuestion] = useState(0);
    useReveal(root);
    return (
        <main id="main" ref={root} className="experience-page">
            <section
                className="hero hero-cinematic"
                aria-labelledby="hero-title"
                data-section
            >
                <div className="hero-screen">
                    <HeroBackdrop />
                    <div className="hero-grid-overlay" aria-hidden="true" />
                    <div className="container hero-grid">
                        <div className="hero-copy">
                            <HeroHeadline />
                            <ScrambleText className="hero-description">
                                Sharpen your skills. Assemble your team. Your
                                journey to IEEEXtreme starts here.
                            </ScrambleText>
                            <div className="hero-actions" data-reveal>
                                <button
                                    className="button"
                                    onClick={() => onOpenRegister()}
                                >
                                    Register now{" "}
                                    <ArrowUpRight size={18} />
                                </button>
                                <Link className="text-link" to="/#timeline">
                                    Explore map  <ArrowDown size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="container organizer-strip">
                        <p>Organised by</p>
                        <div>
                            <img
                                src={sbLogo}
                                alt="IEEE Student Branch of SLTC"
                                width="170"
                                height="58"
                            />
                            <img
                                src={csLogo}
                                alt="IEEE Computer Society"
                                width="170"
                                height="58"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="about"
                className="section about-scene"
                aria-labelledby="about-title"
                data-section
            >
                <SectionBridge />
                <div className="container about-grid">
                    <div
                        className="about-intro-card animus-glass-card"
                        data-reveal
                    >
                        <p className="eyebrow">
                            <span>01</span> / The creed
                        </p>
                        <h2 id="about-title">
                            Learn the craft.
                            <br />
                            <em>Master the challenge.</em>
                        </h2>
                        <ScrambleText className="section-description">
                            DecodeXtreme brings student coders together to
                            sharpen their skills and prepare for IEEEXtreme
                            20.0. A little guidance. A lot of practice. A team
                            to grow with.
                        </ScrambleText>
                        <Link className="text-link" to="/team">
                            Meet the people behind it <ArrowUpRight size={17} />
                        </Link>
                    </div>
                    <div className="principles">
                        {principles.map(([Icon, title, body], i) => (
                            <article
                                className="principle"
                                key={title}
                                data-reveal
                            >
                                <span className="line-icon">
                                    {createElement(Icon, {
                                        size: 22,
                                        strokeWidth: 1.5,
                                    })}
                                </span>
                                <div>
                                    <span className="small-label">
                                        PROTOCOL / 0{i + 1}
                                    </span>
                                    <h3>{title}</h3>
                                    <ScrambleText>{body}</ScrambleText>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
                <div className="container scene-caption" aria-hidden="true">
                    <span>THE SANCTUARY</span>
                    <span>KNOWLEDGE IS YOUR FIRST WEAPON.</span>
                    <span>01 / 05</span>
                </div>
            </section>

            <section
                id="timeline"
                className="section timeline-scene"
                data-section
            >
                <SectionBridge />
                <div className="container">
                    <SectionHeading
                        className="animus-glass-card"
                        number="02"
                        label="The mission map"
                        title={
                            <>
                                Your journey.
                                <br />
                                <em>Four checkpoints.</em>
                            </>
                        }
                        description="From your first session to the final submission. All times are Sri Lanka time (UTC+05:30)."
                    />
                    <div data-reveal>
                        <TimelineFullscreenMap
                            onOpenRegister={onOpenRegister}
                        />
                    </div>
                </div>
            </section>

            <section id="prizes" className="section rewards-scene" data-section>
                <SectionBridge />
                <div className="container prizes-layout">
                    <SectionHeading
                        className="animus-glass-card"
                        number="03"
                        label="Recognition"
                        title={
                            <>
                                Earn your
                                <br />
                                <em>place.</em>
                            </>
                        }
                        description="Recognition for the teams that rise to the challenge. Prize details will be announced by the organisers."
                    />
                    <div className="rewards-panel" data-reveal>
                        <div className="awards">
                            {[
                                "Champions",
                                "1st runners-up",
                                "2nd runners-up",
                            ].map((title, i) => (
                                <article className="award" key={title}>
                                    <span className="award-place">
                                        0{i + 1}
                                    </span>
                                    <h3>{title}</h3>
                                    <Trophy size={21} strokeWidth={1.5} />
                                </article>
                            ))}
                        </div>
                        <ScrambleText className="certificate-note">
                            Participation certificates for eligible delegates
                            who attend all three sessions and take part in
                            PreXtreme.
                        </ScrambleText>
                    </div>
                </div>
            </section>

            <section id="guide" className="section guide-scene" data-section>
                <SectionBridge />
                <div className="container guide-layout">
                    <SectionHeading
                        className="animus-glass-card"
                        number="04"
                        label="Before you join"
                        title={
                            <>
                                Know the
                                <br />
                                <em>rules.</em>
                            </>
                        }
                        description="The essentials, so you can focus on the code."
                    />
                    <div className="faq" data-reveal>
                        {questions.map(([question, answer], i) => (
                            <article
                                key={question}
                                className={`faq-item animus-glass-card ${openQuestion === i ? "is-active" : ""}`}
                            >
                                <h3>
                                    <button
                                        aria-expanded={openQuestion === i}
                                        aria-controls={`answer-${i}`}
                                        id={`question-${i}`}
                                        onClick={() =>
                                            setOpenQuestion(
                                                openQuestion === i ? -1 : i,
                                            )
                                        }
                                    >
                                        <span
                                            className="faq-number"
                                            aria-hidden="true"
                                        >
                                            0{i + 1}
                                        </span>
                                        <span>{question}</span>
                                        {openQuestion === i ? (
                                            <Minus size={18} />
                                        ) : (
                                            <Plus size={18} />
                                        )}
                                    </button>
                                </h3>
                                <div
                                    id={`answer-${i}`}
                                    role="region"
                                    aria-labelledby={`question-${i}`}
                                    hidden={openQuestion !== i}
                                >
                                    <p>{answer}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="contact"
                className="section contact-section contact-scene"
                data-section
            >
                <SectionBridge />
                <div
                    className="container contact-layout animus-glass-card"
                    data-reveal
                >
                    <div>
                        <p className="eyebrow">05 / The next chapter</p>
                        <h2>
                            Ready to
                            <br />
                            <em>enter?</em>
                        </h2>
                        <ScrambleText>
                            Have a question? The organising team is here to
                            help.
                        </ScrambleText>
                        <a className="text-link" href={`mailto:${event.email}`}>
                            <Mail size={18} />
                            {event.email}
                        </a>
                    </div>
                    <div className="contact-actions">
                        <button
                            className="button"
                            onClick={() => onOpenRegister()}
                        >
                            Join DecodeXtreme <ArrowUpRight size={18} />
                        </button>
                        <Link className="text-link" to="/team">
                            Meet our team <ArrowRight size={17} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
