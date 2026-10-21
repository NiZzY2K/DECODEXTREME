// Paste the two published Google Form URLs here. No other files need editing.
// Accepts https://forms.gle/... and https://docs.google.com/forms/... URLs.
export const registrationUrls = {
  event: '',       // General DecodeXtreme event / online sessions form
  hackathon: 'https://iqoo.reskilll.com/',   // PreXtreme team hackathon form
};

// Set to false to reopen registration for the online learning sessions.
export const eventRegistrationEnded = true;

export function getRegistrationUrl(type) {
  const key = type === 'team' ? 'hackathon' : type === 'individual' ? 'event' : type;
  if (key === 'event' && eventRegistrationEnded) return null;
  const value = registrationUrls[key]?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}
  