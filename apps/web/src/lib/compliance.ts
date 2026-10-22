import { caps, mortgageCapAPRDecimal, ncaMaxAPRDecimal } from "./caps";

export function clampRateToCap(requestedAPR: number, loanClass: "unsecured" | "vehicle" | "mortgage" | "revolving", repoPct?: number) {
  const cap = loanClass === "mortgage"
    ? mortgageCapAPRDecimal(repoPct)
    : ncaMaxAPRDecimal(loanClass, repoPct);
  return Math.min(Math.max(0, requestedAPR), cap);
}

export function serviceFeeMonthly(requested: number) {
  const cap = caps.serviceFeeMax; // assumed incl. VAT
  return Math.min(Math.max(0, requested), cap);
}

/** Initiation fee limits under NCA Regulation 42, Table B. */
export function initiationFee(
  loanType: "Personal Loan" | "Credit Card" | "Vehicle Finance" | "Home Loan",
  amount: number
) {
  const amt = Math.max(0, amount);
  if (amt === 0) return 0;
  const rules = loanType === "Home Loan" ? caps.initiationFee.mortgage
    : loanType === "Credit Card" ? caps.initiationFee.revolving
    : loanType === "Vehicle Finance" ? caps.initiationFee.vehicle
    : caps.initiationFee.unsecured;
  const fee = rules.base + rules.pct * Math.max(amt - rules.threshold, 0);
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
  if (loanType === "Vehicle Finance") return ncaMaxAPRDecimal("vehicle", repoPct);
  if (loanType === "Home Loan")       return mortgageCapAPRDecimal(repoPct);
  if (loanType === "Credit Card") return ncaMaxAPRDecimal("revolving", repoPct);
  return ncaMaxAPRDecimal("unsecured", repoPct);
}


