"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades + lifts its children into view once, the first time they enter the
 * viewport. Reuses the shared `fadeInUp` keyframe (globals.css) so the whole
 * site speaks one motion language. Reduced-motion is handled in globals.css
 * (the `.reveal-init` hidden state is forced visible, the animation disabled).
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback: if the API is unavailable, reveal on the next frame (deferred
    // so we never call setState synchronously inside the effect body).
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect(); // once only — never re-animate
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${visible ? "" : "reveal-init"} ${className ?? ""}`.trim()}
      style={
        visible
          ? {
              animation: `fadeInUp ${duration}s ease-out both`,
              animationDelay: delay ? `${delay}ms` : undefined,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
