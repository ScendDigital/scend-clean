/**
 * apr.ts
 * Payment math + Effective APR (IRR) including compulsory fees.
 * We compute monthly IRR on full cashflows and annualise: (1 + r_m)^12 - 1
 */

export function monthlyRate(aprNominal: number) {
  return aprNominal / 12;
}

export function pmt(P: number, r: number, n: number) {
  if (n <= 0) return 0;
  if (Math.abs(r) < 1e-12) return P / n;
  return (P * r) / (1 - Math.pow(1 + r, -n));
}

/**
 * Build cashflows and compute effective APR via monthly IRR (bisection).
 * principal: amount advanced to consumer
 * nominalAPR: annual nominal rate used for PMT calc (interest only)
 * termMonths: number of instalments
 * monthlyServiceFee: compulsory service fee per month
 * initiationUpfront: paid at t0 (reduces net disbursement)
 * initiationCapitalised: added to principal & amortised
 */
export function computeEffectiveAPR(params: {
  principal: number;
  nominalAPR: number;
  termMonths: number;
  monthlyServiceFee: number;
  initiationUpfront: number;
  initiationCapitalised: number;
}) {
  const { principal, nominalAPR, termMonths, monthlyServiceFee, initiationUpfront, initiationCapitalised } = params;

  const P = principal + Math.max(initiationCapitalised, 0);
  const r = monthlyRate(nominalAPR);
  const basePMT = pmt(P, r, termMonths);

  // Cashflows: t0 disbursement (to consumer), t1..n repayments incl. service fee
  const netAdvance = principal - Math.max(initiationUpfront, 0);
  const flows: number[] = [ netAdvance ];
  for (let k = 1; k <= termMonths; k++) flows.push(-(basePMT + monthlyServiceFee));

  // Monthly IRR via bisection
  const irrMonthly = irrBisection(flows, 1e-8, 2000, 0, 2); // 0%..200%/mo search
  const aprEffective = Math.pow(1 + irrMonthly, 12) - 1;

  return {
    basePMT,                 // instalment excluding monthly service fee
    monthlyServiceFee,
    instalmentTotal: basePMT + monthlyServiceFee,
    aprEffective,
  };
}

/** NPV at a given monthly rate */
function npv(rateMonthly: number, flows: number[]) {
  let v = 0;
  for (let t = 0; t < flows.length; t++) v += flows[t] / Math.pow(1 + rateMonthly, t);
  return v;
}

/** Robust bisection IRR (no derivative needed) */
function irrBisection(flows: number[], tol = 1e-8, maxIter = 2000, lo = 0, hi = 2) {
  let a = lo, b = hi;
  let fa = npv(a, flows), fb = npv(b, flows);
  // Expand if signs are same
  let it = 0;
  while (fa * fb > 0 && it++ < 50) {
    b *= 2;
    fb = npv(b, flows);
    if (b > 10) break; // prevent runaway
  }
  for (let i = 0; i < maxIter; i++) {
    const m = (a + b) / 2;
    const fm = npv(m, flows);
    if (Math.abs(fm) < tol) return m;
    if (fa * fm > 0) { a = m; fa = fm; } else { b = m; fb = fm; }
  }
  return (a + b) / 2;
}