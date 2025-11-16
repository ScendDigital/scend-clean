"use client";
import React from "react";

export default function ShareButtons({
  text = "Check this out from Scend:",
}: { text?: string }) {
  const [copied, setCopied] = React.useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const wa = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={copy}
        className={"rounded-2xl px-4 py-2 font-semibold border " + (copied ? "bg-green-100 text-green-700" : "bg-white text-gray-800 hover:bg-pink-50")}
        aria-live="polite"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>

      <a
        href={wa}
        target="_blank"
        rel="noopener"
        className="rounded-2xl px-4 py-2 bg-pink-600 text-white font-semibold hover:bg-pink-700"
      >
        Share WhatsApp
      </a>
    </div>
  );
}
