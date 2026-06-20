"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { CornerDownLeft } from "lucide-react";

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
  const frameRef = useRef<HTMLDivElement>(null);

  const active = pairs[index];
  const thumbnails = pairs
    .map((pair, i) => ({ ...pair, i }))
    .filter((pair) => pair.i !== index);

  function selectIndex(i: number) {
    setIndex(i);
    setPosition(DEFAULT_POSITION);
  }

  const updateFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
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
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - step));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + step));
    if (e.key === "Home") setPosition(0);
    if (e.key === "End") setPosition(100);
  }

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
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
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
            style={{ left: `${position}%` }}
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
              className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white shadow-paper ring-1 ring-navy/10 focus-visible:outline-2 focus-visible:outline-terracotta"
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

      {/* Dot indicators */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
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

      {/* Thumbnails + handwritten caption */}
      <div className="mt-5 flex items-end justify-center gap-4">
        <div className="flex gap-3">
          {thumbnails.map((pair) => (
            <button
              key={pair.before}
              type="button"
              onClick={() => selectIndex(pair.i)}
              aria-label={`View ${pair.alt} example`}
              className="relative flex h-14 w-14 overflow-hidden rounded-lg ring-1 ring-navy/10 transition hover:ring-navy/40 sm:h-16 sm:w-16"
            >
              <span className="relative h-full w-1/2 overflow-hidden">
                <Image src={pair.before} alt="" fill sizes="32px" className="object-cover" />
              </span>
              <span className="relative h-full w-1/2 overflow-hidden">
                <Image src={pair.after} alt="" fill sizes="32px" className="object-cover" />
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-col items-start pb-0.5">
          <CornerDownLeft className="mb-1 h-4 w-4 -rotate-12 text-terracotta/70" strokeWidth={2} />
          <p className="font-hand text-lg leading-tight text-navy/70 sm:text-xl">
            See the magic
            <br />
            for yourself
          </p>
        </div>
      </div>
    </div>
  );
}
