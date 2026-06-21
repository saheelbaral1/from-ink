"use client";

import { useMemo } from "react";

// Brand palette only — no neon. A soft, editorial celebration.
const COLORS = [
  "var(--color-terracotta)",
  "var(--color-sage)",
  "var(--color-navy)",
];

// Deterministic pseudo-random in [0,1) from a seed — keeps render pure (no
// Math.random) while still scattering the particles in a varied-looking way.
function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * A one-shot particle burst emanating from its container's centre. Mount it
 * (keyed, so it remounts to replay) when something worth celebrating happens —
 * here, a finished keepsake. Purely decorative + pointer-events-none, so it
 * never interferes with the real UI underneath. Under reduced-motion the CSS
 * guard disables the animation, leaving the particles at opacity:0 (invisible).
 */
export default function Burst({ count = 22 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + (seeded(i) - 0.5) * 0.45;
        const distance = 55 + seeded(i + 7) * 75;
        return {
          key: i,
          tx: Math.cos(angle) * distance,
          ty: Math.sin(angle) * distance,
          size: 5 + seeded(i + 13) * 6,
          color: COLORS[i % COLORS.length],
          delay: seeded(i + 23) * 120,
          duration: 720 + seeded(i + 31) * 420,
        };
      }),
    [count],
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-visible"
    >
      {particles.map((p) => (
        <span
          key={p.key}
          className="absolute rounded-full"
          style={
            {
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              opacity: 0,
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
              animation: `burst ${p.duration}ms ${p.delay}ms cubic-bezier(0.2, 0.8, 0.3, 1) forwards`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
