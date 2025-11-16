"use client";

import * as React from "react";

const glowBtn = (base: string) =>
  `glow rounded-2xl px-4 py-2 text-sm font-semibold ${base}`;

export default function PublishingTool() {
  return (
    <div className="space-y-8">
      {/* Premium header */}
      <section className="rounded-3xl bg-gradient-to-br from-pink-50 via-white to-white p-8 shadow-sm ring-1 ring-gray-200/60">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Scend Publishing
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
            Professional, author-centred publishing support — from manuscript
            clean-up to print-ready files and launch strategy. Designed to work
            hand-in-hand with Scend&apos;s digital tools and wellness focus.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className={glowBtn(
                "text-white bg-pink-600 hover:bg-pink-700"
              )}
            >
              Request publishing consult
            </button>
            <button
              className={glowBtn(
                "text-gray-900 bg-white ring-1 ring-gray-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-pink-200"
              )}
            >
              Download sample package
            </button>
          </div>
        </div>
      </section>

      {/* Packages + Info */}
      <section className="grid gap-6 xl:grid-cols-[2fr,1.4fr]">
        {/* Packages */}
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-gray-200/70">
          <h2 className="text-lg font-semibold text-gray-900">
            Publishing packages
          </h2>

          <p className="mt-2 text-[14px] text-gray-700">
            These are guideline bundles. In practice we customise based on your
            manuscript, budget, and where you are in your journey.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {/* Starter */}
            <article className="flex flex-col rounded-2xl border border-gray-200 bg-gray-50/60 p-4">
              <h3 className="text-md font-semibold text-gray-900">
                Starter Edit
              </h3>
              <p className="mt-2 text-[13px] text-gray-700">
                Ideal if your book is drafted but needs a professional clean-up
                and structure check.
              </p>
              <ul className="mt-3 space-y-1 text-[13px] text-gray-800">
                <li>• Manuscript review &amp; high-level feedback</li>
                <li>• Light language &amp; consistency edit</li>
                <li>• Basic interior formatting (Word / PDF)</li>
                <li>• Simple front-matter &amp; back-matter setup</li>
              </ul>
              <div className="mt-4 text-[12px] text-gray-600">
                From <span className="font-semibold">R</span> (quote on request)
              </div>
            </article>

            {/* Standard */}
            <article className="flex flex-col rounded-2xl border border-pink-200 bg-pink-50/50 p-4 shadow-[0_8px_24px_rgba(219,39,119,0.12)]">
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-pink-600/10 px-3 py-1 text-[11px] font-semibold text-pink-700">
                Most popular
              </div>
              <h3 className="mt-2 text-md font-semibold text-gray-900">
                Scend Author
              </h3>
              <p className="mt-2 text-[13px] text-gray-700">
                Full service for authors who want a serious, professional book
                that can live on Amazon and local print.
              </p>
              <ul className="mt-3 space-y-1 text-[13px] text-gray-800">
                <li>• Detailed edit &amp; clean-up</li>
                <li>• Professional interior layout (print &amp; eBook)</li>
                <li>• Cover guidance (Canva / designer-ready)</li>
                <li>• ISBN &amp; metadata guidance</li>
                <li>• Upload support (e.g. Amazon KDP)</li>
              </ul>
              <div className="mt-4 text-[12px] text-gray-600">
                Pricing shaped around page-count and complexity.
              </div>
            </article>

            {/* Premium */}
            <article className="flex flex-col rounded-2xl border border-gray-200 bg-gray-50/60 p-4">
              <h3 className="text-md font-semibold text-gray-900">
                Expanded &amp; Legacy
              </h3>
              <p className="mt-2 text-[13px] text-gray-700">
                For large or multi-format works (e.g. expanded editions, workbooks,
                or material to adapt for talks / TV / courses).
              </p>
              <ul className="mt-3 space-y-1 text-[13px] text-gray-800">
                <li>• Complex layout &amp; long-form manuscripts</li>
                <li>• Multiple formats (print, eBook, workbook)</li>
                <li>• Slide / talk outline support where relevant</li>
                <li>• Strategy session: how to use the book as a tool</li>
              </ul>
              <div className="mt-4 text-[12px] text-gray-600">
                Scoped via discovery session with you.
              </div>
            </article>
          </div>
        </div>

        {/* Process + Intake */}
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70">
            <h2 className="text-lg font-semibold text-gray-900">
              How Scend Publishing works
            </h2>
            <ol className="mt-3 space-y-2 text-[13px] text-gray-700 list-decimal list-inside">
              <li>
                <span className="font-semibold">Share your manuscript</span> —
                even if it&apos;s messy. We sign an NDA if required.
              </li>
              <li>
                <span className="font-semibold">We review &amp; respond</span> —
                you get a structured summary of what&apos;s needed (edit, layout,
                cover, etc.).
              </li>
              <li>
                <span className="font-semibold">We agree a package</span> —
                scoped around page-count, complexity and your goals.
              </li>
              <li>
                <span className="font-semibold">You approve, we build</span> —
                we edit, structure and produce print-ready and digital files.
              </li>
              <li>
                <span className="font-semibold">Support at launch</span> —
                basic launch copy ideas, and how to plug into your Scend tools.
              </li>
            </ol>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70">
            <h2 className="text-lg font-semibold text-gray-900">
              Quick publishing intake
            </h2>
            <p className="mt-2 text-[13px] text-gray-700">
              Use this as a checklist before you contact us. It helps speed up
              quoting and keeps you in control of the process.
            </p>

            <div className="mt-3 grid gap-3 text-[13px]">
              <label className="text-gray-900">
                Working title
                <input
                  type="text"
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  placeholder="e.g. Silent Pain: The Untold Struggles of..."
                />
              </label>

              <label className="text-gray-900">
                Approximate word count / page count
                <input
                  type="text"
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  placeholder="e.g. 120k words / 800+ pages"
                />
              </label>

              <label className="text-gray-900">
                Current format
                <select className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-pink-200">
                  <option>Word document</option>
                  <option>Google Docs</option>
                  <option>PDF only</option>
                  <option>Handwritten / mixed</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="text-gray-900">
                What do you want from this book?
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  placeholder="e.g. heal a specific community, support a talk, generate leads for a service, leave a legacy for family, etc."
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                className={glowBtn(
                  "text-white bg-pink-600 hover:bg-pink-700"
                )}
              >
                Send details to Scend
              </button>
              <span className="self-center text-[11px] text-gray-600">
                You can also email us directly with your manuscript attached.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="rounded-3xl border border-gray-200 bg-white/60 p-4">
        <p className="text-[12.5px] leading-relaxed text-gray-700">
          <strong>Note:</strong> Scend Publishing is flexible. We can work only
          on editing, only on layout, or on the full journey from raw draft to
          live book. Pricing is always agreed in advance and aligned with what
          you actually need — no surprise add-ons.
        </p>
      </section>
    </div>
  );
}
