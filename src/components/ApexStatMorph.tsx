import React, { useEffect, useRef } from "react";

/** Canvas morphing stats — lifted from hq-home-standalone Home.tsx */
export const ApexStatMorph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = ctx;

    canvas.width = 560;
    canvas.height = 560;

    const frames = [
      { color: "#0f1118", text: "#c8a96e", label: "Years in market", value: "4" },
      { color: "#c8a96e", text: "#0f1118", label: "Avg. month-one uplift", value: "$34k" },
      { color: "#1a1e28", text: "#f0dfc0", label: "Profit margin", value: "53%" },
      { color: "#f0dfc0", text: "#0f1118", label: "Engagements", value: "Live" },
    ];

    const NO_GHOST = new Set(["3-0", "0-3", "2-3"]);
    const CX = 280;
    const CY = 260;
    const R = 190;
    const N = 128;

    function squarePath(): [number, number][] {
      return [
        [CX - R, CY - R],
        [CX + R, CY - R],
        [CX + R, CY + R],
        [CX - R, CY + R],
      ];
    }

    function circlePath(): [number, number][] {
      return Array.from({ length: N }, (_, i) => {
        const a = (i / N) * Math.PI * 2 - Math.PI / 2;
        return [CX + Math.cos(a) * R, CY + Math.sin(a) * R] as [number, number];
      });
    }

    function trianglePath(): [number, number][] {
      return Array.from({ length: 3 }, (_, i) => {
        const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
        return [CX + Math.cos(a) * R, CY + Math.sin(a) * R] as [number, number];
      });
    }

    function starPath(): [number, number][] {
      const inner = R * 0.48;
      const spikes = 4;
      const pts: [number, number][] = [];
      for (let i = 0; i < spikes * 2; i += 1) {
        const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
        const radius = i % 2 ? inner : R;
        pts.push([CX + Math.cos(a) * radius, CY + Math.sin(a) * radius]);
      }
      return pts;
    }

    const shapeFns = [squarePath, circlePath, trianglePath, starPath];

    function resample(pts: [number, number][], n: number): [number, number][] {
      const res: [number, number][] = [];
      const total = pts.length;
      for (let i = 0; i < n; i += 1) {
        const t = (i / n) * total;
        const idx = Math.floor(t);
        const f = t - idx;
        const a = pts[idx % total];
        const b = pts[(idx + 1) % total];
        res.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
      }
      return res;
    }

    function getShape(i: number): [number, number][] {
      return resample(shapeFns[i](), N);
    }

    function ease(t: number): number {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function lerpColor(a: string, b: string, t: number): string {
      const h = (s: string) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
      const ca = h(a);
      const cb = h(b);
      const r = (i: number) => Math.round(ca[i] + (cb[i] - ca[i]) * t);
      return `rgb(${r(0)},${r(1)},${r(2)})`;
    }

    function drawShape(pts: [number, number][], color: string, alpha: number): void {
      c.save();
      c.globalAlpha = alpha;
      c.beginPath();
      c.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i += 1) c.lineTo(pts[i][0], pts[i][1]);
      c.closePath();
      c.fillStyle = color;
      c.fill();
      c.restore();
    }

    function drawText(label: string, value: string, color: string, alpha: number): void {
      c.save();
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.textAlign = "center";
      c.font = "500 88px Anton,sans-serif";
      c.fillText(value, CX, CY + 18);
      c.font = "400 22px Anton,sans-serif";
      const words = label.split(" ");
      let line = "";
      const lines: string[] = [];
      const maxW = R * 1.1;
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (c.measureText(test).width > maxW && line) {
          lines.push(line);
          line = w;
        } else {
          line = test;
        }
      }
      lines.push(line);
      lines.forEach((l, i) => c.fillText(l, CX, CY + 80 + i * 28));
      c.restore();
    }

    let current = 0;
    let next = 1;
    let progress = 0;
    let holding = true;
    let holdTimer = 0;
    const HOLD = 28;
    const MORPH = 38;
    let curPts = getShape(0);
    let nextPts = getShape(1);
    let rafId = 0;

    const loop = () => {
      c.clearRect(0, 0, 560, 560);
      if (holding) {
        drawShape(curPts, frames[current].color, 1);
        drawText(frames[current].label, frames[current].value, frames[current].text, 1);
        holdTimer += 1;
        if (holdTimer >= HOLD) {
          holding = false;
          holdTimer = 0;
          progress = 0;
        }
      } else {
        const p = ease(Math.min(progress / MORPH, 1));
        const morphed = curPts.map((pt, i) => {
          const np = nextPts[i];
          return [pt[0] + (np[0] - pt[0]) * p, pt[1] + (np[1] - pt[1]) * p] as [number, number];
        });
        const col = lerpColor(frames[current].color, frames[next].color, p);
        if (!NO_GHOST.has(`${current}-${next}`)) drawShape(nextPts, frames[next].color, 0.18);
        drawShape(morphed, col, 1);
        const textAlpha = p < 0.5 ? 1 - p * 2 : (p - 0.5) * 2;
        const activeText = p < 0.5 ? frames[current] : frames[next];
        drawText(activeText.label, activeText.value, activeText.text, textAlpha);
        progress += 1;
        if (progress >= MORPH) {
          holding = true;
          holdTimer = 0;
          current = next;
          next = (next + 1) % frames.length;
          curPts = getShape(current);
          nextPts = getShape(next);
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="ApexStatMorph">
      <canvas ref={canvasRef} />
    </div>
  );
};
