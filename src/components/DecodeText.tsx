import { useState, useEffect, useRef } from "react";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>";
const CYCLE_MS = 50;

type DecodeTextProps = {
  text: string;
  duration: number;
  isActive: boolean;
  className?: string;
};

export const DecodeText = ({ text, duration, isActive, className = "" }: DecodeTextProps) => {
  const [state, setState] = useState<{ displayed: string[]; locked: boolean[] }>(() => ({
    displayed: text.split("").map(() => CHARSET[Math.floor(Math.random() * CHARSET.length)]),
    locked: new Array(text.length).fill(false),
  }));
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isActive || text.length === 0) return;

    startTimeRef.current = Date.now();
    const lockTimes = text.split("").map((_, i) => {
      return startTimeRef.current + ((i + 1) / text.length) * duration;
    });

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        const now = Date.now();
        const nextDisplayed = [...prev.displayed];
        const nextLocked = [...prev.locked];
        let allLocked = true;

        for (let i = 0; i < text.length; i++) {
          if (nextLocked[i]) {
            nextDisplayed[i] = text[i];
          } else {
            allLocked = false;
            if (now >= lockTimes[i]) {
              nextLocked[i] = true;
              nextDisplayed[i] = text[i];
            } else {
              nextDisplayed[i] = CHARSET[Math.floor(Math.random() * CHARSET.length)];
            }
          }
        }

        if (allLocked && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        return { displayed: nextDisplayed, locked: nextLocked };
      });
    }, CYCLE_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, text, duration]);

  if (!isActive) return <span className={className}>{text}</span>;

  return (
    <span className={className} aria-label={text}>
      {state.displayed.map((char, i) => (
        <span key={i}>{char}</span>
      ))}
    </span>
  );
};
