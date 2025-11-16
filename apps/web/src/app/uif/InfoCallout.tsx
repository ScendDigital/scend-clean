"use client";
type Props = { children: React.ReactNode };
export default function InfoCallout({ children }: Props) {
  return <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">{children}</div>;
}
