"use client";
import { Wallet, CalendarClock, Timer } from "lucide-react";
import { formatMoney } from "./logic";

type Props = { monthlyBenefit: number; creditDays: number; monthsApprox: number };
export default function StatTiles({ monthlyBenefit, creditDays, monthsApprox }: Props) {
  const stats = [
    { label: "Monthly Benefit (approx)", value: formatMoney(monthlyBenefit), Icon: Wallet, accent: "bg-gray-50 border-gray-200" },
    { label: "Credit Days", value: String(creditDays), Icon: CalendarClock, accent: "bg-gray-50 border-gray-200" },
    { label: "Estimated Duration", value: `${monthsApprox.toFixed(1)} months`, Icon: Timer, accent: "bg-gray-50 border-gray-200" },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {stats.map(({ label, value, Icon, accent }) => (
        <div key={label} className={`rounded-2xl border p-4 ${accent}`}>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border p-2"><Icon className="w-5 h-5" aria-hidden="true" /></div>
            <div className="min-w-0">
              <p className="text-xs text-gray-600">{label}</p>
              <p className="text-lg font-semibold truncate">{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
