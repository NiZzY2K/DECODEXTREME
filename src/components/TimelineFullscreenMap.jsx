import { memo, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Clock, MapPin } from 'lucide-react';
import { sessions, sessionStatus } from '../config/event';
import './TimelineFullscreenMap.css';
import ScrambleText from './ScrambleText';
import RegistrationAction from './RegistrationAction';

const positions = [{ x: 21.5, y: 49 }, { x: 43.5, y: 33.7 }, { x: 65.7, y: 58.2 }, { x: 80.5, y: 45.2 }];
const districts = ['harbor', 'west', 'north', 'market', 'central', 'east', 'gardens', 'south', 'citadel'];
const Cartography = memo(function Cartography() {
  return <div className="animus-cartography" aria-hidden="true">{districts.map(district => <div key={district} className={`city-district city-district--${district}`}><div className="city-buildings">{Array.from({ length: 30 }, (_, i) => <span key={i} className="city-building" />)}</div></div>)}<div className="city-canal city-canal--grand" /><div className="city-canal city-canal--crossing" /><div className="city-map-label city-map-label--harbor">THE BEGINNING</div><div className="city-map-label city-map-label--citadel">THE CHALLENGE</div></div>;
});
export default function TimelineFullscreenMap({ onOpenRegister }) {
  const [active, setActive] = useState(() => Math.max(0, sessions.findIndex(item => Date.parse(item.end) > Date.now())));
  const [now, setNow] = useState(() => Date.now());
  const detail = useRef(null);
  const session = sessions[active];
  const status = sessionStatus(session, now);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(timer); }, []);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => gsap.from(detail.current, { y: 10, opacity: 0, duration: .35, ease: 'power2.out' }));
      return () => context.revert();
    });
    return () => media.revert();
  }, [active]);
  return <div className="journey-map">
    <div className="journey-stage"><div className="map-topline"><span>THE TRAINING GROUNDS</span><span>4 CHECKPOINTS / 1 JOURNEY</span></div><div className="journey-cartography"><Cartography /><svg className="journey-path" viewBox="0 0 1000 500" aria-hidden="true"><path d="M215 245 L435 168.5 L657 291 L805 226" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 8" /></svg>{positions.map((position, i) => <button key={sessions[i].id} className={`journey-pin ${active === i ? 'is-active' : ''}`} style={{ left: `${position.x}%`, top: `${position.y}%` }} onClick={() => setActive(i)} aria-label={`${sessions[i].date}: ${sessions[i].title}`} aria-pressed={active === i} aria-controls="journey-details"><span>{sessions[i].number}</span></button>)}</div><ScrambleText className="map-hint">Select a checkpoint to explore the session.</ScrambleText></div>
    <div className="journey-dossier" id="journey-details" aria-live="polite" aria-atomic="true"><div ref={detail}><p className="eyebrow">Checkpoint {session.number} <span className="journey-status">{status}</span></p><h3>{session.title}</h3><ScrambleText key={session.id} className="journey-description">{session.description}</ScrambleText><dl className="journey-facts"><div><dt>Date</dt><dd>{session.date} 2026</dd></div><div><dt><Clock size={14} /> Time</dt><dd>{session.time} SLT</dd></div><div><dt><MapPin size={14} /> Platform</dt><dd>{session.platform}</dd></div><div><dt>Who can join</dt><dd>{session.audience}</dd></div></dl>{session.type === 'team' && <p className="journey-checkin">Check-in at 8 AM · Free entry</p>}{status === 'Completed' ? <p className="session-complete"><Check size={16} /> This session has finished.</p> : <RegistrationAction type={session.type} onUnavailable={() => onOpenRegister(session.type)} />}</div><div className="journey-controls"><button className="icon-button" aria-label="Previous checkpoint" onClick={() => setActive((active + sessions.length - 1) % sessions.length)}><ArrowLeft size={18} /></button><span>{session.number} / 04</span><button className="icon-button" aria-label="Next checkpoint" onClick={() => setActive((active + 1) % sessions.length)}><ArrowRight size={18} /></button></div></div>
    <div className="journey-stops" role="group" aria-label="Journey checkpoints">{sessions.map((item, i) => <button key={item.id} className={active === i ? 'is-active' : ''} onClick={() => setActive(i)} aria-pressed={active === i} aria-controls="journey-details"><span className="small-label">{item.date}</span><span>{item.title}</span></button>)}</div>
  </div>;
}

