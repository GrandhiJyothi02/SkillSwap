import { useState } from "react";
import { ChevronLeft } from "lucide-react";

export default function QuizPlayer({ quiz, onFinish, onExit }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const question = quiz.questions[current];
  const isLast = current === quiz.questions.length - 1;

  function handleSelect(index) {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === question.answerIndex) {
      setCorrectCount((c) => c + 1);
    }
  }

  function handleNext() {
    if (isLast) {
      const finalScore = correctCount;
      onFinish(finalScore, quiz.questions.length);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setAnswered(false);
  }

  function optionClass(index) {
    if (!answered) return "quiz-option";
    if (index === question.answerIndex) return "quiz-option correct";
    if (index === selected) return "quiz-option incorrect";
    return "quiz-option";
  }

  return (
    <div className="panel" style={{ padding: "1.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button className="btn btn-ghost btn-sm" onClick={onExit}>
          <ChevronLeft size={16} /> Exit quiz
        </button>
        <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
          Question {current + 1} of {quiz.questions.length}
        </p>
      </div>

      <div className="progress-track" style={{ marginTop: "1rem" }}>
        <div className="progress-fill" style={{ width: `${((current + (answered ? 1 : 0)) / quiz.questions.length) * 100}%` }} />
      </div>

      <h2 style={{ marginTop: "1.5rem", fontSize: "1.25rem" }}>{question.question}</h2>

      <div style={{ marginTop: "1.25rem" }}>
        {question.options.map((opt, i) => (
          <button key={i} type="button" className={optionClass(i)} disabled={answered} onClick={() => handleSelect(i)}>
            {opt}
          </button>
        ))}
      </div>

      {answered && (
        <button className="btn btn-primary" style={{ marginTop: "0.5rem" }} onClick={handleNext}>
          {isLast ? "See results" : "Next question"}
        </button>
      )}
    </div>
  );
}
