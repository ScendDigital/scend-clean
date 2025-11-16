"use client";

import { useState } from "react";

type Props = {
  message?: string;
  className?: string;
};

export default function ShareBar({ message, className }: Props) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const shareText = message ?? "Check this UIF estimate I generated on Scend:";
  const waHref = `https://wa.me/?text=${encodeURIComponent(shareText + " " + url)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent("UIF Estimate (Scend)")}&body=${encodeURIComponent(shareText + "\n\n" + url)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  async function tryNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "UIF Estimate — Scend", text: shareText, url });
      } catch { /* user cancelled */ }
    } else {
      window.open(waHref, "_blank");
    }
  }

  const baseBtn = "px-3 py-2 rounded-2xl text-sm transition border";
  const pinkBtn = baseBtn + " bg-pink-500 text-white hover:bg-pink-600 border-pink-500";
  const ghostBtn = baseBtn + " hover:bg-gray-100 border-gray-300";

  return (
    <div className={ "flex flex-wrap items-center gap-2 " + (className ?? "") }>
      <button className={pinkBtn} onClick={tryNativeShare}>Share</button>
      <a className={ghostBtn} href={waHref} target="_blank" rel="noreferrer">WhatsApp</a>
      <a className={ghostBtn} href={mailHref}>Email</a>
      <button className={ghostBtn} onClick={copyLink}>{copied ? "Copied!" : "Copy Link"}</button>
    </div>
  );
}
