import { useLayoutEffect, useRef } from 'react';
import '../styles/home-atmosphere.css';

/** A light geometric field, bounded by the About section and home footer. */
export default function HomeAtmosphere() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const element = root.current;
    const shell = element.parentElement;
    const hero = shell.querySelector('.hero');
    const about = shell.querySelector('#about');
    if (!hero || !about) return;
    const placeBelowHero = () => {
      const top = about.getBoundingClientRect().top - shell.getBoundingClientRect().top;
      element.style.top = `${top}px`;
    };
    placeBelowHero();
    const resize = new ResizeObserver(placeBelowHero);
    resize.observe(hero);
    resize.observe(shell.querySelector('.site-header'));
    const field = element.querySelector('.home-atmosphere__field');
    let visible = false;
    const updatePlayback = () => { element.dataset.paused = String(!visible || document.hidden); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updatePlayback(); });
    observer.observe(field);
    document.addEventListener('visibilitychange', updatePlayback);
    return () => {
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener('visibilitychange', updatePlayback);
    };
  }, []);

  return (
    <div ref={root} className="home-atmosphere" aria-hidden="true" data-paused="true">
      <div className="home-atmosphere__field">
        <div className="home-atmosphere__haze" />
        <svg className="home-atmosphere__mesh" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
          <defs>
            <pattern id="memory-mesh" width="240" height="208" patternUnits="userSpaceOnUse">
              <path d="M0 208 120 0 240 208ZM0 0H240M0 104H240M0 0 240 208M240 0 0 208" />
            </pattern>
          </defs>
          <rect width="1440" height="900" fill="url(#memory-mesh)" />
          <g className="home-atmosphere__traces">
            <path d="M-100 700 260 492 620 700 980 76 1540 400" />
            <path d="M-100 160 260 368 620 160 980 784 1540 460" />
          </g>
          <g className="home-atmosphere__shards">
            <path d="M96 640 156 536 216 640Z" />
            <path d="M1180 140 1240 244 1300 140Z" />
            <path d="M1100 660 1130 608 1160 660Z" />
          </g>
        </svg>
        <div className="home-atmosphere__scan" />
      </div>
    </div>
  );
}
