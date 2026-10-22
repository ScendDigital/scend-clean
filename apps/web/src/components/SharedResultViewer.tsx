"use client";

import { useEffect, useState } from "react";

type SharedResult = { title: string; summary: string };

export default function SharedResultViewer() {
  const [result, setResult] = useState<SharedResult | null>(null);
  useEffect(() => {
    const match = window.location.hash.match(/^#scend-result=([A-Za-z0-9_-]+)$/);
    if (!match) return;
    try {
      let base64 = match[1].replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) base64 += "=";
      const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
      const payload = JSON.parse(new TextDecoder().decode(bytes)) as SharedResult;
      if (typeof payload.title === "string" && typeof payload.summary === "string") setResult(payload);
    } catch { setResult(null); }
  }, []);
  if (!result) return null;
  return (
    <section className="mx-auto mb-6 w-full max-w-5xl rounded-2xl border border-pink-200 bg-pink-50 p-5 shadow-sm" aria-label="Shared calculation result">
      <h2 className="text-lg font-bold text-pink-700">Shared {result.title} result</h2>
      <p className="mt-1 text-sm text-gray-700">Saved calculation result</p>
      <pre className="mt-4 whitespace-pre-wrap break-words rounded-xl bg-white p-4 font-sans text-sm leading-relaxed text-gray-800">{result.summary}</pre>
      <p className="mt-3 text-xs text-gray-600">This link contains the result summary. It does not recalculate or change the original inputs.</p>
    </section>
  );
}