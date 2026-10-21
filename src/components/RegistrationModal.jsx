import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Code2, Users, X } from 'lucide-react';
import gsap from 'gsap';
import { event } from '../config/event';
import { eventRegistrationEnded, getRegistrationUrl } from '../config/registration';
import ScrambleText from './ScrambleText';
import RegistrationAction from './RegistrationAction';

const options = [
  { type: 'individual', number: '01', title: 'The event', subtitle: 'Learn. Prepare. Level up.', description: 'Join the DecodeXtreme online learning sessions.', audience: 'Open to everyone · Free entry', icon: Code2 },
  { type: 'team', number: '02', title: 'The hackathon', subtitle: 'Your team. Nine hours.', description: 'Enter the PreXtreme team coding challenge.', audience: '3 SLTC undergraduates per team', icon: Users },
];
export default function RegistrationModal({ type = 'choose', onClose, animateDescriptions = false }) {
  const dialog = useRef(null);
  const [selection, setSelection] = useState(type);
  const visibleOptions = selection === 'choose' ? options : options.filter(option => option.type === selection);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => { gsap.fromTo(element, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .3, ease: 'power2.out', clearProps: 'transform,opacity' }); });
    return () => { media.revert(); element.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={dialog} className={`registration-dialog registration-chooser ${selection === 'choose' ? '' : 'registration-single'}`} aria-labelledby="registration-title" aria-describedby="registration-description" onCancel={onClose} onClick={e => { if (e.target === dialog.current) { const rect = dialog.current.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) onClose(); } }}>
    <button className="icon-button dialog-close" autoFocus onClick={onClose} aria-label="Close registration"><X size={21} /></button>
    <p className="eyebrow">DecodeXtreme 2026 / Registration</p>
    <h2 id="registration-title">{selection === 'choose' ? 'Your next challenge.' : selection === 'team' ? 'Enter the hackathon.' : eventRegistrationEnded ? 'Event registration has ended.' : 'Join the event.'}</h2>
    <ScrambleText enabled={animateDescriptions} id="registration-description">{eventRegistrationEnded && selection !== 'team' ? 'Event registration has ended. Take the next step with the PreXtreme hackathon.' : selection === 'choose' ? 'Choose your registration below.' : 'Continue to the official Google Form when registration is available.'}</ScrambleText>
    <div className="registration-options">{visibleOptions.map(option => {
      const Icon = option.icon;
      const available = Boolean(getRegistrationUrl(option.type));
      if (option.type === 'individual' && eventRegistrationEnded) {
        return (
          <article className="registration-option" key={option.type}>
            <div className="registration-option-top"><Icon size={24} strokeWidth={1.5} /><span>{option.number}</span></div>
            <p className="small-label">Registration closed</p>
            <h3>The event</h3>
            <ScrambleText enabled={animateDescriptions}>Event registration has ended. Continue your journey with the PreXtreme team coding challenge.</ScrambleText>
            <ScrambleText enabled={animateDescriptions} className="registration-audience">3 SLTC undergraduates per team</ScrambleText>
            <RegistrationAction type="team" onUnavailable={() => setSelection('team')} />
          </article>
        );
      }
      return <article className="registration-option" key={option.type}><div className="registration-option-top"><Icon size={24} strokeWidth={1.5} /><span>{option.number}</span></div><p className="small-label">{option.subtitle}</p><h3>{option.title}</h3><ScrambleText enabled={animateDescriptions}>{option.description}</ScrambleText><ScrambleText enabled={animateDescriptions} className="registration-audience">{option.audience}</ScrambleText><RegistrationAction type={option.type} />{!available && <ScrambleText enabled={animateDescriptions} className="registration-pending">The organisers will share this form shortly.</ScrambleText>}</article>;
    })}</div>
    <div className="registration-footer">{selection !== 'choose' && <button className="text-link" onClick={() => setSelection('choose')}><ArrowLeft size={15} /> Both registration options</button>}<a className="text-link" href={`mailto:${event.email}?subject=DecodeXtreme%20registration%20enquiry`}>Need help? Contact the organisers</a></div>
  </dialog>;
}

