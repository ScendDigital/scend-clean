export type LoanType = "vehicle" | "home" | "personal" | "credit";

export interface LoanInput {
  type: LoanType;
  principal: number;        // total price
  deposit?: number;         // money down
  balloonPct?: number;      // 0–100 (vehicle only)
  annualRatePct: number;    // raw rate input, will be capped
  termMonths: number;
  incomeMonthly: number;
  expensesMonthly: number;  // to compute disposable income
}

export interface LoanOutput {
  principalFinanced: number;
  monthlyRate: number;
  monthlyRepayment: number;
  balloonAmountEnd: number;
  totalInterest: number;
  totalRepaid: number;
  dtiPct: number;
  disposableIncome: number;
  ncaRateAppliedPct: number; // rate after cap in %
  approved: boolean;
  reasons: string[];
}

export function calcLoan(i: LoanInput): LoanOutput {
  const NCA_CAP = 27.75 / 100;
  const rateAnnualRaw = Math.max(0, i.annualRatePct / 100);
  const rateAnnual = Math.min(rateAnnualRaw, NCA_CAP);
  const r = rateAnnual / 12;

  const deposit = Math.max(0, i.deposit || 0);
  const base = Math.max(0, i.principal - deposit);

  const balloonPct = i.type === "vehicle" ? Math.max(0, Math.min(1, (i.balloonPct || 0) / 100)) : 0;
  const balloonFV = base * balloonPct;

  const n = Math.max(1, i.termMonths);
  const pvAdj = base - balloonFV / Math.pow(1 + r, n);
  const payment = r === 0 ? pvAdj / n : (r * pvAdj) / (1 - Math.pow(1 + r, -n));

  const disposable = Math.max(0, i.incomeMonthly - i.expensesMonthly);
  const dti = i.incomeMonthly > 0 ? (payment / i.incomeMonthly) * 100 : 100;

  const totalPaid = payment * n + balloonFV;
  const totalInterest = Math.max(0, totalPaid - base);

  const reasons: string[] = [];
  if (rateAnnualRaw > NCA_CAP) reasons.push("Interest capped to NCA max 27.75%.");
  if (payment > disposable) reasons.push("Repayment exceeds disposable income.");
  if (dti > 55) reasons.push("DTI above 55% compliance threshold.");
  const approved = payment <= disposable && dti <= 55;

  const round2 = (x:number)=>Math.round(x*100)/100;

  return {
    principalFinanced: round2(base),
    monthlyRate: r,
    monthlyRepayment: round2(payment),
    balloonAmountEnd: round2(balloonFV),
    totalInterest: round2(totalInterest),
    totalRepaid: round2(totalPaid),
    dtiPct: round2(dti),
    disposableIncome: round2(disposable),
    ncaRateAppliedPct: Math.round(rateAnnual * 10000) / 100,
    approved,
    reasons,
  };
}
