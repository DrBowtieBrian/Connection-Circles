export const starterKit = {
  page1: `What is a Circle?

Purpose: practice service, sharpen character, and ship impact together.
Roles: Host (time & tone), Scribe (commitments), Spotlight (rotates).
Rhythm: Weekly CircleUp! 20 (public) → Small Circles (private, 60m).
Norms: Confidentiality, consent, curiosity, time-box respect.

Principle: Serve > Sell • Circles > Funnels • Say = Do.`,
  page2: `Agenda + Prompts

CIRCLEUP! 20 (public):
- Hook (1) • Lesson (5) • Guided Practice (10) • Invite (4)

Compass 5-Pack:
1) Smallest TRUE action I can take this week?
2) Where is my Say=Do gap showing?
3) Which boundary needs strengthening (role/right/responsibility)?
4) Who will notice if I ship this?
5) What support do I need from the Circle?`,
  page3: `Invites & Next Steps

DM Template:
“Hey [Name]—piloting a 20-min CircleUp! (Thu 12:15 PT): 5-min lesson, 10-min practice, 5-min invite to a small Circle. Want the link?”

Comment CTA:
“Want the 20-min agenda + prompts? Comment CIRCLE and I’ll DM it.”

Next Steps: Join this week’s Live • Request seat in a small Circle • Log your commitment.`,
}

export type Person = {
  name: string
  url: string
  role: string
  city: string
  rsvp?: boolean
  attendedLive?: boolean
  attendedCircle?: boolean
  commitment?: string
  due?: string
  kept?: boolean
}

export const initialPeople: Person[] = [
  { name: 'Ava Patel', url: 'https://linkedin.com/in/ava', role: 'Founder', city: 'LA', rsvp: true, attendedLive: true, attendedCircle: false, commitment: 'Draft Respect Map', due: '2025-09-19', kept: false },
  { name: 'Miguel Santos', url: 'https://linkedin.com/in/miguel', role: 'Team Lead', city: 'SD', rsvp: true, attendedLive: true, attendedCircle: true, commitment: 'Host one CircleUp! 20', due: '2025-09-26', kept: true },
]

export const initialContentStats = [
  { week: 'W1', lives: 1, shorts: 2, rsvps: 18, circleComments: 32, seats: 8 },
  { week: 'W2', lives: 1, shorts: 3, rsvps: 24, circleComments: 41, seats: 10 },
  { week: 'W3', lives: 1, shorts: 2, rsvps: 21, circleComments: 37, seats: 9 },
]

export const runOfShow = `CIRCLEUP! 20 (Public)
00:00 Hook (≤45s): name the real problem.
02:00 Micro-Lesson (≤5m): Center Skill or Compass move.
07:00 Guided Practice (10m): one prompt; capture a commitment.
17:00 Invitation (3m): comment/DM CIRCLE for Starter Kit + small group.`

export const dmPreLive = `Hey [Name]—I’m piloting a 20‑min CircleUp! this Thu 12:15 PT: 5‑min lesson, 10‑min practice, 5‑min invite to a small Circle. Want the link?`
export const dmPostLive = `Loved your comment today. Here’s the Starter Kit (PDF) + next Circle date. Want me to reserve you a spot?`
export const dmReferral = `Know 1–2 leaders who value service-first practice? I’ll send them the Starter Kit and an invite—only if you think it fits.`
