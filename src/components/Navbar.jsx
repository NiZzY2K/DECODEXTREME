import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../config/navigations';
import logo from '../assets/DecodeXtreme Logo.webp';
export default function Navbar({ onOpenRegister }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (event) => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return <header className="site-header"><div className="container nav-inner">
    <Link className="wordmark" to="/" onClick={() => setOpen(false)} aria-label="DecodeXtreme home"><img className="brand-logo" src={logo} alt="DecodeXtreme 2026" width="216" height="67" /></Link>
    <button ref={toggle} className="icon-button menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <nav id="site-navigation" aria-label="Main navigation" className={`nav-links ${open ? 'is-open' : ''}`}>
      {NAV_ITEMS.map(item => item.path ? <NavLink key={item.label} to={item.path} onClick={() => setOpen(false)}>{item.label}</NavLink> : <Link key={item.label} to={`/#${item.id}`} onClick={() => setOpen(false)}>{item.label}</Link>)}
      <button className="button button-small" onClick={() => { if (open && toggle.current?.getClientRects().length) toggle.current.focus(); setOpen(false); onOpenRegister(); }}>Register <ArrowUpRight size={15} /></button>
    </nav></div></header>;
}
