import React, { useEffect, useRef, useState } from "react";
import { Footer } from "../components/Footer";
import { HeaderLogo } from "../components/Logo";
import { supabase } from "../lib/supabase";
import "./AssessmentPage.css";

const SMS_NUMBER = "[your number]"; // ← replace with actual SMS number
const MAX_RAW = 140;

type QuestionType = "single" | "multi";
interface Option { label: string; score: number; }
interface Question {
  id: string;
  label: string;
  type: QuestionType;
  options: Option[];
  maxScore?: number;
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    label: "How long have you been running your practice?",
    type: "single",
    options: [
      { label: "Less than 1 year", score: 0 },
      { label: "1–3 years", score: 5 },
      { label: "3–7 years", score: 10 },
      { label: "7+ years", score: 15 },
    ],
  },
  {
    id: "q2",
    label: "Roughly how many clients have you worked with in total — past and present?",
    type: "single",
    options: [
      { label: "Fewer than 20", score: 0 },
      { label: "20–75", score: 5 },
      { label: "75–200", score: 10 },
      { label: "200+", score: 20 },
    ],
  },
  {
    id: "q3",
    label: "How are you currently storing client information?",
    type: "single",
    options: [
      { label: "I don't have a formal system", score: 0 },
      { label: "Spreadsheet", score: 5 },
      { label: "Basic CRM or case management software", score: 10 },
      { label: "Dedicated immigration or legal software", score: 15 },
    ],
  },
  {
    id: "q4",
    label: "Which of the following does your practice currently offer?",
    type: "multi",
    maxScore: 10,
    options: [
      { label: "Express Entry", score: 2 },
      { label: "Study permits", score: 2 },
      { label: "Work permits", score: 2 },
      { label: "PR applications", score: 2 },
      { label: "Business immigration", score: 2 },
      { label: "Family sponsorship", score: 2 },
    ],
  },
  {
    id: "q5",
    label: "When a client completes a file with you — what typically happens next?",
    type: "single",
    options: [
      { label: "The relationship usually ends there", score: 0 },
      { label: "They come back if they need something", score: 5 },
      { label: "I occasionally follow up", score: 10 },
      { label: "I have a structured process for staying in touch", score: 15 },
    ],
  },
  {
    id: "q6",
    label: "Have you ever worked with a marketing agency or growth consultant?",
    type: "single",
    options: [
      { label: "No, never", score: 0 },
      { label: "Yes but it didn't work out", score: 3 },
      { label: "Yes and it was mixed", score: 7 },
      { label: "Yes and it was effective", score: 10 },
    ],
  },
  {
    id: "q7",
    label: "What percentage of your clients would you say are Express Entry candidates?",
    type: "single",
    options: [
      { label: "I'm not sure", score: 0 },
      { label: "Under 20%", score: 5 },
      { label: "20–50%", score: 10 },
      { label: "Over 50%", score: 15 },
    ],
  },
  {
    id: "q8",
    label: "How would you describe your comfort level with digital tools and new systems?",
    type: "single",
    options: [
      { label: "Not comfortable — I keep things simple", score: 0 },
      { label: "Somewhat comfortable", score: 5 },
      { label: "Comfortable — I adopt tools when they help", score: 10 },
      { label: "Very comfortable — I actively look for better systems", score: 15 },
    ],
  },
  {
    id: "q9",
    label: "What is the primary reason you took this call?",
    type: "single",
    options: [
      { label: "Curious but not actively looking", score: 0 },
      { label: "Open to growth if the right thing came along", score: 5 },
      { label: "Actively trying to grow right now", score: 10 },
      { label: "Growth is my number one priority this quarter", score: 15 },
    ],
  },
  {
    id: "q10",
    label: "If this was clearly a fit — how soon could you move forward?",
    type: "single",
    options: [
      { label: "Not sure yet", score: 0 },
      { label: "A few months", score: 3 },
      { label: "A few weeks", score: 7 },
      { label: "This week", score: 10 },
    ],
  },
];

type Answers = Record<string, number | number[]>;

function calcScore(answers: Answers): number {
  let raw = 0;
  for (const q of QUESTIONS) {
    const ans = answers[q.id];
    if (ans === undefined) continue;
    if (q.type === "multi") {
      const selected = ans as number[];
      const pts = selected.reduce((sum, i) => sum + (q.options[i]?.score ?? 0), 0);
      raw += Math.min(pts, q.maxScore ?? pts);
    } else {
      raw += q.options[ans as number]?.score ?? 0;
    }
  }
  return Math.round((raw / MAX_RAW) * 100);
}

function getTier(score: number) {
  if (score >= 80) return {
    label: "Tier 1 — Strong fit",
    message: `Your practice is well positioned. There is likely significant latent revenue in your existing client base. Text your score to ${SMS_NUMBER} to confirm your call.`,
  };
  if (score >= 55) return {
    label: "Tier 2 — Good fit",
    message: `There is real opportunity here. The call will show you exactly where. Text your score to ${SMS_NUMBER} to confirm your slot.`,
  };
  if (score >= 30) return {
    label: "Conditional",
    message: `Your practice may not be ready for the full program yet — but the call will tell us for certain. Text your score to ${SMS_NUMBER}.`,
  };
  return {
    label: "Not ready",
    message: `Based on your answers, now may not be the right time. Text your score to ${SMS_NUMBER} and we will let you know honestly.`,
  };
}

const AssessmentPage: React.FC = () => {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; tier: ReturnType<typeof getTier> } | null>(null);
  const utmRef = useRef<Record<string, string>>({});
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // capture token
    tokenRef.current = params.get("token");
    // capture UTM params
    const utm: Record<string, string> = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const val = params.get(key);
      if (val) utm[key] = val;
    }
    utmRef.current = utm;
  }, []);

  const answeredCount = QUESTIONS.filter((q) => {
    const a = answers[q.id];
    if (q.type === "multi") return Array.isArray(a) && a.length > 0;
    return a !== undefined;
  }).length;

  const progress = Math.round((answeredCount / QUESTIONS.length) * 100);
  const allAnswered = answeredCount === QUESTIONS.length;

  function toggleSingle(qid: string, idx: number) {
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  }

  function toggleMulti(qid: string, idx: number) {
    setAnswers((prev) => {
      const cur = (prev[qid] as number[]) ?? [];
      const next = cur.includes(idx) ? cur.filter((i) => i !== idx) : [...cur, idx];
      return { ...prev, [qid]: next };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const score = calcScore(answers);
    const tier = getTier(score);
    const submittedAt = new Date().toISOString();

    // Build human-readable answer map for pre-call briefing
    const answerMap: Record<string, { question: string; answer: string | string[]; score: number }> = {};
    for (const q of QUESTIONS) {
      const ans = answers[q.id];
      if (ans === undefined) continue;
      if (q.type === "multi") {
        const selected = ans as number[];
        const labels = selected.map((i) => q.options[i]?.label ?? "");
        const pts = Math.min(
          selected.reduce((sum, i) => sum + (q.options[i]?.score ?? 0), 0),
          q.maxScore ?? Infinity,
        );
        answerMap[q.id] = { question: q.label, answer: labels, score: pts };
      } else {
        const idx = ans as number;
        answerMap[q.id] = {
          question: q.label,
          answer: q.options[idx]?.label ?? "",
          score: q.options[idx]?.score ?? 0,
        };
      }
    }

    const submission = {
      answers: answerMap,
      score,
      tier: tier.label,
      utm: utmRef.current,
      submitted_at: submittedAt,
    };

    setSubmitting(true);
    setSubmitError(null);

    if (tokenRef.current) {
      const { error } = await supabase
        .from("new_bookings")
        .update({
          submission,
          submitted_at: submittedAt,
          status: "completed",
        })
        .eq("token", tokenRef.current)
        .is("submitted_at", null); // prevent double-submit

      if (error) {
        console.error("Supabase error:", error);
        setSubmitError("Something went wrong saving your response. Your score is shown below.");
      }
    }

    setResult({ score, tier });
    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <div className="asl-page">
      <header className="asl-nav">
        <a href="/" aria-label="Apex Consulting — Home" className="asl-nav__logo-link">
          <HeaderLogo />
        </a>
      </header>

      <main className="asl-main">
        <div className="asl-split">
          {/* Left — sticky video */}
          <div className="asl-split__left" aria-hidden="true">
            <div className="asl-video-wrap">
              <video
                className="asl-video"
                autoPlay
                loop
                muted
                playsInline
                // src="/assessment-video.mp4"
              />
              <div className="asl-video__overlay">
                <p className="asl-video__label">Practice Assessment</p>
              </div>
            </div>
          </div>

          {/* Right — scrolling form */}
          <div className="asl-split__right">
            {!submitted ? (
              <form className="asl-form" onSubmit={handleSubmit} noValidate>
                <div className="asl-form__header">
                  <h1 className="asl-form__title">Practice Assessment</h1>
                  <p className="asl-form__subtitle">
                    Takes about 2 minutes. Your score determines what we focus on in the call.
                  </p>
                  <div className="asl-progress-wrap">
                    <div
                      className="asl-progress"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${answeredCount} of ${QUESTIONS.length} questions answered`}
                    >
                      <div className="asl-progress__bar" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="asl-progress__label">{answeredCount} / {QUESTIONS.length}</span>
                  </div>
                </div>

                <div className="asl-form__questions">
                  {QUESTIONS.map((q, qIdx) => {
                    const isMulti = q.type === "multi";
                    const multiAns = (answers[q.id] as number[]) ?? [];
                    const singleAns = answers[q.id] as number | undefined;

                    return (
                      <fieldset key={q.id} className="asl-question">
                        <legend className="asl-question__label">
                          <span className="asl-question__num" aria-hidden="true">{qIdx + 1}</span>
                          {q.label}
                          {isMulti && (
                            <span className="asl-question__hint"> Select all that apply.</span>
                          )}
                        </legend>
                        <div className="asl-question__options">
                          {q.options.map((opt, optIdx) => {
                            const checked = isMulti
                              ? multiAns.includes(optIdx)
                              : singleAns === optIdx;
                            return (
                              <label
                                key={optIdx}
                                className={[
                                  "asl-option",
                                  isMulti ? "asl-option--checkbox" : "",
                                  checked ? "asl-option--selected" : "",
                                ].filter(Boolean).join(" ")}
                              >
                                <input
                                  type={isMulti ? "checkbox" : "radio"}
                                  name={q.id}
                                  value={optIdx}
                                  checked={checked}
                                  onChange={() =>
                                    isMulti ? toggleMulti(q.id, optIdx) : toggleSingle(q.id, optIdx)
                                  }
                                  className="asl-option__input"
                                />
                                <span className="asl-option__check" aria-hidden="true" />
                                <span className="asl-option__text">{opt.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    );
                  })}
                </div>

                <div className="asl-form__footer">
                  <button type="submit" className="asl-submit" disabled={!allAnswered || submitting}>
                    {submitting ? "Saving…" : "Get my score"}
                  </button>
                  {!allAnswered && !submitting && (
                    <p className="asl-form__remaining">
                      {QUESTIONS.length - answeredCount} question
                      {QUESTIONS.length - answeredCount !== 1 ? "s" : ""} remaining
                    </p>
                  )}
                  {submitError && (
                    <p className="asl-form__remaining" style={{ color: "#c0392b" }}>{submitError}</p>
                  )}
                </div>
              </form>
            ) : (
              <div className="asl-result">
                <div className="asl-result__score-row">
                  <span className="asl-result__score">{result?.score}</span>
                  <span className="asl-result__denom">/ 100</span>
                </div>
                <p className="asl-result__tier">{result?.tier.label}</p>
                <p className="asl-result__message">{result?.tier.message}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AssessmentPage;
