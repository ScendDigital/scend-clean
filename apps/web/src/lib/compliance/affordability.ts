/**
 * affordability.ts
 * Reasonable living expense floor + affordability helpers.
 * Replace the demo bands with your policy table or NCR guidelines.
 */

export type FloorBand = { maxGross: number; base: number; perDependent: number };

const DEMO_BANDS: FloorBand[] = [
  { maxGross: 10000, base: 3000,  perDependent: 400  },
  { maxGross: 20000, base: 5500,  perDependent: 500  },
  { maxGross: 40000, base: 8500,  perDependent: 650  },
  { maxGross: 99999999, base: 12000, perDependent: 800 },
];

/** Return the minimum reasonable living expense for an income & dependants. */
export function livingExpenseFloor(grossIncome: number, dependants = 0, bands: FloorBand[] = DEMO_BANDS): number {
  const band = bands.find(b => grossIncome <= b.maxGross) ?? bands[bands.length - 1];
  return band.base + Math.max(dependants, 0) * band.perDependent;
}

/** Disposable income using floor validation. */
export function disposableIncome(
  netIncome: number,
  declaredExpenses: number,
  existingDebtsMonthly: number,
  grossIncome: number,
  dependants = 0
) {
  const floor = livingExpenseFloor(grossIncome, dependants);
  const expenses = Math.max(declaredExpenses, floor);
  return netIncome - expenses - existingDebtsMonthly;
}

/** Debt-to-Income ratio after adding proposed repayment. */
export function dtiAfter(
  grossIncome: number,
  existingDebtsMonthly: number,
  proposedMonthlyRepayment: number
) {
  const denom = Math.max(grossIncome, 1); // avoid /0
  return (existingDebtsMonthly + proposedMonthlyRepayment) / denom;
}