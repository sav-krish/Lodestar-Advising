export const clientsHelped = 20;

export const getHourPriceCents = (date = new Date()) =>
  date >= new Date(2026, 10, 10) ? 6000 : 5000;

export const programs = [
  {
    id: "hour",
    name: "The Lodestar Hour",
    sessionCount: 1,
    sessionMinutes: 60,
    scope: "admissions",
    priceCents: 5000,
    priceSummary: "$50 per hour through November 15, 2026. $60 from Monday, November 16.",
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
    priceCents: 55000,
    priceSummary: "$550 for all ten essay classes.",
    discountedHourlyRate: false,
    summary: "Ten focused classes. Your essays, from first idea to final draft.",
    points: [
      "10 premium, 30-minute essay classes",
      "Common App and supplemental essay coaching",
      "Brainstorming, structure, writing, and revision",
      "Essay-only support with Krish Sav",
    ],
  },
] as const;
