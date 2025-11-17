"use client";

import * as React from "react";

type ToolPageShellProps = {
  title: string;
  subtitle: string;
  badge?: string;
  children: React.ReactNode;
};

export default function ToolPageShell({
  title,
  subtitle,
  badge = "Scend Wellness Tool",
  children,
}: ToolPageShellProps) {
  return (
    <div className="space-y-8">
      {/* Premium header */}
      <section className="rounded-3xl bg-gradient-to-br from-pink-50 via-white to-white p-6 md:p-8 shadow-sm ring-1 ring-pink-100/70">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-pink-600 ring-1 ring-pink-100 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
              {badge}
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-gray-700">
              {subtitle}
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 px-4 py-3 text-[12px] text-gray-700 shadow-sm ring-1 ring-gray-200/70 max-w-xs">
            <div className="font-semibold text-gray-900 mb-1">
              Scend insight
            </div>
            <p>
              These tools translate complex South African rules into clear,
              everyday decisions you can actually use.
            </p>
          </div>
        </div>
      </section>

      {/* Tool content */}
      <section>{children}</section>
    </div>
  );
}
