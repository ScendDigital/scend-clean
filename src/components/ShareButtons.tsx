"use client";
import React from "react";
export default function ShareButtons(props: { getText?: () => string }) {
  const onShareWhatsApp = () => {
    const txt = encodeURIComponent(props.getText?.() || (typeof window !== "undefined" ? window.location.href : ""));
    window.open(`https://wa.me/?text=${txt}`, "_blank", "noopener,noreferrer");
  };
  const onShareEmail = () => {
    const subject = encodeURIComponent("My results from Scend");
    const body = encodeURIComponent(props.getText?.() || (typeof window !== "undefined" ? window.location.href : ""));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  return (
    <div className="mt-6 flex gap-3">
      <button onClick={onShareWhatsApp} className="rounded-2xl border px-5 py-2 font-semibold hover:shadow">Share via WhatsApp</button>
      <button onClick={onShareEmail} className="rounded-2xl border px-5 py-2 font-semibold hover:shadow">Share via Email</button>
    </div>
  );
}
