# SkillSwap — React frontend

A complete, working React frontend for the SkillSwap platform — routing,
auth, a sidebar dashboard, and every button wired up. Built with Vite +
React + React Router. No backend required — accounts are mock/local
(stored in your browser), so it runs immediately.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## What's included

**Public site**
- `/` — Home page, with demo categories, "how it works", and open-swap
  cards (`src/data/mockData.js`)
- `/login`, `/register` — working auth forms (mock accounts, see below)

**Dashboard app** (protected — redirects to `/login` if signed out), with
a left sidebar exactly as you asked for:
- **Dashboard** (`/dashboard`) — stats (credits, practice done, upcoming
  meetings, quizzes taken), quick-action buttons that navigate to each
  section, and a preview of upcoming meetings
- **Profile** (`/dashboard/profile`) — edit name, bio, and skills taught;
  saves back to the account
- **Practice** (`/dashboard/practice`) — practice modules with a
  filter (All / Not started / Completed) and a working "mark complete"
  toggle
- **Meetings** (`/dashboard/meetings`) — upcoming/past session lists,
  a "Schedule a meeting" form that adds a real entry, Join and Cancel
  buttons
- **Quizzes** (`/dashboard/quizzes`) — pick a quiz, answer questions
  one at a time with instant right/wrong feedback, see your score,
  retake it — completing a quiz earns a credit
- **Logout** — signs out and redirects to `/login`

Every sidebar link, quick-action button, and form is functional — this
isn't a static mockup.

## How accounts work

`src/context/AuthContext.jsx` implements sign-up/sign-in/sign-out backed
by `localStorage` (no server). Signing up seeds your account with sample
practice modules and meetings so the dashboard isn't empty on first login.
This is meant as a ready-to-demo frontend; swap `AuthContext.jsx` for a
real backend (Supabase, your own API, etc.) when you're ready to persist
accounts server-side — the rest of the app doesn't need to change, since
every page reads/writes through `useAuth()`.

## Project structure

```
src/
  main.jsx                Entry point (Router + providers)
  App.jsx                 All routes
  index.css               Design system (colors, buttons, cards, sidebar…)
  context/
    AuthContext.jsx        Mock accounts, session, profile/practice/meetings/quiz state
    ToastContext.jsx        Toast notifications used across the app
  components/
    Sidebar.jsx             Left nav (Dashboard/Profile/Practice/Meetings/Quizzes/Logout)
    DashboardLayout.jsx      Sidebar + page outlet
    ProtectedRoute.jsx       Redirects to /login when signed out
    AuthShell.jsx            Shared two-column layout for Login/Register
    QuizPlayer.jsx           One-question-at-a-time quiz UI
  data/
    mockData.js             All demo/sample content
  pages/
    Home.jsx, Login.jsx, Register.jsx
    Dashboard.jsx, Profile.jsx, Practice.jsx, Meetings.jsx, Quizzes.jsx
    NotFound.jsx
  assets/
    hero-exchange.jpg
```
