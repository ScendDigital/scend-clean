"use client";

import React, { useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  company: string; // honeypot
};

type Status = "idle" | "sending" | "ok" | "error";

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
    company: "",
  });

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    if (form.company.trim().length > 0) {
      setStatus("ok");
      setForm({ name: "", email: "", phone: "", message: "", company: "" });
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error || `Request failed: ${res.status}`);
      }

      setStatus("ok");
      setForm({ name: "", email: "", phone: "", message: "", company: "" });
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Something went wrong");
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-pink-600 mb-6 text-center">Contact Us</h1>

      <form onSubmit={onSubmit} className="grid gap-4">
        {/* Honeypot */}
        <input
          type="text"
          name="company"
          value={form.company}
          onChange={onChange}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div>
          <label className="mb-1 block text-sm font-medium">Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full rounded-xl border p-3 outline-none"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="w-full rounded-xl border p-3 outline-none"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            className="w-full rounded-xl border p-3 outline-none"
            placeholder="+27 ..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={onChange}
            className="w-full rounded-xl border p-3 outline-none min-h-[160px] resize-y"
            placeholder="How can we help?"
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className={
            "rounded-2xl px-5 py-3 font-semibold border shadow-sm " +
            (status === "sending"
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-pink-600 text-white hover:bg-pink-700")
          }
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>

        {status === "ok" && (
          <p className="text-green-600 text-sm">Thanks! Your message has been sent.</p>
        )}
        {status === "error" && (
          <p className="text-red-600 text-sm">Could not send message: {error}</p>
        )}
      </form>
    </main>
  );
}
