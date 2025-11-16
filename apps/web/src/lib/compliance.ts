import { caps, mortgageCapAPRDecimal } from "./caps";

export function clampRateToCap(requestedAPR: number, loanClass: "unsecured" | "vehicle" | "mortgage", repoPct?: number) {
  let cap = caps.unsecured.maxAPR;
  if (loanClass === "vehicle") cap = caps.vehicle.maxAPR;
  if (loanClass === "mortgage") cap = mortgageCapAPRDecimal(repoPct);
  return Math.min(Math.max(0, requestedAPR), cap);
}

export function serviceFeeMonthly(requested: number) {
  const cap = caps.serviceFeeMax; // assumed incl. VAT
  return Math.min(Math.max(0, requested), cap);
}

/** Example initiation fee; set caps per NCR schedule for production. */
export function initiationFee(
  loanType: "Personal Loan" | "Credit Card" | "Vehicle Finance" | "Home Loan",
  amount: number
) {
  const amt = Math.max(0, amount);
  const rules =
    loanType === "Vehicle Finance" ? caps.initiationFee.vehicle :
    loanType === "Home Loan"       ? caps.initiationFee.mortgage :
    caps.initiationFee.unsecured;
  if (!rules) return 0;
  const fee = rules.base + rules.pct * amt;
  return Math.min(fee, rules.max);
}

/** Finance the initiation fee into principal (true) or treat as upfront (false). */
export const FINANCE_INIT_FEE = true;

/** Core maths */
export const monthlyRate = (aprDecimal: number) => aprDecimal / 12;

export function pmt(principal: number, i: number, n: number) {
  const P = Math.max(0, principal);
  const N = Math.max(1, n);
  if (i === 0) return P / N;
  return (P * i) / (1 - Math.pow(1 + i, -N));
}

export const dtiAfter = (gross: number, existingDebts: number, newInstalment: number) =>
  (Math.max(0, existingDebts) + Math.max(0, newInstalment)) / Math.max(1, gross);

export const disposableIncome = (net: number, expensesUsed: number, existingDebts: number) =>
  Math.max(0, Math.max(0, net) - Math.max(0, expensesUsed) - Math.max(0, existingDebts));

/** Max APR (decimal) by loan type */
export function getCapAPRByLoanType(loanType: string, repoPct?: number) {
  if (loanType === "Vehicle Finance") return caps.vehicle.maxAPR;
  if (loanType === "Home Loan")       return mortgageCapAPRDecimal(repoPct);
  return caps.unsecured.maxAPR; // Personal/Credit Card
}
