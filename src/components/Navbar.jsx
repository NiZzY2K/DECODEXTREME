import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../config/navigations';
import logo from '../assets/DecodeXtreme Logo.webp';

export default function Navbar({ onOpenRegister }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const drawer = useRef(null);

  useEffect(() => {
    if (!open) return;
    const panel = drawer.current;
    const trigger = toggle.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.showModal();
    const desktop = window.matchMedia('(min-width: 801px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      panel.close();
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener('change', closeOnDesktop);
      trigger?.focus();
    };
  }, [open]);

  function register() {
    setOpen(false);
    // Let the drawer restore focus before the registration dialog captures it.
    requestAnimationFrame(onOpenRegister);
  }

  function navigationLinks() {
    return NAV_ITEMS.map(item => item.path ? (
      <NavLink key={item.label} to={item.path} onClick={() => setOpen(false)}>{item.label}</NavLink>
    ) : (
      <Link key={item.label} to={`/#${item.id}`} onClick={() => setOpen(false)}>{item.label}</Link>
    ));
  }

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Link className="wordmark" to="/" aria-label="DecodeXtreme home">
          <img className="brand-logo" src={logo} alt="DecodeXtreme 2026" width="216" height="67" />
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          {navigationLinks()}
          <button className="button button-small" onClick={onOpenRegister}>Register <ArrowUpRight size={16} /></button>
        </nav>
        <button ref={toggle} className="icon-button menu-toggle" aria-label="Open navigation" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}><Menu /></button>
      </div>
      <dialog ref={drawer} id="mobile-navigation" className="mobile-drawer" aria-label="Navigation" onCancel={() => setOpen(false)} onClick={e => { if (e.target === drawer.current && e.clientX < drawer.current.getBoundingClientRect().left) setOpen(false); }}>
        <div className="drawer-heading"><span className="eyebrow">DecodeXtreme / 2026</span><button className="icon-button" aria-label="Close navigation" onClick={() => setOpen(false)}><X /></button></div>
        <nav aria-label="Mobile navigation">{navigationLinks()}</nav>
        <div className="drawer-footer"><p>Your next challenge starts here.</p><button className="button" onClick={register}>Register <ArrowUpRight size={18} /></button></div>
      </dialog>
    </header>
  );
}
