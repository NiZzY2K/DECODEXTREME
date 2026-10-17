// Paste the two published Google Form URLs here. No other files need editing.
// Accepts https://forms.gle/... and https://docs.google.com/forms/... URLs.
export const registrationUrls = {
  event: '',       // General DecodeXtreme event / online sessions form
  hackathon: '',   // PreXtreme team hackathon form
};

export function getRegistrationUrl(type) {
  const key = type === 'team' ? 'hackathon' : type === 'individual' ? 'event' : type;
  const value = registrationUrls[key]?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}
