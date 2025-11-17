"use client";

import ToolPageShell from "@/components/shared/ToolPageShell";
import LoanTool from "@/components/loan/LoanTool";
import React, { useEffect, useState } from "react";

export default function LoanPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen flex justify-center px-4 py-16 bg-gradient-to-b from-white via-pink-50/40 to-white">

      {/* PREMIUM SCEND PINK CONTAINER */}
      <div className="w-full max-w-5xl bg-gradient-to-br from-pink-50 via-white to-pink-100/70 backdrop-blur-xl border border-pink-200 rounded-[40px] shadow-[0_10px_40px_rgba(236,72,153,0.25)] p-10 md:p-14 animate-fadeIn">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-pink-600 tracking-tight drop-shadow-sm">
            Loan Tool
          </h1>
          <p className="text-gray-700 text-[15px] mt-2">
            Smarter, SA-compliant loan affordability & qualification insights.
          </p>
        </div>

        {/* TOOL WRAPPER */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-pink-100 p-8 md:p-10">
          <LoanTool />
        </div>

      </div>

      {/* FADE-IN ANIMATION */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
