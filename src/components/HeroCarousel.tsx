"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const pairs = [
  {
    before: "/images/dragon-knight-before.png",
    after: "/images/dragon-knight-after.jpeg",
    alt: "a dragon and knight",
  },
  {
    before: "/images/house-before.png",
    after: "/images/house-after.jpeg",
    alt: "a house",
  },
  {
    before: "/images/unicorn-before.png",
    after: "/images/unicorn-after.jpeg",
    alt: "a unicorn with a rainbow",
  },
  {
    before: "/images/rocket-before.png",
    after: "/images/rocket-after.jpeg",
    alt: "a rocket in space",
  },
];

// Resting a quarter open (rather than centered) gives a peek of the original
// drawing without giving the reveal away — it reads as an invitation to drag.
const DEFAULT_POSITION = 25;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [dragging, setDragging] = useState(false);
  // While true, the handle/clip animate smoothly — used only for the first-load
  // "nudge" hint, switched off so real dragging stays instant.
  const [hinting, setHinting] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const interacted = useRef(false);

  const active = pairs[index];

  // First-load hint: ease the handle right and back a couple of times to signal
  // it's draggable. Cancels on any interaction; skipped under reduced-motion.
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(
      setTimeout(() => {
        if (interacted.current) return;
        setHinting(true);
        const seq: [number, number][] = [
          [0, 38],
          [450, DEFAULT_POSITION],
          [720, 31],
          [1080, DEFAULT_POSITION],
        ];
        seq.forEach(([t, val]) =>
          timers.push(
            setTimeout(() => {
              if (!interacted.current) setPosition(val);
            }, t),
          ),
        );
        timers.push(setTimeout(() => setHinting(false), 1500));
      }, 1100),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  function stopHint() {
    interacted.current = true;
    setHinting(false);
  }

  function selectIndex(i: number) {
    stopHint();
    setIndex(i);
    setPosition(DEFAULT_POSITION);
  }

  function prev() {
    selectIndex((index - 1 + pairs.length) % pairs.length);
  }

  function next() {
    selectIndex((index + 1) % pairs.length);
  }

  const updateFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    stopHint();
    setDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    setDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") {
      stopHint();
      setPosition((p) => Math.max(0, p - step));
    }
    if (e.key === "ArrowRight") {
      stopHint();
      setPosition((p) => Math.min(100, p + step));
    }
    if (e.key === "Home") {
      stopHint();
      setPosition(0);
    }
    if (e.key === "End") {
      stopHint();
      setPosition(100);
    }
  }

  // Smooth easing only during the hint; instant the rest of the time.
  const hintTransition = hinting ? "350ms ease-in-out" : undefined;

  return (
    <div id="hero-carousel" className="w-full">
      {/* Main before/after slider */}
      <div className="relative mx-auto w-full max-w-[480px] rounded-2xl bg-white p-2 shadow-paper ring-1 ring-navy/10 sm:p-3">
        <div
          ref={frameRef}
          className="relative aspect-[4/5] w-full touch-none select-none overflow-hidden rounded-xl"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* AFTER — base layer, full frame */}
          <Image
            src={active.after}
            alt={`AI watercolor artwork of ${active.alt}`}
            fill
            priority={index === 0}
            sizes="480px"
            className="object-cover"
          />
          <span className="absolute right-3 top-3 z-10 rounded-md bg-paper/90 px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-wide text-navy/70 shadow-sm">
            Your Poster
          </span>

          {/* BEFORE — clipped top layer, revealed left of the handle */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              clipPath: `inset(0 ${100 - position}% 0 0)`,
              transition: hintTransition ? `clip-path ${hintTransition}` : undefined,
            }}
          >
            <Image
              src={active.before}
              alt={`Original drawing of ${active.alt}`}
              fill
              priority={index === 0}
              sizes="480px"
              className="object-cover"
            />
            <span className="absolute left-3 top-3 rounded-md bg-paper/90 px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-wide text-navy/70 shadow-sm">
              Original drawing
            </span>
          </div>

          {/* Drag handle */}
          <div
            className="absolute bottom-0 top-0 z-20 w-0 -translate-x-1/2"
            style={{
              left: `${position}%`,
              transition: hintTransition ? `left ${hintTransition}` : undefined,
            }}
          >
            <div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-white/90 blur-[0.4px] shadow-[0_0_14px_3px_rgba(255,255,255,0.65)]" />
            <div
              role="slider"
              tabIndex={0}
              aria-label="Reveal more or less of the original drawing vs the AI artwork"
              aria-valuenow={Math.round(position)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-orientation="horizontal"
              onKeyDown={onKeyDown}
              className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white shadow-paper ring-1 ring-navy/10 transition duration-200 focus-visible:outline-2 focus-visible:outline-terracotta"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M4 3 1 7l3 4M10 3l3 4-3 4"
                  stroke="#1C1C1C"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Pair navigation — subtle soft arrows flanking the dots */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous example"
          className="flex h-7 w-7 items-center justify-center rounded-full text-navy/35 transition hover:bg-navy/5 hover:text-navy/70"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>

        <div className="flex items-center gap-1.5">
          {pairs.map((pair, i) => (
            <button
              key={pair.before}
              type="button"
              onClick={() => selectIndex(i)}
              aria-label={`Go to example ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-navy" : "w-1.5 bg-navy/25"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next example"
          className="flex h-7 w-7 items-center justify-center rounded-full text-navy/35 transition hover:bg-navy/5 hover:text-navy/70"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
