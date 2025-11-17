"use client";

import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiMessageSquare, FiSend } from "react-icons/fi";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // ⭐ Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value,
    };

    const response = await fetch("https://formspree.io/f/mvgvpvve", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setSent(true);
      form.reset();
    } else alert("Something went wrong.");

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-16 bg-gradient-to-b from-white via-pink-50/40 to-white">

      {/* PREMIUM SCEND PINK CONTAINER WITH ROUNDED CORNERS */}
      <div className="
        w-full max-w-3xl
        bg-gradient-to-br from-pink-50 via-white to-pink-100/70
        backdrop-blur-xl
        border border-pink-200
        rounded-[40px]
        shadow-[0_8px_30px_rgba(236,72,153,0.25)]
        p-10
      ">

        <h1 className="text-4xl font-extrabold text-center mb-2 text-pink-600 tracking-tight">
          Contact Us
        </h1>

        <p className="text-center text-gray-600 mb-8 text-sm">
          We’re here to assist you. Kindly share your details below.
        </p>

        {sent && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl text-center font-medium">
            Thank you! Your message has been sent.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FiUser className="text-pink-600" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter your full name"
              className="w-full p-4 bg-white/60 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition shadow-sm"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FiMail className="text-pink-600" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full p-4 bg-white/60 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition shadow-sm"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FiPhone className="text-pink-600" /> Phone Number
            </label>
            <input
              type="text"
              name="phone"
              placeholder="+27 6X XXX XXXX"
              className="w-full p-4 bg-white/60 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition shadow-sm"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FiMessageSquare className="text-pink-600" /> Your Message
            </label>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="How can we assist you?"
              className="w-full p-4 bg-white/60 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition shadow-sm resize-none"
            ></textarea>
          </div>

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
    </div>
  );
}
