"use client";

import React, { useEffect, useState } from "react";
import PriceCompareClient from "@/components/PriceCompareClient";

export default function PriceComparePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex justify-center px-4 py-16 bg-gradient-to-b from-white via-pink-50/40 to-white">

      <div className="w-full  bg-gradient-to-br from-pink-50 via-white to-pink-100/70  border border-pink-200   p-10 md:p-14 animate-fadeIn">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-pink-600 tracking-tight drop-
            Price Compare Tool
          </h1>
          <p className="text-gray-700 text-[15px] mt-2">
            Compare prices across South African retailers — simple, fast and clear.
          </p>
        </div>

        {/* TOOL CONTAINER */}
        <div className="bg-white/80    border border-pink-100 p-8 md:p-10">

          <PriceCompareClient />

          {/* DISCLAIMER */}
          <p className="mt-8 text-[12px] text-gray-500 leading-relaxed text-center">
            <strong>Disclaimer:</strong> This tool provides estimated comparisons based on available 
            data. Retail prices may vary by region, promotions, stock availability or store policies.
          </p>

        </div>
      </div>

      {/* Fade animation */}
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
