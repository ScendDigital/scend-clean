"use client";

import React, { useEffect, useState } from "react";
import PublishingToolClient from "@/components/PublishingToolClient";

export default function PublishingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen flex justify-center px-4 py-16 bg-gradient-to-b from-white via-pink-50/40 to-white">

      {/* PREMIUM SCEND CONTAINER */}
      <div className="w-full max-w-5xl bg-gradient-to-br from-pink-50 via-white to-pink-100/70 backdrop-blur-xl border border-pink-200 rounded-[40px] shadow-[0_10px_40px_rgba(236,72,153,0.25)] p-10 md:p-14 animate-fadeIn">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-pink-600 tracking-tight drop-shadow-sm">Publishing Tool</h1>
          <p className="text-gray-700 text-[15px] mt-2">Tools and guidance for authors and creators under the Scend Publishing umbrella.</p>
        </div>

        {/* CONTENT */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-pink-100 p-8 md:p-10 space-y-10">

          {/* SCEND PUBLISHING SECTION */}
          <section>
            <h2 className="text-2xl font-bold text-pink-600 mb-4">Scend Publishing</h2>
            <p className="text-gray-700 text-[15px] leading-relaxed">
              Professional, author-centred publishing support — from manuscript clean-up to print-ready files and launch strategy. Designed to complement Scend’s digital tools and wellness ecosystem.
            </p>

            <div className="mt-4 flex flex-wrap gap-4">
              <button className="px-6 py-3 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-700 transition">Request publishing consult</button>
              <button className="px-6 py-3 rounded-xl bg-white border border-pink-300 text-pink-600 font-semibold hover:bg-pink-50 transition">Download sample package</button>
            </div>
          </section>

          {/* PACKAGES */}
          <section>
            <h2 className="text-2xl font-bold text-pink-600 mb-4">Publishing Packages</h2>
            <p className="text-gray-700 leading-relaxed mb-6">These are guideline bundles. We customise based on your manuscript, budget, and where you are in your journey.</p>

            {/* STARTER */}
            <div className="p-5 bg-white border border-pink-100 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Starter Edit</h3>
              <p className="text-gray-600 text-[14px] mt-2 mb-3">Ideal if your book is drafted but needs a professional clean-up and structure check.</p>
              <ul className="text-gray-700 text-[14px] space-y-1">
                <li>• Manuscript review & high-level feedback</li>
                <li>• Light language & consistency edit</li>
                <li>• Basic interior formatting (Word / PDF)</li>
                <li>• Simple front-matter & back-matter setup</li>
              </ul>
              <p className="mt-3 text-pink-600 font-semibold">From R (quote on request)</p>
            </div>

            {/* SCEND AUTHOR */}
            <div className="p-5 bg-pink-50 border border-pink-200 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Scend Author (Most popular)</h3>
              <p className="text-gray-600 text-[14px] mt-2 mb-3">Full service for authors who want a serious, professional book that can live on Amazon and local print.</p>
              <ul className="text-gray-700 text-[14px] space-y-1">
                <li>• Detailed edit & clean-up</li>
                <li>• Professional interior layout (print & eBook)</li>
                <li>• Cover guidance (Canva / designer-ready)</li>
                <li>• ISBN & metadata guidance</li>
                <li>• Upload support (Amazon KDP)</li>
              </ul>
              <p className="mt-3 text-pink-600 font-semibold">Pricing shaped around page-count and complexity.</p>
            </div>

            {/* EXPANDED */}
            <div className="p-5 bg-white border border-pink-100 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Expanded & Legacy</h3>
              <p className="text-gray-600 text-[14px] mt-2 mb-3">For large or multi-format works such as expanded editions, workbooks, or content adapted for talks, TV or courses.</p>
              <ul className="text-gray-700 text-[14px] space-y-1">
                <li>• Complex long-form layouts</li>
                <li>• Print, eBook, and workbook formats</li>
                <li>• Slide/talk outline support</li>
                <li>• Strategy session on using the book as a tool</li>
              </ul>
              <p className="mt-3 text-pink-600 font-semibold">Scoped via discovery session.</p>
            </div>
          </section>

          {/* PROCESS */}
          <section>
            <h2 className="text-2xl font-bold text-pink-600 mb-4">How Scend Publishing Works</h2>
            <ol className="list-decimal ml-6 text-gray-700 space-y-2 text-[14px]">
              <li>Share your manuscript — messy drafts welcome (NDA available).</li>
              <li>We review and send structured feedback.</li>
              <li>We finalise a package based on goals and complexity.</li>
              <li>You approve — we produce the full publishing-ready files.</li>
              <li>Launch support with basic copy and guidance.</li>
            </ol>
          </section>

          {/* QUICK INTAKE */}
          <section>
            <h2 className="text-2xl font-bold text-pink-600 mb-4">Quick Publishing Intake</h2>

            <div className="space-y-4 text-[14px]">
              <p><span className="font-semibold">Working title:</span> e.g., Silent Pain: The Untold Struggles of...</p>
              <p><span className="font-semibold">Approx word/page count:</span> e.g., 120k words / 800+ pages</p>
              <p><span className="font-semibold">Current format:</span> Word document</p>
              <p><span className="font-semibold">Purpose:</span> heal a community, support talks, leave a legacy, etc.</p>

              <button className="px-6 py-3 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-700 transition">Send details to Scend</button>

              <p className="text-gray-600 text-[13px]">You may also email us directly with your manuscript attached.</p>

              <p className="text-gray-500 text-[12px] leading-relaxed">
                Note: Scend Publishing is flexible. We can work only on editing, only on layout, or the full journey from raw draft to live book. Pricing is always agreed upfront — no surprise add-ons.
              </p>
            </div>
          </section>

          {/* DISCLAIMER */}
          <p className="text-[12px] text-gray-500 leading-relaxed text-center">
            <strong>Disclaimer:</strong> This publishing tool provides general guidance. Final publishing outcomes may vary based on editing quality, formatting, distribution platforms, printing specifications, and external publishing processes.
          </p>
        </div>
      </div>

      {/* ANIMATION */}
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
