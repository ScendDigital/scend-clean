export type LoanType = "personal" | "vehicle" | "home" | "credit_card";
export const NCA_MAX_APR = 27.75;

export function parseZARNumber(input: unknown): number {
  if (typeof input === "number") return input;
  if (input == null) return NaN;
  const normalized = String(input).trim().replace(/\s/g, "").replace(",", ".");
  const val = Number(normalized);
  return Number.isFinite(val) ? val : NaN;
}

function baseRateByProduct(loanType: LoanType): number {
  switch (loanType) {
    case "personal":     return 18.0;
    case "vehicle":      return 15.0;
    case "home":         return 13.75;
    case "credit_card":  return 20.5;
    default:             return 18.0;
  }
}
function scoreAdj(creditScore: number): number {
  if (creditScore >= 780) return -3.0;
  if (creditScore >= 720) return -1.5;
  if (creditScore >= 660) return  0.0;
  if (creditScore >= 600) return  1.25;
  if (creditScore >= 540) return  2.5;
  return 4.0;
}
function dtiAdj(dtiPct: number): number {
  if (dtiPct < 30)  return -0.25;
  if (dtiPct < 40)  return  0.0;
  if (dtiPct < 50)  return  0.5;
  if (dtiPct < 55)  return  1.0;
  return 1.75;
}
function clampApr(apr: number, enforceNCA: boolean): number {
  const clean = Math.max(0, apr);
  return enforceNCA ? Math.min(clean, NCA_MAX_APR) : clean;
}

export function autoApr(opts: {
  loanType: LoanType;
  creditScore: number;
  preDtiPercent: number;
  enforceNCA: boolean;
}): number {
  const base = baseRateByProduct(opts.loanType);
  const apr = base + scoreAdj(opts.creditScore) + dtiAdj(opts.preDtiPercent);
  return Math.round(clampApr(apr, opts.enforceNCA) * 100) / 100;
}

export type ComputeInput = {
  loanType: LoanType;
  amount: number;
  termMonths: number;
  enforceNCA: boolean;

  /** When true we auto-calc APR; when false we use manualApr (capped if enforceNCA) */
  autoAprEnabled?: boolean;

  manualApr?: number;

  // Vehicle/Home specifics
  deposit?: number;
  balloonPct?: number;    // vehicle only

  // Affordability
  monthlyIncome: number;
  monthlyExpenses: number;
  otherDebtRepayments: number;

  // Risk
  creditScore: number;
};

export type ComputeResult = {
  product: LoanType;
  aprUsed: number;
  usedAutoApr: boolean;
  ncaCapped: boolean;
  messages: string[];

  monthlyRepayment: number;
  totalInterest: number;
  totalRepayable: number;
  financedAmount: number;
  balloonDue: number;
  dti: number;
  disposableIncome: number;
};

export function computeLoanOutputs(input: ComputeInput): ComputeResult {
  const msgs: string[] = [];
  const {
    loanType, enforceNCA, termMonths,
    monthlyIncome, monthlyExpenses, otherDebtRepayments,
    creditScore
  } = input;

  const requested   = Math.max(0, Number(input.amount || 0));
  const depositRaw  = Number(input.deposit || 0);
  const deposit     = (loanType === "vehicle" || loanType === "home") ? Math.max(0, depositRaw) : 0;
  const balloonPct  = loanType === "vehicle" ? Math.max(0, Math.min(100, Number(input.balloonPct || 0))) : 0;

  const income      = Math.max(0, Number(monthlyIncome || 0));
  const expenses    = Math.max(0, Number(monthlyExpenses || 0));
  const other       = Math.max(0, Number(otherDebtRepayments || 0));
  const disposable  = income - expenses - other;

  const preDti      = income > 0 ? (other / income) * 100 : 0;

  // Choose APR per checkbox
  const autoFlag    = !!input.autoAprEnabled;
  const manualAprIn = Number(input.manualApr || 0);

  let aprUsed = 0;
  let usedAutoApr = false;

  if (autoFlag) {
    aprUsed = autoApr({
      loanType,
      creditScore,
      preDtiPercent: preDti,
      enforceNCA
    });
    usedAutoApr = true;
  } else {
    if (!manualAprIn || manualAprIn <= 0) {
      msgs.push("APR not provided while Auto APR is off — using 0% temporarily. Enter APR or enable Auto APR.");
      aprUsed = 0;
    } else {
      aprUsed = Math.round(clampApr(manualAprIn, enforceNCA) * 100) / 100;
    }
  }

  const ncaCapped = enforceNCA && aprUsed >= NCA_MAX_APR;

  let principalBase = requested;
  if (loanType === "vehicle" || loanType === "home") {
    principalBase = Math.max(0, requested - deposit);
  }

  const balloonDue = loanType === "vehicle" ? principalBase * (balloonPct / 100) : 0;
  const pv = Math.max(0, principalBase - balloonDue);

  const r = (aprUsed / 100) / 12;
  const n = Math.max(1, Math.floor(Number(termMonths || 0)));

  let monthlyRepayment = 0;
  if (r === 0) {
    monthlyRepayment = pv / n;
  } else {
    monthlyRepayment = (pv * r) / (1 - Math.pow(1 + r, -n));
  }

  const totalRepayNoBalloon = monthlyRepayment * n;
  const totalInterest = Math.max(0, totalRepayNoBalloon - pv);
  const totalRepayable = totalRepayNoBalloon + balloonDue;

  const postDti = income > 0 ? ((other + monthlyRepayment) / income) * 100 : 0;

  return {
    product: loanType,
    aprUsed,
    usedAutoApr,
    ncaCapped,
    messages: msgs,

    monthlyRepayment,
    totalInterest,
    totalRepayable,
    financedAmount: pv,
    balloonDue,
    dti: postDti,
    disposableIncome: disposable,
  };
}
