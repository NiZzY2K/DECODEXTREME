import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { NAV_ITEMS } from '../config/navigations';
import logo from '../assets/DecodeXtreme Logo.webp';
export default function Footer({ onOpenRegister }) {
  return <footer className="site-footer"><div className="container"><div className="footer-top"><div><Link to="/" className="footer-brand"><img className="brand-logo" src={logo} alt="DecodeXtreme 2026" width="216" height="67" loading="lazy" /></Link><p>Think. Solve. Compete. Beyond.</p></div><nav aria-label="Footer navigation">{NAV_ITEMS.map(item => <Link key={item.label} to={item.path || `/#${item.id}`}>{item.label}</Link>)}<button onClick={onOpenRegister}>Register <ArrowUpRight size={14} /></button></nav></div><div className="footer-bottom"><p>© 2026 DecodeXtreme · IEEE Student Branch of SLTC</p><a href="https://ieeextreme.org/" target="_blank" rel="noreferrer">Discover IEEEXtreme <ArrowUpRight size={14} /></a><span>Made for the next generation.</span></div></div></footer>;
}
