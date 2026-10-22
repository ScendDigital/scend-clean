"use client";

import { useState } from "react";

type Props = { title: string; resultSelector: string; disabled: boolean };

export default function ResultShareButton({ title, resultSelector, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  function makeShareUrl() {
    const node = document.querySelector(resultSelector);
    const summary = node instanceof HTMLElement ? node.innerText.trim() : "";
    if (!summary) { setMessage("Calculate a result before sharing."); return ""; }
    const bytes = new TextEncoder().encode(JSON.stringify({ title, summary }));
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
    const encoded = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    return `${window.location.origin}${window.location.pathname}#scend-result=${encoded}`;
  }

  async function copyLink() {
    if (disabled) return;
    const url = makeShareUrl();
    if (!url) return;
    try { await navigator.clipboard.writeText(url); setMessage("Result link copied."); }
    catch { window.prompt("Copy this result link:", url); }
  }

  function shareWhatsApp() {
    if (disabled) return;
    const url = makeShareUrl();
    if (url) window.open(`https://wa.me/?text=${encodeURIComponent(`${title} result\n${url}`)}`, "_blank", "noopener,noreferrer");
  }

  function shareEmail() {
    if (disabled) return;
    const url = makeShareUrl();
    if (url) window.location.href = `mailto:?subject=${encodeURIComponent(`${title} result`)}&body=${encodeURIComponent(`View this saved calculation:\n${url}`)}`;
  }

  async function shareMore() {
    if (disabled) return;
    const url = makeShareUrl();
    if (!url) return;
    if (!navigator.share) return copyLink();
    try { await navigator.share({ title: `${title} result`, text: "View this saved Scend calculation.", url }); }
    catch (error) { if (error instanceof Error && error.name !== "AbortError") setMessage("Use WhatsApp, Email, or Copy result link."); }
  }

  return (
    <span className="relative inline-flex flex-col items-start gap-1">
      <button type="button" onClick={() => setOpen((value) => !value)} disabled={disabled} title={disabled ? "Calculate first" : "Share this result"}
        className="glow rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
        Share
      </button>
      {open && !disabled && (
        <span className="absolute left-0 top-full z-20 mt-2 flex min-w-44 flex-col gap-1 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          <button type="button" onClick={shareWhatsApp} className="rounded-lg px-3 py-2 text-left text-sm hover:bg-pink-50">WhatsApp</button>
          <button type="button" onClick={shareEmail} className="rounded-lg px-3 py-2 text-left text-sm hover:bg-pink-50">Email</button>
          <button type="button" onClick={copyLink} className="rounded-lg px-3 py-2 text-left text-sm hover:bg-pink-50">Copy result link</button>
          <button type="button" onClick={shareMore} className="rounded-lg px-3 py-2 text-left text-sm hover:bg-pink-50">More sharing options</button>
        </span>
      )}
      {message && <span role="status" className="text-xs text-pink-700">{message}</span>}
    </span>
  );
}