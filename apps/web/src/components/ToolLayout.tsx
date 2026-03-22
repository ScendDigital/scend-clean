import React from "react";

export default function ToolLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gray-50 px-10 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-600 mt-2">
            {subtitle}
          </p>
        )}
      </header>

      <main className="w-full">
        {children}
      </main>
    </div>
  );
}

