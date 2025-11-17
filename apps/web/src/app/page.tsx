"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CardProps = {
  title: string;
  desc: string;
  href: string;
  label?: string;
};

function ToolCard({ title, desc, href, label = "Open" }: CardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between rounded-2xl border border-pink-200 bg-white/70 p-5 shadow-[0_8px_25px_rgba(236,72,153,0.12)] backdrop-blur-md transition hover:-translate-y-1 hover:border-pink-400 hover:shadow-[0_18px_35px_rgba(236,72,153,0.25)]"
    >
      <div>
        <h3 className="text-[16px] font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">{desc}</p>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs font-medium text-pink-600">
        <span className="inline-flex items-center rounded-full bg-pink-50 px-3 py-1 group-hover:bg-pink-100">
          {label}
        </span>
        <span className="text-[11px] text-gray-500 group-hover:text-gray-700">
          Scend • Powered by South African law
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // Prevent hydration mismatches

  return (
    <div className="min-h-screen flex justify-center px-4 py-16 bg-gradient-to-b from-white via-pink-50/40 to-white">
      
      {/* PREMIUM SCEND CONTAINER */}
      <div className="w-full max-w-6xl bg-gradient-to-br from-pink-50 via-white to-pink-100/70 backdrop-blur-xl border border-pink-200 rounded-[40px] shadow-[0_8px_30px_rgba(236,72,153,0.25)] p-10 md:p-14 animate-fadeIn">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-50 via-white to-pink-100 shadow-sm p-8 md:p-12">
  <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-pink-200/40 blur-3xl" />
  <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-gray-100/70 blur-3xl" />

  <div className="relative grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center">
    
    {/* Left */}
    <div className="max-w-xl">

      {/* Removed line */}

      <h1 className="mt-2 text-4xl font-extrabold text-gray-900">
        Welcome to Scend
      </h1>

      <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
        We turn complex South African regulations —{" "}
        <span className="font-medium">
          SARS tax, UIF benefits & the National Credit Act
        </span>{" "}
        — into clear, practical decisions you can use daily.
      </p>

      <div className="mt-5 flex flex-wrap gap-3 text-[12px] text-gray-700">
        <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">
          Designed for real South African households
        </span>
        <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">
          Built for HR, payroll, advisors & individuals
        </span>
      </div>
    </div>

    {/* Right summary box stays the same */}
    <div className="rounded-3xl border border-pink-200 bg-white/80 p-5 shadow-md backdrop-blur-sm">
      <h2 className="text-sm font-semibold text-gray-900">
        What you get with Scend tools
      </h2>

      <ul className="mt-3 space-y-2 text-[13px] text-gray-700">
        <li>• Transparent calculations anyone can understand.</li>
        <li>• Real South African logic based on legislation.</li>
        <li>• Clean PDFs to share or keep for records.</li>
        <li>• A neutral, educational way to talk about money.</li>
      </ul>
    </div>

  </div>
</section>


        {/* TOOLS */}
        <section className="mt-14">
          <h2 className="mb-6 text-xl font-bold text-gray-900">What you can do today</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ToolCard
              title="Loan Tool"
              href="/loan"
              label="Open Loan Tool"
              desc="Check affordability, DTI, NCA caps & estimated approval likelihood."
            />
            <ToolCard
              title="Tax Tool"
              href="/tax"
              label="Open Tax Tool"
              desc="Apply SARS tax tables, rebates & medical credits instantly."
            />
            <ToolCard
              title="UIF Tool"
              href="/uif"
              label="Open UIF Tool"
              desc="Calculate UIF credits, benefit days & payout estimations."
            />
            <ToolCard
              title="Price Compare"
              href="/price-compare"
              label="Open Price Compare"
              desc="Compare everyday prices between major SA retailers."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14 rounded-3xl bg-pink-50/70 p-8 shadow-inner">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h3 className="text-lg font-bold text-gray-900">
                Bring Scend into your organisation
              </h3>
              <p className="mt-1 text-[14px] text-gray-700">
                We can brand, host & support these tools for HR, payroll, wellness or advisory teams —
                keeping everything updated while you focus on people.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-2xl bg-pink-600 px-5 py-2.5 text-[14px] font-semibold text-white shadow-md hover:bg-pink-700"
            >
              Talk to Scend
            </Link>
          </div>
        </section>

      </div>

      {/* FADE-IN ANIMATION */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
