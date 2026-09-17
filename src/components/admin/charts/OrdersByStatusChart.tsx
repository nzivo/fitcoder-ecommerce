"use client";

import { useMemo, useState } from "react";
import type { OrderStatus } from "@/types/database";

const VIEW_W = 640;
const VIEW_H = 220;
const PAD_LEFT = 32;
const PAD_RIGHT = 12;
const PAD_TOP = 24;
const PAD_BOTTOM = 28;
const INNER_W = VIEW_W - PAD_LEFT - PAD_RIGHT;
const INNER_H = VIEW_H - PAD_TOP - PAD_BOTTOM;
const BAR_MAX_WIDTH = 40;
const GAP = 2;

// Same status → color mapping as StatusPill, so a bar's color always means
// the same thing across the dashboard.
const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "var(--muted)",
  paid: "var(--success)",
  processing: "var(--foreground)",
  shipped: "var(--foreground)",
  delivered: "var(--success)",
  cancelled: "var(--danger)",
  refunded: "var(--danger)",
};

// A bar with rounded top corners and a square baseline (per mark spec: the
// data-end is rounded, the end anchored to the baseline stays square).
function barPath(x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, height, width / 2);
  if (height <= 0) return "";
  return `M${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${
    x + width
  },${y} ${x + width},${y + r} L${x + width},${y + height} Z`;
}

export default function OrdersByStatusChart({ counts }: { counts: Record<OrderStatus, number> }) {
  const [hovered, setHovered] = useState<OrderStatus | null>(null);

  const statuses = Object.keys(STATUS_COLOR) as OrderStatus[];
  const maxCount = Math.max(1, ...statuses.map((s) => counts[s] ?? 0));

  const bandWidth = INNER_W / statuses.length;
  const barWidth = Math.min(BAR_MAX_WIDTH, bandWidth - GAP * 2);

  const bars = useMemo(
    () =>
      statuses.map((status, i) => {
        const count = counts[status] ?? 0;
        const barHeight = (count / maxCount) * INNER_H;
        const x = PAD_LEFT + bandWidth * i + (bandWidth - barWidth) / 2;
        const y = PAD_TOP + INNER_H - barHeight;
        return { status, count, x, y, height: barHeight };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [counts, maxCount, bandWidth, barWidth],
  );

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-auto" role="img" aria-label="Orders by status">
      <line
        x1={PAD_LEFT}
        x2={VIEW_W - PAD_RIGHT}
        y1={PAD_TOP + INNER_H}
        y2={PAD_TOP + INNER_H}
        stroke="var(--border)"
        strokeWidth={1}
      />

      {bars.map((bar) => (
        <g
          key={bar.status}
          onPointerEnter={() => setHovered(bar.status)}
          onPointerLeave={() => setHovered(null)}
          style={{ cursor: "default" }}
        >
          <path
            d={barPath(bar.x, bar.y, barWidth, Math.max(bar.height, bar.count > 0 ? 2 : 0), 4)}
            fill={STATUS_COLOR[bar.status]}
            opacity={hovered === null || hovered === bar.status ? 1 : 0.5}
          />
          <text
            x={bar.x + barWidth / 2}
            y={bar.y - 6}
            textAnchor="middle"
            fontSize={11}
            fill="var(--foreground)"
          >
            {bar.count}
          </text>
          <text
            x={bar.x + barWidth / 2}
            y={PAD_TOP + INNER_H + 16}
            textAnchor="middle"
            fontSize={9}
            fill="var(--muted)"
            className="uppercase"
          >
            {bar.status}
          </text>
        </g>
      ))}
    </svg>
  );
}
