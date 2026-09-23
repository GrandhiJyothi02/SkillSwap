import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { quizzes } from "../data/mockData.js";
import QuizPlayer from "../components/QuizPlayer.jsx";
import { Award } from "lucide-react";

export default function Quizzes() {
  const { user, recordQuizScore } = useAuth();
  const toast = useToast();

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [result, setResult] = useState(null); // { quiz, score, total }

  const quizScores = user?.quizScores ?? {};

  function startQuiz(quiz) {
    setResult(null);
    setActiveQuiz(quiz);
  }

  function handleFinish(score, total) {
    recordQuizScore(activeQuiz.id, score, total);
    setResult({ quiz: activeQuiz, score, total });
    setActiveQuiz(null);
    toast.success(`Scored ${score}/${total} — +1 credit earned`);
  }

  if (activeQuiz) {
    return <QuizPlayer quiz={activeQuiz} onFinish={handleFinish} onExit={() => setActiveQuiz(null)} />;
  }

  if (result) {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <div className="panel" style={{ padding: "2rem", textAlign: "center" }}>
        <Award size={40} color="var(--primary)" style={{ margin: "0 auto" }} />
        <h2 style={{ marginTop: "1rem", fontSize: "1.5rem" }}>{result.quiz.title} complete</h2>
        <p style={{ marginTop: "0.5rem", color: "var(--muted-foreground)" }}>
          You scored <strong style={{ color: "var(--foreground)" }}>{result.score}/{result.total}</strong> ({pct}%)
        </p>
        <div className="quick-actions" style={{ justifyContent: "center", marginTop: "1.5rem" }}>
          <button className="btn btn-primary" onClick={() => startQuiz(result.quiz)}>Retake quiz</button>
          <button className="btn btn-secondary" onClick={() => setResult(null)}>Back to quizzes</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="page-eyebrow">Test yourself</p>
      <h1 className="page-title">Quizzes</h1>
      <p className="page-sub">A short quiz per skill — score well and earn a credit toward your next swap.</p>

      <div className="card-grid" style={{ marginTop: "2rem" }}>
        {quizzes.map((q) => {
          const prior = quizScores[q.id];
          return (
            <div key={q.id} className="panel" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontWeight: 500 }}>{q.title}</p>
                  <span className="chip-static" style={{ marginTop: "0.4rem", display: "inline-block" }}>{q.skill}</span>
                </div>
                {prior && (
                  <span className="badge badge-upcoming">Best: {prior.score}/{prior.total}</span>
                )}
              </div>
              <p style={{ marginTop: "0.85rem", fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                {q.questions.length} questions · ~{q.questions.length * 1} min
              </p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: "1.1rem" }} onClick={() => startQuiz(q)}>
                {prior ? "Retake quiz" : "Start quiz"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
