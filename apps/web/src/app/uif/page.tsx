"use client";

import React, { useEffect, useState } from "react";
import UifTool from "@/components/uif/UifTool";

export default function UifPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen flex justify-center px-4 py-16 bg-gradient-to-b from-white via-pink-50/40 to-white">

      {/* PREMIUM CONTAINER */}
      <div className="w-full  bg-gradient-to-br from-pink-50 via-white to-pink-100/70  border border-pink-200   p-10 md:p-14 animate-fadeIn">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-pink-600 tracking-tight drop-
            UIF Tool
          </h1>
          <p className="text-gray-700 text-[15px] mt-2">
            Understand UIF credits, claim value, waiting periods, and payout estimates — clearly.
          </p>
        </div>

        {/* TOOL + DISCLAIMER */}
        <div className="bg-white/80    border border-pink-100 p-8 md:p-10">

          <UifTool />

          <p className="mt-8 text-[12px] text-gray-500 leading-relaxed text-center">
            <strong>Disclaimer:</strong> This UIF Tool provides estimates based on standard UIF 
            rules, contribution history, and typical claim calculations. Actual outcomes may vary 
            depending on Department of Labour processing, employer declarations, and individual 
            employment factors. For confirmed results, consult the Department of Labour or uFiling.
          </p>

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
