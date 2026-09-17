"use client";

import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/format";

const VIEW_W = 640;
const VIEW_H = 220;
const PAD_LEFT = 64;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;
const INNER_W = VIEW_W - PAD_LEFT - PAD_RIGHT;
const INNER_H = VIEW_H - PAD_TOP - PAD_BOTTOM;

export interface RevenuePoint {
  label: string;
  total: number;
}

export default function RevenueTrendChart({ data }: { data: RevenuePoint[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { points, maxValue, gridLines } = useMemo(() => {
    const maxValue = Math.max(1, ...data.map((d) => d.total)) * 1.15;
    const stepX = data.length > 1 ? INNER_W / (data.length - 1) : 0;
    const points = data.map((d, i) => ({
      ...d,
      x: PAD_LEFT + stepX * i,
      y: PAD_TOP + INNER_H - (d.total / maxValue) * INNER_H,
    }));
    const gridLines = [0, 0.5, 1].map((f) => ({
      y: PAD_TOP + INNER_H - f * INNER_H,
      value: maxValue * f,
    }));
    return { points, maxValue, gridLines };
  }, [data]);

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1]?.x ?? PAD_LEFT},${
    PAD_TOP + INNER_H
  } L${PAD_LEFT},${PAD_TOP + INNER_H} Z`;

  const last = points[points.length - 1];
  const hovered = hoverIndex != null ? points[hoverIndex] : null;

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (points.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = VIEW_W / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    const stepX = points.length > 1 ? INNER_W / (points.length - 1) : INNER_W;
    const index = Math.min(points.length - 1, Math.max(0, Math.round((x - PAD_LEFT) / stepX)));
    setHoverIndex(index);
  }

  if (points.length === 0 || maxValue <= 1) {
    return <p className="text-sm text-muted">No revenue in this period yet.</p>;
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverIndex(null)}
        role="img"
        aria-label="Revenue trend over time"
      >
        {gridLines.map((g) => (
          <g key={g.y}>
            <line
              x1={PAD_LEFT}
              x2={VIEW_W - PAD_RIGHT}
              y1={g.y}
              y2={g.y}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text x={PAD_LEFT - 8} y={g.y + 4} textAnchor="end" fontSize={10} fill="var(--muted)">
              {formatMoney(g.value)}
            </text>
          </g>
        ))}

        <path d={areaPath} fill="var(--accent)" opacity={0.1} stroke="none" />
        <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {points.map((p, i) => (
          <text
            key={p.label}
            x={p.x}
            y={VIEW_H - 6}
            textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
            fontSize={10}
            fill="var(--muted)"
          >
            {i === 0 || i === points.length - 1 || i === hoverIndex ? p.label : ""}
          </text>
        ))}

        {last && (
          <>
            <circle cx={last.x} cy={last.y} r={4} fill="var(--accent)" stroke="var(--surface)" strokeWidth={2} />
            <text x={last.x} y={last.y - 10} textAnchor="end" fontSize={11} fill="var(--foreground)">
              {formatMoney(last.total)}
            </text>
          </>
        )}

        {hovered && (
          <>
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={PAD_TOP}
              y2={PAD_TOP + INNER_H}
              stroke="var(--muted)"
              strokeWidth={1}
              strokeDasharray="2 3"
            />
            <circle
              cx={hovered.x}
              cy={hovered.y}
              r={5}
              fill="var(--accent)"
              stroke="var(--surface)"
              strokeWidth={2}
            />
          </>
        )}
      </svg>

      {hovered && (
        <div
          className="absolute pointer-events-none bg-surface border border-border px-2.5 py-1.5 text-xs shadow-sm"
          style={{
            left: `${(hovered.x / VIEW_W) * 100}%`,
            top: `${(hovered.y / VIEW_H) * 100}%`,
            transform: "translate(-50%, -120%)",
          }}
        >
          <p className="text-foreground font-medium">{formatMoney(hovered.total)}</p>
          <p className="text-muted">{hovered.label}</p>
        </div>
      )}
    </div>
  );
}
