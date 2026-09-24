import { createContext, useContext, useEffect, useState } from "react";
import { defaultMeetings, defaultPracticeModules } from "../data/mockData.js";
import { seedTutors } from "../data/skillsData.js";

const USERS_KEY = "skillswap:users";
const SESSION_KEY = "skillswap:session";
const RESET_TOKENS_KEY = "skillswap:reset-tokens";
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

const AuthContext = createContext(null);

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Seeds demo tutors into the shared user store (once) so Explore/Search/
// Connections have real members to work with, without touching any
// accounts a real visitor has already created.
function ensureSeedTutors() {
  const users = readUsers();
  const existingEmails = new Set(users.map((u) => u.email));
  let changed = false;

  seedTutors.forEach((tutor) => {
    if (!existingEmails.has(tutor.email)) {
      users.push({
        ...tutor,
        credits: tutor.credits ?? 0,
        practiceModules: defaultPracticeModules,
        meetings: [],
        quizScores: {},
      });
      changed = true;
    }
  });

  if (changed) writeUsers(users);
}

function readResetTokens() {
  try {
    return JSON.parse(localStorage.getItem(RESET_TOKENS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeResetTokens(tokens) {
  localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
}

function generateToken() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ensureSeedTutors();
    const email = localStorage.getItem(SESSION_KEY);
    if (email) {
      const found = readUsers().find((u) => u.email === email);
      if (found) setUser(found);
    }
    setLoading(false);
  }, []);

  function persistUser(updated) {
    const users = readUsers().map((u) => (u.email === updated.email ? updated : u));
    writeUsers(users);
    setUser(updated);
  }

  function signUp({ fullName, email, password, skills }) {
    const users = readUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email === normalizedEmail)) {
      return { error: "An account with that email already exists." };
    }

    const newUser = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      password, // NOTE: plain text, demo purposes only — never do this in production
      skills,
      credits: 4,
      bio: "",
      practiceModules: defaultPracticeModules,
      meetings: defaultMeetings,
      quizScores: {},
    };

    users.push(newUser);
    writeUsers(users);
    localStorage.setItem(SESSION_KEY, normalizedEmail);
    setUser(newUser);
    return { user: newUser };
  }

  async function signIn({ email, password }) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Incorrect email or password.",
      };
    }

    const loggedInUser = {
      ...data.user,
      fullName: data.user.name || data.user.fullName,
    };

    localStorage.setItem(SESSION_KEY, loggedInUser.email);
    setUser(loggedInUser);

    return { user: loggedInUser };
  } catch (error) {
    console.error("Login API error:", error);
    return {
      error: "Unable to connect to the server.",
    };
  }
}
function signOut() {
  localStorage.removeItem(SESSION_KEY);
  setUser(null);
}
 async function signUp({ fullName, email, password, skills }) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Registration failed.",
      };
    }

    const backendUser = data.user;

    const newUser = {
      ...backendUser,
      fullName: backendUser.name || fullName.trim(),
      skills: skills || [],
      credits: 4,
      bio: "",
      practiceModules: defaultPracticeModules,
      meetings: defaultMeetings,
      quizScores: {},
    };

    localStorage.setItem(SESSION_KEY, newUser.email);
    setUser(newUser);

    return { user: newUser };
  } catch (error) {
    console.error("Registration API error:", error);

    return {
      error: "Unable to connect to the server. Please try again.",
    };
  }
}

  function updateProfile(partial) {
    if (!user) return;
    persistUser({ ...user, ...partial });
  }

  function updatePracticeModules(practiceModules) {
    if (!user) return;
    persistUser({ ...user, practiceModules });
  }

  function updateMeetings(meetings) {
    if (!user) return;
    persistUser({ ...user, meetings });
  }

  function recordQuizScore(quizId, score, total) {
    if (!user) return;
    const quizScores = { ...user.quizScores, [quizId]: { score, total, date: new Date().toISOString() } };
    persistUser({ ...user, quizScores, credits: user.credits + 1 });
  }

  // ---- directory helpers (used by Explore, Skill Details, Connections, Messages) ----

  function listUsers() {
    return readUsers();
  }

  function findUserByEmail(email) {
    if (!email) return null;
    const normalized = email.trim().toLowerCase();
    return readUsers().find((u) => u.email === normalized) || null;
  }

  // ---- forgot / reset password ----
  // There's no real mail server behind this demo, so instead of emailing a
  // link we hand the caller back a token it can surface in the UI. The
  // token itself is single-use and time-limited, the same way a real
  // emailed link would be.

  function requestPasswordReset(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const exists = readUsers().some((u) => u.email === normalizedEmail);

    if (!exists) {
      // Don't reveal account existence to the caller's UI copy, but also
      // don't hand back a usable token for an email we don't recognize.
      return { requested: true, exists: false };
    }

    const tokens = readResetTokens().filter((t) => t.email !== normalizedEmail);
    const token = generateToken();
    tokens.push({ token, email: normalizedEmail, expiresAt: Date.now() + RESET_TOKEN_TTL_MS });
    writeResetTokens(tokens);

    return { requested: true, exists: true, token };
  }

  function validateResetToken(token) {
    if (!token) return { valid: false };
    const entry = readResetTokens().find((t) => t.token === token);
    if (!entry) return { valid: false };
    if (entry.expiresAt < Date.now()) return { valid: false, expired: true };
    return { valid: true, email: entry.email };
  }

  function resetPassword({ token, newPassword }) {
    const { valid, email, expired } = validateResetToken(token);
    if (!valid) {
      return { error: expired ? "This reset link has expired. Request a new one." : "This reset link is invalid." };
    }

    const users = readUsers();
    const idx = users.findIndex((u) => u.email === email);
    if (idx === -1) {
      return { error: "We couldn't find that account anymore." };
    }

    users[idx] = { ...users[idx], password: newPassword };
    writeUsers(users);
    writeResetTokens(readResetTokens().filter((t) => t.token !== token));

    if (user && user.email === email) {
      setUser(users[idx]);
    }

    return { success: true };
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updatePracticeModules,
    updateMeetings,
    recordQuizScore,
    listUsers,
    findUserByEmail,
    requestPasswordReset,
    validateResetToken,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
