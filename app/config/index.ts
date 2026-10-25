const media = "/media";

export const site = {
  name: "DecodeXtreme",
  year: "2026",
  title: "DecodeXtreme 2026 | Think. Solve. Compete.",
  description: "Your road to IEEEXtreme starts here. A programming journey by the IEEE Student Branch of SLTC and IEEE Computer Society.",
  skipLink: "Skip to content",
  organisers: [
    { name: "IEEE Student Branch of SLTC", image: "sltcSb" },
    { name: "IEEE Computer Society", image: "ieeeCs" },
  ],
} as const;

const frameUrl = (device: "desktop" | "mobile") => (index: number) =>
  `${media}/sequences/hero/${device}/f_${String(index + 1).padStart(4, "0")}.webp`;

export const assets = {
  brand: {
    logo: `${media}/images/brand/logo.webp`,
    sltcSb: `${media}/images/brand/sltc-sb-logo.webp`,
    ieeeCs: `${media}/images/brand/ieee-cs-logo.webp`,
  },
  awaken: {
    poster: `${media}/images/scenes/hero/first-frame.webp`,
    posterMobile: `${media}/images/scenes/hero/first-frame-m.webp`,
    video: `${media}/video/hero/hero-scrub.mp4`,
    sequence: {
      desktop: { count: 150, url: frameUrl("desktop"), cacheSize: 36 },
      mobile: { count: 120, url: frameUrl("mobile"), cacheSize: 24 },
    },
  },
} as const;

export const nav = [
  { label: "Creed", anchor: "creed" },
  { label: "Mission", anchor: "mission" },
  { label: "Codex", anchor: "codex" },
  { label: "Crew", path: "/teams" },
] as const;

export const navigationCopy = {
  label: "Main navigation",
  homeLabel: "DecodeXtreme home",
  register: "Register",
  openMenu: "Open navigation",
  closeMenu: "Close navigation",
  unavailableLabel: "This chapter is coming soon.",
} as const;

export const story = {
  mobileQuery: "(max-width: 800px)",
  reducedMotionQuery: "(prefers-reduced-motion: reduce)",
  smoothScroll: { lerp: 0.12, jumpDuration: 1.1 },
  awaken: {
    pin: "+=300%",
    mobilePin: "+=220%",
    scrub: 0.5,
    navRevealAt: 0.008,
    navGlassAt: 0.12,
    revealAt: 0.005,
    revealDuration: 0.095,
    revealStagger: 0.012,
    advanceTo: 0.12,
    organisersExitAt: 0.62,
    organisersExitDuration: 0.12,
    veilAt: 0.75,
    veilDuration: 0.18,
    veilOpacity: 0.86,
    headlineAt: [0.015, 0.095, 0.175],
    headlineDuration: 0.13,
    headlineExitAt: 0.41,
    headlineExitDuration: 0.22,
    ctaAt: 0.8,
    ctaDuration: 0.39,
    initialFrames: 24,
    idleBatch: 6,
  },
} as const;

export const awaken = {
  label: "01 / Awaken",
  eyebrow: "DecodeXtreme 2026 / IEEE SLTC",
  lines: ["Think.", "Solve.", "Compete."],
  tagline: "Your road to IEEEXtreme starts here.",
  organisedBy: "An initiative by",
  imageDescription: "A hooded recruit overlooking a futuristic city from a rooftop.",
  scrollLabel: "Scroll to awaken",
  progressLabel: "Awaken story progress",
  endEyebrow: "The city is waiting.",
  endHeading: "Make your next move.",
  primary: "Register now",
  secondary: "Explore the mission",
  replay: "Back to the beginning",
  missionUnavailable: "The mission chapter is coming soon.",
} as const;

export const registration = {
  eyebrow: "DecodeXtreme 2026 / Registration",
  heading: "Your next challenge.",
  line: "Think together. Take on the challenge.",
  closeLabel: "Close registration",
  closedNote: "Registration for the online learning sessions has ended.",
  eventTitle: "The event",
  hackathonTitle: "The PreXtreme challenge",
  hackathonLine: "Enter the team coding challenge.",
  hackathonAudience: "3 SLTC undergraduates per team",
  cta: "View registration",
  url: "https://iqoo.reskilll.com/",
  helpLabel: "Contact the organisers",
  helpHref: "mailto:sltcieeesb@gmail.com?subject=DecodeXtreme%20registration%20enquiry",
} as const;





