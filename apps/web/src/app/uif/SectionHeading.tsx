"use client";

type Props = { id?: string; title: string; subtitle?: string };
export default function SectionHeading({ id, title, subtitle }: Props) {
  return (
    <div id={id} className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      <nav className="hidden md:flex items-center gap-2 text-sm text-gray-600">
        <a className="px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100" href="#estimator">Estimator</a>
        <a className="px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100" href="#documents">Documents</a>
      </nav>
    </div>
  );
}
