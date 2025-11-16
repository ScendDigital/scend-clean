export function minExpenseNorm(gross: number, dependants: number): number {
  const g = Math.max(0, gross);
  const base = Math.max(1500, 0.25 * g);
  const perDep = 400 * Math.max(0, dependants || 0);
  return base + perDep;
}
