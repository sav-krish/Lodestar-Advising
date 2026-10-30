export const clientsHelped = 20;

export const programs = [
  {
    id: "hour",
    name: "The Lodestar Hour",
    sessionCount: 1,
    sessionMinutes: 60,
    scope: "admissions",
    discountedHourlyRate: false,
    summary: "One hour for whatever needs your attention.",
    points: [
      "Common App and supplemental essays",
      "Activities list and resume feedback",
      "College search and scholarship support",
      "A session tailored to your questions",
    ],
  },
  {
    id: "essay-package",
    name: "The Lodestar Essay Package",
    sessionCount: 10,
    sessionMinutes: 30,
    scope: "essays-only",
    discountedHourlyRate: true,
    summary: "Ten focused classes. Your essays, from first idea to final draft.",
    points: [
      "10 premium, 30-minute essay classes",
      "Common App and supplemental essay coaching",
      "Brainstorming, structure, writing, and revision",
      "Essay-only support with Krish Sav",
    ],
  },
] as const;