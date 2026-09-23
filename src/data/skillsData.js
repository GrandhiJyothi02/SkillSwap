// Skill catalogue + demo tutors that power Explore, Skill Details, and search.
// Tutors are seeded into the same localStorage user store AuthContext uses,
// so they behave like any other SkillSwap member (connect, message, etc.).

export const skillDescriptions = {
  Design: "Visual design, UX research, prototyping, and design systems — from first wireframe to polished interface.",
  Coding: "Software engineering across frontend, backend, and data — practical, project-based sessions.",
  Languages: "Conversational practice and grammar fundamentals for world languages, with a focus on real-world use.",
  Music: "Instrument technique, music theory, and songwriting for beginners through intermediate players.",
  Business: "Strategy, marketing, and communication skills that translate straight into day-to-day work.",
  Cooking: "Techniques, cuisines, and kitchen fundamentals — cook confidently without a recipe.",
  Photography: "Composition, lighting, and editing for stills, on any camera you already own.",
  Writing: "Storytelling, editing, and clear written communication for fiction and everyday writing alike.",
};

// NOTE: plain-text passwords here are demo-only, matching the rest of this
// project's local-storage auth model — never do this in production.
export const seedTutors = [
  {
    fullName: "Priya Nair",
    email: "priya.nair@skillswap.demo",
    password: "skillswap-demo",
    skills: ["Design", "Business"],
    bio: "UX researcher with 8 years in product design. I teach interview techniques, prototyping, and portfolio reviews.",
    credits: 12,
  },
  {
    fullName: "Tomás Rivera",
    email: "tomas.rivera@skillswap.demo",
    password: "skillswap-demo",
    skills: ["Coding"],
    bio: "Backend engineer working mostly in distributed systems. Happy to pair on APIs, databases, or your first backend project.",
    credits: 20,
  },
  {
    fullName: "Ingrid Solberg",
    email: "ingrid.solberg@skillswap.demo",
    password: "skillswap-demo",
    skills: ["Languages"],
    bio: "Native Norwegian speaker and former language-school tutor. Sessions focus on real conversation, not just flashcards.",
    credits: 9,
  },
  {
    fullName: "Marcus Chen",
    email: "marcus.chen@skillswap.demo",
    password: "skillswap-demo",
    skills: ["Music"],
    bio: "Self-taught guitarist and piano teacher of six years. I like starting with the song you actually want to play.",
    credits: 15,
  },
  {
    fullName: "Elena Ruiz",
    email: "elena.ruiz@skillswap.demo",
    password: "skillswap-demo",
    skills: ["Business"],
    bio: "Marketing consultant for early-stage startups. I teach positioning, messaging, and go-to-market basics.",
    credits: 7,
  },
  {
    fullName: "Jamal Carter",
    email: "jamal.carter@skillswap.demo",
    password: "skillswap-demo",
    skills: ["Cooking"],
    bio: "Line cook turned home-cooking coach. Knife skills, sauces, and how to cook without measuring everything.",
    credits: 11,
  },
  {
    fullName: "Sofia Lindqvist",
    email: "sofia.lindqvist@skillswap.demo",
    password: "skillswap-demo",
    skills: ["Photography"],
    bio: "Freelance photographer shooting portraits and travel. I teach composition and editing for phone or DSLR.",
    credits: 18,
  },
  {
    fullName: "Noah Williams",
    email: "noah.williams@skillswap.demo",
    password: "skillswap-demo",
    skills: ["Writing", "Coding"],
    bio: "Technical writer and occasional short-story author. I help with structure, clarity, and cutting the second draft down.",
    credits: 6,
  },
];
