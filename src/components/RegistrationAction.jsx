import { ArrowUpRight } from 'lucide-react';
import { getRegistrationUrl } from '../config/registration';

export default function RegistrationAction({ type, onUnavailable }) {
  const url = getRegistrationUrl(type);
  const label = type === 'team' ? 'Register for hackathon' : 'Register for event';
  if (url) return <a className="button" href={url} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRight size={17} /><span className="sr-only"> (Google Form opens in a new tab)</span></a>;
  return <button className="button" type="button" onClick={onUnavailable} disabled={!onUnavailable}>{onUnavailable ? label : 'Form link coming soon'}{onUnavailable && <ArrowUpRight size={17} />}</button>;
}
