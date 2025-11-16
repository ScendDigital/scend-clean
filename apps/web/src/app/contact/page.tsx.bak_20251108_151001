"use client";
import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("idle");

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch("https://formspree.io/f/mvgvpvve", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      form.reset();
      setStatus("ok");
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-100"><h1 className="text-3xl font-semibold text-pink-600 mb-4">Contact Us</h1><form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="_subject" value="Scend Website: New Contact" />
      <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input name="name" required className="mt-1 w-full rounded-xl border p-3" placeholder="Your name" />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input name="_replyto" type="email" required className="mt-1 w-full rounded-xl border p-3" placeholder="you@example.com" />
      </div>

      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input name="phone" className="mt-1 w-full rounded-xl border p-3" placeholder="+27 6X XXX XXXX" />
      </div>

      <div>
        <label className="block text-sm font-medium">Message</label>
        <textarea name="message" required rows={5} className="mt-1 w-full rounded-xl border p-3" placeholder="How can we help?" />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-2xl bg-pink-600 px-6 py-3 text-white disabled:opacity-70"
      >
        {status === "sending" ? "SendingÃƒ¯¿½" : "Send Message"}
      </button>

      {status === "ok" && (
        <p className="text-green-600 text-sm">Thanks! Your message has been sent.</p>
      )}
      {status === "error" && (
        <p className="text-red-600 text-sm">Sorry, something went wrong. Please try again.</p>
      )}
    </form></div>
  );
}



