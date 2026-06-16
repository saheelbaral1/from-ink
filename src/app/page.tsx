"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [storageUrl, setStorageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setStorageUrl(null);
    setError(null);
  }

  async function handleGenerate() {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setStorageUrl(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("/api/generate", { method: "POST", body: formData });
      const json = (await res.json()) as { storageUrl?: string; error?: string };

      if (!res.ok || !json.storageUrl) {
        throw new Error(json.error ?? `Server error ${res.status}`);
      }

      setStorageUrl(json.storageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout() {
    if (!storageUrl) return;
    setCheckingOut(true);
    setError(null);

    try {
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
      setCheckingOut(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-stone-900">
          From<span className="text-amber-500">.ink</span>
        </h1>
        <p className="mt-2 text-stone-500 text-lg">
          Turn your child&apos;s drawing into a storybook illustration
        </p>
      </header>

      {/* Upload area */}
      <div
        className="w-full max-w-md border-2 border-dashed border-amber-300 rounded-2xl p-8 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-100 transition"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {selectedFile ? (
          <p className="text-stone-600 font-medium">{selectedFile.name}</p>
        ) : (
          <>
            <div className="text-4xl mb-2">🖼️</div>
            <p className="text-stone-500">Click to upload a drawing</p>
            <p className="text-stone-400 text-sm mt-1">PNG, JPG, WEBP up to 10 MB</p>
          </>
        )}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!selectedFile || loading}
        className="mt-6 px-8 py-3 rounded-full bg-amber-500 text-white font-semibold text-lg shadow hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        {loading ? "Generating…" : "Generate"}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 max-w-md w-full text-sm">
          {error}
        </div>
      )}

      {/* Before / After */}
      {(originalUrl || storageUrl || loading) && (
        <div className="mt-10 w-full max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">Original</span>
              {originalUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={originalUrl}
                  alt="Original drawing"
                  className="rounded-xl shadow-md w-full object-contain max-h-96 bg-white"
                />
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">Styled Result</span>
              {loading && (
                <div className="w-full rounded-xl bg-amber-100 animate-pulse flex items-center justify-center h-64">
                  <p className="text-amber-400 text-sm">Working on it…</p>
                </div>
              )}
              {storageUrl && !loading && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={storageUrl}
                  alt="Styled result"
                  className="rounded-xl shadow-md w-full object-contain max-h-96 bg-white"
                />
              )}
              {!storageUrl && !loading && (
                <div className="w-full rounded-xl border-2 border-dashed border-stone-200 flex items-center justify-center h-64">
                  <p className="text-stone-300 text-sm">Result will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Order button — shown after successful generation */}
          {storageUrl && (
            <div className="mt-8 flex flex-col items-center gap-2">
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="px-10 py-4 rounded-full bg-stone-900 text-white font-semibold text-lg shadow-lg hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {checkingOut ? "Redirecting…" : "Order Print — €29"}
              </button>
              <p className="text-stone-400 text-sm">Printed on premium paper · shipped to your door</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
