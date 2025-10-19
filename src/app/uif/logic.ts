export type UifInputs = {
  avgMonthlySalary: number;        // Average gross monthly salary (ZAR)
  daysWorkedLast48Months: number;  // Total work days in last 4 years
  salaryCap?: number;              // UIF salary cap (ZAR), overrideable
};

export type UifResults = {
  creditDays: number;
  benefitRate: number;         // 0.38 .. 0.60
  cappedSalary: number;        // min(salary, cap)
  dailyRemuneration: number;   // cappedSalary / 30
  dailyBenefit: number;        // dailyRemuneration * benefitRate
  monthlyBenefitApprox: number;// dailyBenefit * 21.67
  totalPotential: number;      // dailyBenefit * creditDays
  monthsApprox: number;        // creditDays / 21.67
};

// Approximate sliding scale commonly cited: 38%–60%.
// We keep a simple tier to avoid overpromising.
// You can tune the brackets without touching the UI.
export function getBenefitRate(monthly: number, cap: number): number {
  const base = Math.min(monthly, cap);
  if (base <= 3000) return 0.60;
  if (base <= 6000) return 0.55;
  if (base <= 12000) return 0.45;
  return 0.38;
}

// UIF credit days: ~1 day accrued for every 4 worked; capped at 365.
export function getCreditDays(daysWorkedLast48Months: number): number {
  if (!isFinite(daysWorkedLast48Months) || daysWorkedLast48Months <= 0) return 0;
  return Math.min(Math.floor(daysWorkedLast48Months / 4), 365);
}

export function calculateUif(inputs: UifInputs): UifResults {
  const cap = inputs.salaryCap ?? 17712; // sensible default; keep configurable
  const creditDays = getCreditDays(inputs.daysWorkedLast48Months);
  const cappedSalary = Math.min(Math.max(inputs.avgMonthlySalary, 0), cap);
  const dailyRemuneration = cappedSalary / 30;
  const benefitRate = getBenefitRate(inputs.avgMonthlySalary, cap);
  const dailyBenefit = dailyRemuneration * benefitRate;
  const monthlyBenefitApprox = dailyBenefit * 21.67; // working days approx
  const totalPotential = dailyBenefit * creditDays;
  const monthsApprox = creditDays / 21.67;

  return {
    creditDays,
    benefitRate,
    cappedSalary,
    dailyRemuneration,
    dailyBenefit,
    monthlyBenefitApprox,
    totalPotential,
    monthsApprox,
  };
}

export function formatMoney(v: number): string {
  if (!isFinite(v)) return "R 0.00";
  return "R " + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
