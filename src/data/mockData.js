// Demo data — powers the Home page and dashboard sections out of the box.

export const categories = [
  { name: "Design", count: 96 },
  { name: "Coding", count: 141 },
  { name: "Languages", count: 88 },
  { name: "Music", count: 54 },
  { name: "Business", count: 62 },
  { name: "Cooking", count: 37 },
];

export const skillOptions = [
  "Design", "Coding", "Languages", "Music", "Business", "Cooking", "Photography", "Writing",
];

export const openSwaps = [
  { name: "Priya Nair", initials: "PN", location: "Mumbai", teaches: "UX Research", wants: "Piano Basics", hours: 51 },
  { name: "Tomás Rivera", initials: "TR", location: "Mexico City", teaches: "Backend Systems", wants: "Watercolour", hours: 33 },
  { name: "Ingrid Solberg", initials: "IS", location: "Oslo", teaches: "Norwegian", wants: "Video Editing", hours: 19 },
];

export const howItWorks = [
  { step: "01", title: "List what you teach", body: "Add your skills, availability, and the level you can take someone to." },
  { step: "02", title: "Find a match", body: "Our matcher pairs complementary skill sets and overlapping calendars." },
  { step: "03", title: "Trade hours", body: "Every session you teach earns credit you can spend on learning." },
];

// ---- Dashboard demo content (per logged-in user, seeded on signup) ----

export const defaultPracticeModules = [
  { id: "p1", skill: "React Fundamentals", level: "Beginner", description: "Components, props, and state — the building blocks.", completed: true },
  { id: "p2", skill: "Conversational Spanish", level: "Beginner", description: "Everyday phrases for ordering, greeting, and small talk.", completed: false },
  { id: "p3", skill: "Watercolour Basics", level: "Beginner", description: "Wet-on-wet technique and basic colour mixing.", completed: false },
  { id: "p4", skill: "Public Speaking", level: "Intermediate", description: "Structuring a 5-minute talk and handling nerves.", completed: false },
  { id: "p5", skill: "Data Analysis with SQL", level: "Intermediate", description: "Joins, aggregations, and window functions.", completed: true },
  { id: "p6", skill: "Guitar Chords", level: "Beginner", description: "Open chords and simple strumming patterns.", completed: false },
];

export const defaultMeetings = [
  { id: "m1", title: "React Q&A", withUser: "Priya Nair", skill: "Coding", date: "2026-09-05", time: "17:00", status: "upcoming" },
  { id: "m2", title: "Spanish Conversation", withUser: "Tomás Rivera", skill: "Languages", date: "2026-09-08", time: "10:30", status: "upcoming" },
  { id: "m3", title: "Watercolour Intro", withUser: "Ingrid Solberg", skill: "Design", date: "2026-08-20", time: "16:00", status: "completed" },
];

export const quizzes = [
  {
    id: "q1",
    title: "React Fundamentals",
    skill: "Coding",
    questions: [
      {
        question: "What hook lets you add state to a function component?",
        options: ["useEffect", "useState", "useRef", "useMemo"],
        answerIndex: 1,
      },
      {
        question: "Which prop uniquely identifies items in a rendered list?",
        options: ["id", "index", "key", "ref"],
        answerIndex: 2,
      },
      {
        question: "What does JSX compile down to?",
        options: ["HTML strings", "React.createElement calls", "Web Components", "CSS-in-JS"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "q2",
    title: "Conversational Spanish",
    skill: "Languages",
    questions: [
      { question: "How do you say \"Good morning\" in Spanish?", options: ["Buenas noches", "Buenos días", "Buenas tardes", "Hasta luego"], answerIndex: 1 },
      { question: "What does \"¿Cómo estás?\" mean?", options: ["What's your name?", "Where are you?", "How are you?", "How old are you?"], answerIndex: 2 },
      { question: "\"Gracias\" means:", options: ["Please", "Sorry", "Thank you", "Excuse me"], answerIndex: 2 },
    ],
  },
  {
    id: "q3",
    title: "Watercolour Basics",
    skill: "Design",
    questions: [
      { question: "\"Wet-on-wet\" refers to painting on paper that is:", options: ["Dry", "Already wet", "Frozen", "Covered in oil"], answerIndex: 1 },
      { question: "Mixing blue and yellow paint produces:", options: ["Purple", "Orange", "Green", "Brown"], answerIndex: 2 },
    ],
  },
];
