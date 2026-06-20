"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Lock, Check, RefreshCw } from "lucide-react";

type Stage = "upload" | "generating" | "preview" | "order";

const STEPS = ["Upload", "Preview", "Order"] as const;

// Which visual step each internal stage maps to (generating is still "Preview").
const STAGE_STEP: Record<Stage, number> = {
  upload: 0,
  generating: 1,
  preview: 1,
  order: 2,
};

const GENERATING_MESSAGES = [
  "Studying the drawing…",
  "Choosing the palette…",
  "Bringing the lines to life…",
  "Adding the finishing touches…",
];

const MAX_RETRIES = 3;
const PRICE_LABEL = "€39";

// Tiled, low-opacity diagonal watermark, built as an inline SVG so it overlays
// the preview without touching the underlying image file. pointer-events-none.
const WATERMARK_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>` +
    `<defs><pattern id='w' width='250' height='150' patternUnits='userSpaceOnUse' patternTransform='rotate(-30)'>` +
    `<text x='8' y='80' font-family='sans-serif' font-size='14' font-weight='600' letter-spacing='1.5' fill='#1c1c1c' fill-opacity='0.14'>FROM.INK — PREVIEW</text>` +
    `</pattern></defs>` +
    `<rect width='100%' height='100%' fill='url(#w)'/></svg>`,
);
const watermarkStyle = {
  backgroundImage: `url("data:image/svg+xml,${WATERMARK_SVG}")`,
};

const ctaClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-8 py-4 text-base font-medium text-paper shadow-[0_10px_24px_-12px_rgba(72,84,106,0.8)] transition hover:bg-navy/90 disabled:cursor-not-allowed disabled:bg-navy/30 disabled:shadow-none";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function UploadWizard() {
  const [stage, setStage] = useState<Stage>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [storageUrl, setStorageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [retriesLeft, setRetriesLeft] = useState(MAX_RETRIES);
  const [msgIndex, setMsgIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Cycle the narrative copy while generating — independent of real API timing,
  // settling on the final line if the call runs long. No spinner.
  // (msgIndex is reset to 0 in runGenerate when the stage flips to "generating".)
  useEffect(() => {
    if (stage !== "generating") return;
    const id = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, GENERATING_MESSAGES.length - 1));
    }, 2500);
    return () => clearInterval(id);
  }, [stage]);

  function acceptFile(file: File | undefined | null) {
    if (!file) return;
    setSelectedFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setStorageUrl(null);
    setError(null);
    setRetriesLeft(MAX_RETRIES);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  }

  async function runGenerate(origin: Stage) {
    if (!selectedFile) return;
    setError(null);
    setMsgIndex(0);
    setStage("generating");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("/api/generate", { method: "POST", body: formData });
      const json = (await res.json()) as { storageUrl?: string; error?: string };

      if (!res.ok || !json.storageUrl) {
        throw new Error(json.error ?? `Server error ${res.status}`);
      }

      setStorageUrl(json.storageUrl);
      setStage("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      // Surface the error in the stage the generation was launched from.
      setStage(origin);
    }
  }

  function handleRetry() {
    if (retriesLeft <= 0) return;
    setRetriesLeft((n) => n - 1);
    runGenerate("preview");
  }

  function handleStartOver() {
    setStage("upload");
    setSelectedFile(null);
    setOriginalUrl(null);
    setStorageUrl(null);
    setError(null);
    setRetriesLeft(MAX_RETRIES);
    setEmail("");
  }

  async function handleContinue() {
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setProcessing(true);
    setError(null);

    try {
      // Best-effort email capture — never block checkout on its result.
      await fetch("/api/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, imageUrl: storageUrl }),
      }).catch(() => {});

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: storageUrl }),
      });
      const json = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !json.url) {
        throw new Error(json.error ?? `Checkout error ${res.status}`);
      }

      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setProcessing(false);
    }
  }

  const currentStep = STAGE_STEP[stage];

  return (
    <div className="flex w-full flex-col">
      {/* Step indicator */}
      <ol className="mb-8 flex items-center justify-center gap-3 font-body text-[11px] font-semibold uppercase tracking-[0.18em]">
        {STEPS.map((label, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <li key={label} className="flex items-center gap-3">
              <span
                className={`flex items-center gap-1.5 ${
                  active ? "text-navy" : done ? "text-sage" : "text-navy/35"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    active
                      ? "bg-navy text-paper"
                      : done
                        ? "bg-sage text-paper"
                        : "bg-navy/10 text-navy/40"
                  }`}
                >
                  {done ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                </span>
                {label}
              </span>
              {i < STEPS.length - 1 && <span className="h-px w-6 bg-navy/15" aria-hidden />}
            </li>
          );
        })}
      </ol>

      {/* Stage content — re-keyed so the fade-up replays on each transition */}
      <div key={stage} style={{ animation: "fadeInUp 0.4s ease-out" }}>
        {stage === "upload" && (
          <div className="flex flex-col">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-navy/60">
              Your drawing
            </span>

            {selectedFile && originalUrl ? (
              <div className="mt-4 flex flex-col items-center gap-4">
                <div className="-rotate-2 bg-white p-2 shadow-paper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={originalUrl}
                    alt="Your uploaded drawing"
                    className="max-h-64 w-full object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="font-body text-sm text-navy/60 underline underline-offset-4 transition hover:text-navy"
                >
                  Change photo
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`mt-4 w-full rounded-2xl border border-dashed p-10 text-center transition ${
                  dragging
                    ? "border-navy/60 bg-navy/[0.04]"
                    : "border-navy/25 bg-paper hover:border-navy/50 hover:bg-navy/[0.02]"
                }`}
              >
                <ImagePlus className="mx-auto mb-3 h-9 w-9 text-navy" strokeWidth={1.5} />
                <p className="font-body font-medium text-ink">
                  Drop a drawing here, or click to browse
                </p>
                <p className="mt-1 font-body text-sm text-navy/60">
                  The whole drawing, clearly visible
                </p>
                <p className="mt-4 inline-flex items-center gap-1.5 font-body text-xs text-navy/50">
                  <Lock className="h-3 w-3" strokeWidth={2} />
                  Your photos stay private — used only to create your keepsake
                </p>
              </button>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />

            <button
              onClick={() => runGenerate("upload")}
              disabled={!selectedFile}
              className={`mt-6 ${ctaClass}`}
            >
              Transform a Drawing
            </button>

            {error && <ErrorNote message={error} />}
          </div>
        )}

        {stage === "generating" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            {/* Calm breathing watercolor blob — no spinner */}
            <div className="relative mb-8 h-24 w-24">
              <div
                className="absolute inset-0 rounded-full bg-sage blur-2xl"
                style={{ animation: "breathe 4s ease-in-out infinite" }}
              />
              <div
                className="absolute inset-3 rounded-full bg-sage/60 blur-xl"
                style={{ animation: "breathe 4s ease-in-out infinite", animationDelay: "0.6s" }}
              />
            </div>
            <p className="font-display text-2xl italic text-navy md:text-3xl">
              {GENERATING_MESSAGES[msgIndex]}
            </p>
            <p className="mt-3 font-body text-sm text-navy/45">This usually takes under a minute.</p>
          </div>
        )}

        {stage === "preview" && (
          <div className="flex w-full flex-col">
            <div className="grid grid-cols-1 items-start gap-10 sm:grid-cols-2">
              {/* Original */}
              <figure className="flex flex-col items-center gap-3">
                <span className="font-body text-[11px] font-semibold uppercase tracking-widest text-navy/50">
                  Original
                </span>
                {originalUrl && (
                  <div className="-rotate-2 bg-white p-2 shadow-paper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={originalUrl}
                      alt="Original drawing"
                      className="max-h-80 w-full object-contain"
                    />
                  </div>
                )}
              </figure>

              {/* Styled result — watermarked, rendered as a background so the
                  raw image isn't trivially right-click-saved from the preview. */}
              <figure className="flex flex-col items-center gap-3">
                <span className="font-body text-[11px] font-semibold uppercase tracking-widest text-navy/50">
                  Your poster · preview
                </span>
                {storageUrl && (
                  <div className="rotate-2 bg-white p-2 shadow-paper">
                    <div
                      className="relative aspect-[4/5] w-56 select-none bg-cover bg-center"
                      style={{ backgroundImage: `url("${storageUrl}")` }}
                      role="img"
                      aria-label="Watermarked preview of your styled poster"
                    >
                      <div className="absolute inset-0 pointer-events-none" style={watermarkStyle} />
                    </div>
                  </div>
                )}
              </figure>
            </div>

            {/* Retry affordance */}
            <div className="mt-8 text-center">
              {retriesLeft > 0 ? (
                <p className="font-body text-sm text-navy/60">
                  Not quite right?{" "}
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1 font-medium text-navy underline underline-offset-4 transition hover:text-navy/70"
                  >
                    <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
                    Retry
                  </button>{" "}
                  <span className="text-navy/45">
                    ({retriesLeft} free {retriesLeft === 1 ? "retry" : "retries"} left)
                  </span>
                </p>
              ) : (
                <p className="mx-auto max-w-md font-body text-sm text-navy/45">
                  No more free retries — but you can still order this version, or start over with a
                  new photo.
                </p>
              )}
            </div>

            {/* Order CTA */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                onClick={() => setStage("order")}
                className={`max-w-sm ${ctaClass}`}
              >
                Order Print — {PRICE_LABEL}
              </button>
              <button
                type="button"
                onClick={handleStartOver}
                className="font-body text-xs text-navy/45 underline underline-offset-4 transition hover:text-navy/70"
              >
                Start over with a new photo
              </button>
            </div>

            {error && <ErrorNote message={error} />}
          </div>
        )}

        {stage === "order" && (
          <div className="mx-auto flex w-full max-w-md flex-col">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-navy/60">
              Almost there
            </span>

            <label htmlFor="wizard-email" className="mt-4 font-body text-sm font-medium text-ink">
              Email address
            </label>
            <input
              id="wizard-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-navy/20 bg-paper px-4 py-3 font-body text-base text-ink outline-none transition placeholder:text-navy/35 focus:border-navy/50"
            />
            <p className="mt-1.5 font-body text-xs text-navy/50">
              We&apos;ll send your order confirmation here.
            </p>

            {/* Order summary */}
            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-navy/10 bg-paper p-4">
              {storageUrl && (
                <div
                  className="relative aspect-[4/5] w-14 shrink-0 select-none overflow-hidden rounded-md bg-cover bg-center ring-1 ring-navy/10"
                  style={{ backgroundImage: `url("${storageUrl}")` }}
                  role="img"
                  aria-label="Watermarked preview thumbnail"
                >
                  <div className="absolute inset-0 pointer-events-none" style={watermarkStyle} />
                </div>
              )}
              <div className="flex-1">
                <p className="font-body text-sm font-medium text-ink">
                  Classic Matte Poster, 40×50cm
                </p>
                <p className="font-body text-xs text-navy/55">
                  Printed on premium paper · shipped to your door
                </p>
              </div>
              <span className="font-body text-base font-semibold text-ink">{PRICE_LABEL}</span>
            </div>

            <button
              onClick={handleContinue}
              disabled={processing}
              className={`mt-6 ${ctaClass}`}
            >
              {processing ? "Processing…" : "Continue to Payment"}
            </button>
            <p className="mt-3 text-center font-body text-xs text-navy/50">
              Secure payment via Stripe · Free preview, pay only when you&apos;re happy
            </p>

            <button
              type="button"
              onClick={() => setStage("preview")}
              className="mt-4 self-center font-body text-xs text-navy/45 underline underline-offset-4 transition hover:text-navy/70"
            >
              Back to preview
            </button>

            {error && <ErrorNote message={error} />}
          </div>
        )}
      </div>
    </div>
  );
}

function ErrorNote({ message }: { message: string }) {
  return (
    <div className="mt-5 w-full rounded-xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-center font-body text-sm text-terracotta">
      {message}
    </div>
  );
}
