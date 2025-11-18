"use client";

import React, { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiSend,
} from "react-icons/fi";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget as HTMLFormElement;

    // ✅ FIXED — Correct TypeScript typing for form fields
    const data = {
      name:
        (form.elements.namedItem("name") as HTMLInputElement)?.value.trim() ||
        "",
      email:
        (form.elements.namedItem("email") as HTMLInputElement)?.value.trim() ||
        "",
      phone:
        (form.elements.namedItem("phone") as HTMLInputElement)?.value.trim() ||
        "",
      message:
        (form.elements.namedItem("message") as HTMLTextAreaElement)?.value.trim() ||
        "",
    };

    const response = await fetch("https://formspree.io/f/mvgvpvve", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setSent(true);
      form.reset();
    } else {
      alert("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-16 bg-gradient-to-b from-pink-50 via-white to-pink-50/40">

      {/* MAIN CARD */}
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-2xl border border-pink-200 rounded-3xl shadow-[0_8px_40px_rgba(236,72,153,0.25)] p-10 animate-fadeIn">

        <h1 className="text-4xl font-extrabold text-center mb-2 text-pink-600 tracking-tight drop-shadow-sm">
          Contact Us
        </h1>

        <p className="text-center text-gray-600 mb-8 text-sm">
          We’re here to assist you. Please share your message below.
        </p>

        {sent && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl text-center font-medium">
            Thank you! Your message has been sent.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* FULL NAME */}
          <div>
            <label className="block font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FiUser className="text-pink-600" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter your full name"
              className="w-full p-4 bg-white/70 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition shadow-sm"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FiMail className="text-pink-600" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full p-4 bg-white/70 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition shadow-sm"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FiPhone className="text-pink-600" /> Phone Number
            </label>
            <input
              type="text"
              name="phone"
              placeholder="+27 6X XXX XXXX"
              className="w-full p-4 bg-white/70 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition shadow-sm"
            />
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FiMessageSquare className="text-pink-600" /> Your Message
            </label>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="How can we help?"
              className="w-full p-4 bg-white/70 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition shadow-sm resize-none"
            ></textarea>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-pink-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-pink-700 hover:shadow-pink-500/40 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Sending..."
            ) : (
              <span className="flex items-center gap-2">
                <FiSend /> Send Message
              </span>
            )}
          </button>
        </form>
      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.45s ease-out;
        }
      `}</style>
    </div>
  );
}
