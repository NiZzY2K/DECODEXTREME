# DecodeXtreme 2026

A light-only React event site with an interactive GSAP timeline map and data-driven team directory.

## Run locally

Use Node.js 24, then `npm ci` and `npm run dev`. Validate with `npm run lint` and `npm run build`.

## Add registration links

Paste your two published Google Form links into `src/config/registration.js`:

```js
export const registrationUrls = {
  event: '',       // Event / online learning sessions Google Form
  hackathon: '',   // PreXtreme hackathon Google Form
};
```

The navigation Register button opens both registration choices. Selecting a learning session on the map shows the event form; selecting PreXtreme shows the hackathon form. Configured forms open in a new tab. Only HTTPS destinations are enabled. Empty links show a coming-soon state; the site never simulates a successful submission. Forms are hosted externally and are responsible for validation, consent and storing registrations.

Session dates, descriptions, times and the contact email are managed in `src/config/event.js`. Dates include Sri Lanka's UTC+05:30 offset. Completed sessions stop offering registration automatically.

## Populate the organising team

Edit `src/config/team.js`. Add departments and members using the existing structure:

```js
{
  id: 'technical-team',
  sectionName: 'Technical team',
  description: 'Building the experience.',
  sectionBody: {
    members: [
      {
        id: 'unique-person-id',
        name: 'Full Name',
        role: 'Team Lead',
        image: '/images/team/person.webp',
        linkedin: 'https://www.linkedin.com/in/profile/',
      },
    ],
  },
}
```

Place portraits in `public/images/team/`. Missing or broken portraits show initials. Department filters, search and member counts derive from the data. Empty data shows an intentional coming-soon state; no fictional people are published.

## Design

- Primary accent: `#08d1d8`, with darker teal for readable text.
- Light surfaces only, shared container width and section spacing in `src/index.css`; hero, editorial section, mobile navigation and registration styles in `src/styles/experience.css`. Team-specific line animation and directory styles live in `src/pages/Team.css`.
- Three fonts: Rajdhani headings, local Satoshi body, JetBrains Mono metadata. The two Google Fonts have local fallbacks.
- Existing supplied logo assets in navigation and footer.
- GSAP section reveals and hero transitions respect reduced-motion preferences. Body copy stays still for readability. The team page uses subtle CSS linework instead of the home artwork.
- A short, skippable DNA helix preloader introduces the site, with a timeout to keep entry quick. The hero headline assembles letter by letter with cyan scan effects after it closes. Reduced-motion preferences keep both sequences still.
- The hero includes the organiser logos within the first screen, allowing natural overflow on very short displays. Content sections and the footer use quiet, opaque light surfaces. On mobile, the session selector replaces the detailed map.
- The supplied hero video plays muted without visible controls. It pauses offscreen and in background tabs; reduced-motion/data-saving preferences use a still image.
- The supplied background music attempts to start after the intro at low volume. When browser autoplay is blocked, an Enable sound button lets visitors start it. A persistent sound control pauses/resumes music; background tabs pause it automatically.
- Timeline is the single session directory; the duplicate ServicesSection is not rendered.

## Before publishing

Add the real registration URLs and team profiles. Confirm event dates, eligibility, scoring rules, certificate terms, the public contact email and prize details with the organisers. The repository's existing event information was retained; it has not been independently verified.

The existing workflow targets Vercel. `vercel.json` provides the `/team` deep-link fallback. Build output is `dist/`. No deployment has been made by this refinement.

Older unused section components remain in the repository for reference, but are not imported into the active application. Active home content is in `src/pages/Home.jsx`, with the map in `src/components/TimelineFullscreenMap.jsx`.

## Maintaining the refined interface

See src/config/README.md for the content map. The mobile navigation uses a native modal dialog for focus containment, Escape handling and background scroll locking. It closes at the desktop breakpoint. Registration opens after the navigation has restored focus. Team filters remain horizontally scrollable on narrow displays. Registration dialogs scroll within the viewport.
