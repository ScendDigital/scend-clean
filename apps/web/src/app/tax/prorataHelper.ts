export type Mode = "year" | "month";

/**
 * Returns the gross amount that should feed into your PAYE engine,
 * respecting monthly mode and (optional) prorata by days worked.
 */
export function deriveGrossForCalc(params: {
  mode: Mode;
  grossAnnual: number;
  isProrated: boolean;
  daysInMonth?: number;
  daysWorked?: number;
}) {
  const { mode, grossAnnual, isProrated, daysInMonth = 30, daysWorked = 30 } = params;

  if (mode === "year") return Math.max(0, grossAnnual);

  const monthly = Math.max(0, grossAnnual) / 12;
  if (!isProrated) return monthly;

  const denom = Math.max(1, Number(daysInMonth));
  const factor = Math.max(0, Math.min(1, Number(daysWorked) / denom));
  return monthly * factor;
}
