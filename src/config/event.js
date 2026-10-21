// All event dates use Sri Lanka time (UTC+05:30).
// Registration links are configured in registration.js.

export const event = { name: 'DecodeXtreme', year: 2026, email: 'sltcieeesb@gmail.com', ieeextremeUrl: 'https://ieeextreme.org/' };
export const sessions = [
  { id: 'awareness', number: '01', date: '12 Oct', start: '2026-10-12T20:00:00+05:30', end: '2026-10-12T22:00:00+05:30', title: 'Awareness session', description: 'Get to know IEEEXtreme, the contest format, and your preparation roadmap.', time: '8–10 PM', platform: 'Zoom', audience: 'Open to everyone', type: 'individual' },
  { id: 'fundamentals', number: '02', date: '14 Oct', start: '2026-10-14T20:00:00+05:30', end: '2026-10-14T22:00:00+05:30', title: 'Programming fundamentals', description: 'Build confidence with core algorithms, edge cases, and practical debugging.', time: '8–10 PM', platform: 'Zoom', audience: 'Open to everyone', type: 'individual' },
  { id: 'strategy', number: '03', date: '21 Oct', start: '2026-10-21T20:00:00+05:30', end: '2026-10-21T22:00:00+05:30', title: 'Advanced strategy', description: 'Learn to divide problems, work as a team, and make every minute count.', time: '8–10 PM', platform: 'Zoom', audience: 'Open to everyone', type: 'individual' },
  { id: 'prextreme', number: '04', date: '24 Oct', start: '2026-10-24T09:00:00+05:30', end: '2026-10-24T18:00:00+05:30', title: 'The PreXtreme challenge', description: 'Three teammates. Nine hours. Put your preparation to the test on a live leaderboard.', time: '9 AM–6 PM', platform: 'HackerRank', audience: 'SLTC teams of three', type: 'team' },
];
export function sessionStatus(session, now = Date.now()) {
  if (now > Date.parse(session.end)) return 'Completed';
  if (now >= Date.parse(session.start)) return 'In progress';
  return 'Upcoming';
}
