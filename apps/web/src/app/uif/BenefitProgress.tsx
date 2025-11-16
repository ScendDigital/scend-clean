"use client";
type Props = { creditDays: number };
export default function BenefitProgress({ creditDays }: Props) {
  const maxDays = 365;
  const pct = Math.min(100, Math.max(0, (creditDays / maxDays) * 100));
  return (
    <div className="rounded-2xl border border-gray-200 p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-800">Benefit Coverage</p>
        <p className="text-xs text-gray-600">{Math.round(pct)}% of max ({creditDays}/{maxDays} days)</p>
      </div>
      <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full bg-pink-500" style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}
