"use client";

import * as React from "react";
import {
  serviceFeeMonthly,
  disposableIncome as diNetOnly,
  dtiAfter,
  pmt,
  monthlyRate,
  initiationFee,
  FINANCE_INIT_FEE,
  getCapAPRByLoanType,
} from "../../lib/compliance";
import { caps } from "../../lib/caps";
import { minExpenseNorm } from "../../lib/men";

/* ───────────────── Helpers/const ───────────────── */
const currency = (n: number) =>
  (isFinite(n) ? n : 0).toLocaleString("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  });

const DEFAULT_MIN_PCT = 0.03;
const MAX_END_AGE = 70;

const LOAN_TYPES = ["Personal Loan", "Vehicle Finance", "Home Loan", "Credit Card"] as const;
const EMPLOYMENT_TYPES = [
  "Permanent (full-time)",
  "Contract",
  "Temporary",
  "Self-employed",
  "Unemployed",
  "Pensioner/Retired",
  "Student",
] as const;

function employmentScoreAdj(type: string) {
  switch (type) {
    case "Permanent (full-time)": return +20;
    case "Contract": return -5;
    case "Temporary": return -10;
    case "Self-employed": return -10;
    case "Unemployed": return -60;
    case "Pensioner/Retired": return -15;
    case "Student": return -20;
    default: return 0;
  }
}
function aprFromScore(score: number) {
  if (score >= 700) return 18.0;
  if (score >= 660) return 20.5;
  if (score >= 620) return 22.5;
  if (score >= 580) return 24.5;
  return 27.75;
}

/* ───────────────── Component ───────────────── */
export default function LoanTool() {
  const [f, setF] = React.useState({
    loanType: "Personal Loan",
    amount: 100_000,
    term: 60,
    aprPercent: 24,
    autoAPR: true,

    creditScore: 650,
    employmentType: "Permanent (full-time)",
    ageYears: 35,

    repoPct: caps.repoDefaultPct, // mortgage cap input

    depositAmount: 0,             // home & vehicle
    balloonPct: 0,                // vehicle

    gross: 25_000,
    net: 20_000,
    declaredExpenses: 9_000,
    existingMonthlyDebts: 1_500,
    owedBalance: 0,
    applyMinPctFromBalance: true,
    dependants: 3,

    requestedServiceFee: caps.serviceFeeMax,
  });

  const [results, setResults] = React.useState<any>(null);

  function compute() {
    const notes: string[] = [];

    // Vehicle policy clamps
    let balloonPct = f.balloonPct;
    if (f.loanType === "Vehicle Finance") {
      const maxPct = (caps.vehicle.policy?.maxBalloonPct ?? 0.4) * 100;
      if (balloonPct > maxPct) {
        balloonPct = maxPct;
        notes.push(`Balloon capped to ${maxPct}% by policy`);
      }
      const maxTerm = caps.vehicle.policy?.maxTermMonths ?? 72;
      if (f.term > maxTerm) notes.push(`Term exceeds ${maxTerm} months policy`);
    }

    // MEN fallback
    const men = minExpenseNorm(f.gross, f.dependants);
    const usedExpenses = Math.max(f.declaredExpenses, men);
    if (usedExpenses > f.declaredExpenses) notes.push("MEN applied (declared expenses below norms)");

    // Other-balance min
    const minFromBalance = f.applyMinPctFromBalance ? f.owedBalance * DEFAULT_MIN_PCT : 0;

    // Service fee (capped)
    const serviceFee = serviceFeeMonthly(f.requestedServiceFee);

    // Score -> APR -> cap
    const scoreAdj = Math.max(300, Math.min(900, f.creditScore + employmentScoreAdj(f.employmentType)));
    const aprCandidatePct = f.autoAPR ? aprFromScore(scoreAdj) : f.aprPercent;
    const capAPRdec = getCapAPRByLoanType(f.loanType, f.repoPct);
    const aprPctFinal = Math.min(aprCandidatePct, capAPRdec * 100);
    const r = monthlyRate(aprPctFinal / 100);

    // Initiation fee
    const initFee = initiationFee(f.loanType as any, f.amount);
    const initFinanced = FINANCE_INIT_FEE && initFee > 0;

    // Principal by type
    let financed = f.amount + (initFinanced ? initFee : 0);
    let balloonAmount = 0;

    if (f.loanType === "Home Loan") {
      financed = Math.max(0, f.amount - Math.max(0, f.depositAmount)) + (initFinanced ? initFee : 0);
    } else if (f.loanType === "Vehicle Finance") {
      const deposit = Math.max(0, f.depositAmount);
      const priceAfterDeposit = Math.max(0, f.amount - deposit);
      balloonAmount = (priceAfterDeposit * Math.max(0, balloonPct)) / 100;
      const pvBalloon = balloonAmount / Math.pow(1 + r, f.term);
      financed = Math.max(0, priceAfterDeposit - pvBalloon) + (initFinanced ? initFee : 0);
    }

    // Repayments
    const basePMT = pmt(financed, r, f.term);
    const monthly = basePMT + serviceFee;

    // Totals (balloon added at end if vehicle; deposit excluded by design)
    const totalServiceFees = serviceFee * f.term;
    const totalRepay = monthly * f.term + (f.loanType === "Vehicle Finance" ? balloonAmount : 0);
    const totalInterestApprox = totalRepay - totalServiceFees - f.amount - (initFinanced ? initFee : 0);

    // Affordability
    const existingFinal = f.existingMonthlyDebts + minFromBalance;
    const disposable = diNetOnly(f.net, usedExpenses, existingFinal);
    const affordable = monthly <= disposable;

    const dti = dtiAfter(f.gross, existingFinal, monthly);
    const dtiBand = dti < 0.35 ? "Low" : dti < 0.5 ? "Moderate" : "High";

    // Age/term
    const endAge = f.ageYears + f.term / 12;
    const termWithinAge = endAge <= MAX_END_AGE;
    if (!termWithinAge) notes.push(`Term ends at age ${endAge.toFixed(1)} (> ${MAX_END_AGE})`);

    // Decision
    const decision = !affordable
      ? "Declined – fails affordability"
      : dti >= 0.55
      ? "Declined – DTI too high"
      : "Approved / Borderline";

    return {
      ...f,
      scoreAdj,
      aprPctFinal,
      r,
      initFee,
      initFinanced,
      financed,
      balloonAmount,
      basePMT,
      monthly,
      totalServiceFees,
      totalRepay,
      totalInterestApprox,
      usedExpenses,
      minFromBalance,
      existingFinal,
      disposable,
      dti,
      dtiBand,
      endAge,
      termWithinAge,
      decision,
      notes,
    };
  }

  function onCalculate() {
    setResults(compute());
  }
  function onClear() {
    setResults(null);
  }

  async function onPDF() {
    if (!results) return alert("Calculate first.");
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "bold"); doc.setFontSize(16);
    doc.text(`Scend – ${results.loanType} Results`, w / 2, 56, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, w / 2, 72, { align: "center" });

    autoTable(doc, {
      startY: 96,
      styles: { fontSize: 10, cellPadding: 6, halign: "left" },
      head: [["Result", "Value"]],
      body: [
        ["APR (capped)", `${results.aprPctFinal.toFixed(2)}%`],
        ["Service fee (applied)", currency(results.requestedServiceFee)],
        ["Initiation fee", currency(results.initFee) + (results.initFinanced ? " (financed)" : " (upfront)")],
        ["Base instalment (excl. service)", currency(results.basePMT)],
        ["Monthly instalment", currency(results.monthly)],
        ...(results.loanType === "Vehicle Finance"
          ? [
              ["Deposit (applied)", currency(Math.max(0, results.depositAmount))],
              ["Balloon (end of term)", currency(results.balloonAmount)],
            ]
          : results.loanType === "Home Loan"
          ? [["Deposit (applied)", currency(Math.max(0, results.depositAmount))]]
          : []),
        ["Total interest (approx)", currency(results.totalInterestApprox)],
        ["Total service fees", currency(results.totalServiceFees)],
        ["Total repayment" + (results.loanType === "Vehicle Finance" ? " (incl. balloon)" : ""), currency(results.totalRepay)],
        ["Expenses used (MEN fallback)", currency(results.usedExpenses)],
        ["Assumed min from other balance", currency(results.minFromBalance)],
        ["Existing debts (final)", currency(results.existingFinal)],
        ["Disposable income", currency(results.disposable)],
        ["DTI (post-loan)", `${(results.dti * 100).toFixed(1)}% (${results.dtiBand})`],
        ["Term end age", `${results.endAge.toFixed(1)} yrs`],
        ["Decision", results.decision],
        ...(results.notes?.length ? results.notes.map((n: string) => ["Policy note", n]) : []),
      ],
      theme: "striped",
      headStyles: { fillColor: [219, 39, 119] },
    });

    // Disclaimer
    const y = (doc as any).lastAutoTable.finalY + 24;
    doc.setFont("helvetica", "italic"); doc.setFontSize(9);
    doc.text(
      "Disclaimer: Educational estimate only. Not financial advice. Subject to the National Credit Act (NCA), bank policies,\n" +
        "supporting documents and credit checks. Results may differ from a lender's assessment. Scend Pty Ltd does not store\n" +
        "personal data unless you explicitly send results via email.",
      56,
      y
    );

    doc.save(`Scend_${results.loanType.replace(/\s+/g, "")}_Results.pdf`);
  }

  /* ───────────────── UI ───────────────── */
  return (
    <div className="space-y-8">
      {/* Premium header */}
      <section className="rounded-3xl bg-gradient-to-br from-pink-50 via-white to-white p-8 shadow-sm ring-1 ring-gray-200/60">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Scend Loan Tool</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
            Compliant calculations with MEN fallback, APR & fee caps, deposit/balloon handling, and repo-linked mortgage caps.
          </p>
        </div>
      </section>

      {/* Main grid */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Form card */}
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-gray-200/70">
          <h2 className="text-lg font-semibold text-gray-900">Application details</h2>

          <div className="mt-5 grid gap-4">
            {/* Loan type, Amount, Term */}
            <div className="grid gap-3 md:grid-cols-3">
              <label className="text-[15px] text-gray-900 md:col-span-1">
                Loan type
                <select
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.loanType}
                  onChange={(e) => setF((v) => ({ ...v, loanType: e.target.value as any }))}
                >
                  {LOAN_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-[15px] text-gray-900">
                Amount / Price (R)
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.amount}
                  onChange={(e) => setF((v) => ({ ...v, amount: Number(e.target.value) }))}
                />
              </label>
              <label className="text-[15px] text-gray-900">
                Term (months)
                <input
                  type="number"
                  min={1}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.term}
                  onChange={(e) => setF((v) => ({ ...v, term: Number(e.target.value) }))}
                />
              </label>
            </div>

            {/* Mortgage repo */}
            {f.loanType === "Home Loan" && (
              <div className="grid gap-3 md:grid-cols-3">
                <label className="text-[15px] text-gray-900">
                  Current repo rate (%)
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                    value={f.repoPct}
                    onChange={(e) => setF((v) => ({ ...v, repoPct: Number(e.target.value) }))}
                  />
                </label>
              </div>
            )}

            {/* Type-specific */}
            {f.loanType === "Home Loan" && (
              <div className="grid gap-3 md:grid-cols-3">
                <label className="text-[15px] text-gray-900">
                  Deposit (R)
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                    value={f.depositAmount}
                    onChange={(e) => setF((v) => ({ ...v, depositAmount: Number(e.target.value) }))}
                  />
                </label>
              </div>
            )}

            {f.loanType === "Vehicle Finance" && (
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-[15px] text-gray-900">
                  Deposit (R)
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                    value={f.depositAmount}
                    onChange={(e) => setF((v) => ({ ...v, depositAmount: Number(e.target.value) }))}
                  />
                </label>
                <label className="text-[15px] text-gray-900">
                  Balloon (%)
                  <input
                    type="number"
                    min={0}
                    max={(caps.vehicle.policy?.maxBalloonPct ?? 0.4) * 100}
                    step={1}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                    value={f.balloonPct}
                    onChange={(e) => setF((v) => ({ ...v, balloonPct: Number(e.target.value) }))}
                  />
                </label>
              </div>
            )}

            {/* APR + Auto */}
            <div className="grid gap-3 md:grid-cols-3">
              <label className="md:col-span-2 text-[15px] text-gray-900">
                Proposed APR (%)
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.aprPercent}
                  onChange={(e) => setF((v) => ({ ...v, aprPercent: Number(e.target.value) }))}
                  disabled={f.autoAPR}
                />
                <span className="mt-1 block text-[12px] text-gray-700">
                  Cap for {f.loanType}: {(getCapAPRByLoanType(f.loanType, f.repoPct) * 100).toFixed(2)}%
                </span>
              </label>
              <label className="flex items-end gap-2 text-[15px] text-gray-900">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={f.autoAPR}
                  onChange={(e) => setF((v) => ({ ...v, autoAPR: e.target.checked }))}
                />
                <span>Auto APR</span>
              </label>
            </div>

            {/* Score + Employment + Age */}
            <div className="grid gap-3 md:grid-cols-3">
              <label className="text-[15px] text-gray-900">
                Credit score
                <input
                  type="number"
                  min={300}
                  max={900}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.creditScore}
                  onChange={(e) => setF((v) => ({ ...v, creditScore: Number(e.target.value) }))}
                />
              </label>
              <label className="text-[15px] text-gray-900">
                Employment type
                <select
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.employmentType}
                  onChange={(e) => setF((v) => ({ ...v, employmentType: e.target.value }))}
                >
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="text-[15px] text-gray-900">
                Age (years)
                <input
                  type="number"
                  min={18}
                  max={90}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.ageYears}
                  onChange={(e) => setF((v) => ({ ...v, ageYears: Number(e.target.value) }))}
                />
                <span className="mt-1 block text-[12px] text-gray-700">Term should end ≤ age {MAX_END_AGE}.</span>
              </label>
            </div>

            {/* Income / Debts */}
            <div className="grid gap-3 md:grid-cols-3">
              <label className="text-[15px] text-gray-900">
                Gross income (R)
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.gross}
                  onChange={(e) => setF((v) => ({ ...v, gross: Number(e.target.value) }))}
                />
              </label>
              <label className="text-[15px] text-gray-900">
                Net income (R)
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.net}
                  onChange={(e) => setF((v) => ({ ...v, net: Number(e.target.value) }))}
                />
              </label>
              <label className="text-[15px] text-gray-900">
                Existing monthly debts (R)
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.existingMonthlyDebts}
                  onChange={(e) => setF((v) => ({ ...v, existingMonthlyDebts: Number(e.target.value) }))}
                />
              </label>
            </div>

            {/* Expenses / owed */}
            <div className="grid gap-3 md:grid-cols-3">
              <label className="text-[15px] text-gray-900">
                Declared monthly living expenses (R)
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.declaredExpenses}
                  onChange={(e) => setF((v) => ({ ...v, declaredExpenses: Number(e.target.value) }))}
                />
              </label>
              <label className="text-[15px] text-gray-900">
                Current owed balance (R)
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.owedBalance}
                  onChange={(e) => setF((v) => ({ ...v, owedBalance: Number(e.target.value) }))}
                />
              </label>
              <label className="flex items-end gap-2 text-[15px] text-gray-900">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={f.applyMinPctFromBalance}
                  onChange={(e) => setF((v) => ({ ...v, applyMinPctFromBalance: e.target.checked }))}
                />
                <span>Apply assumed min from balance ({Math.round(DEFAULT_MIN_PCT * 100)}%)</span>
              </label>
            </div>

            {/* Service fee */}
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-[15px] text-gray-900">
                Service fee (monthly, R)
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.requestedServiceFee}
                  onChange={(e) => setF((v) => ({ ...v, requestedServiceFee: Number(e.target.value) }))}
                />
                <span className="mt-1 block text-[12px] text-gray-700">Clamped to cap automatically</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={onCalculate}
                className="glow rounded-2xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700"
              >
                Calculate
              </button>

              <button
                onClick={onClear}
                className="glow rounded-2xl px-4 py-2 text-sm font-semibold text-gray-900 bg-white ring-1 ring-gray-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-pink-200 disabled:opacity-50"
              >
                Clear
              </button>

              <button
                onClick={onPDF}
                className="glow rounded-2xl px-4 py-2 text-sm font-semibold text-gray-900 bg-white ring-1 ring-gray-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-pink-200 disabled:opacity-50"
              >
                Export PDF (Results only)
              </button>
            </div>
          </div>
        </div>

        {/* Results card */}
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-gray-200/70">
          <h2 className="text-lg font-semibold text-gray-900">Results</h2>

          {!results ? (
            <div className="mt-4 text-[15px] text-gray-700">
              Enter details and click <strong>Calculate</strong> to see results.
            </div>
          ) : (
            <div className="mt-4 grid gap-2 text-[15px]">
              <div className="flex items-center justify-between">
                <span>APR (capped)</span><span>{results.aprPctFinal.toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Service fee (applied)</span><span>{currency(results.requestedServiceFee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Initiation fee</span>
                <span>
                  {currency(results.initFee)} {results.initFinanced ? "(financed)" : "(upfront)"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Base instalment (excl. service)</span><span>{currency(results.basePMT)}</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Monthly instalment</span><span>{currency(results.monthly)}</span>
              </div>

              {results.loanType === "Vehicle Finance" && (
                <>
                  <div className="flex items-center justify-between">
                    <span>Deposit (applied)</span><span>{currency(Math.max(0, results.depositAmount))}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Balloon (end of term)</span><span>{currency(results.balloonAmount)}</span>
                  </div>
                  <div className="text-[12px] text-gray-700">Instalment excludes balloon. Balloon due at end of term.</div>
                </>
              )}
              {results.loanType === "Home Loan" && (
                <div className="flex items-center justify-between">
                  <span>Deposit (applied)</span><span>{currency(Math.max(0, results.depositAmount))}</span>
                </div>
              )}

              <div className="mt-2 grid gap-2 rounded-xl bg-gray-50 px-3 py-2">
                <div className="flex items-center justify-between">
                  <span>Total interest (approx)</span><span>{currency(results.totalInterestApprox)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total service fees</span><span>{currency(results.totalServiceFees)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>Total repayment{results.loanType === "Vehicle Finance" ? " (incl. balloon)" : ""}</span>
                  <span>{currency(results.totalRepay)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>Expenses used (MEN fallback)</span><span>{currency(results.usedExpenses)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Assumed min from other balance</span><span>{currency(results.minFromBalance)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Existing debts (final)</span><span>{currency(results.existingFinal)}</span>
              </div>

              <div className="mt-3 rounded-xl bg-gray-50 px-3 py-2">
                <div className="text-[13px] text-gray-700 font-medium mb-1">Affordability snapshot</div>
                <div className="grid gap-1 text-[13px] text-gray-700">
                  <div className="flex items-center justify-between">
                    <span>Net income</span>
                    <span>{currency(results.disposable + results.existingFinal + results.usedExpenses)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Expenses & debts used</span><span>included</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span>Disposable</span><span>{currency(results.disposable)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>DTI (post-loan)</span>
                <span>
                  {(results.dti * 100).toFixed(1)}%{" "}
                  <em className="text-[13px] text-gray-700">({results.dtiBand})</em>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Term end age</span><span>{results.endAge.toFixed(1)} yrs</span>
              </div>

              {results.notes?.length > 0 && (
                <div className="mt-2 rounded-xl bg-pink-50/70 px-3 py-2 text-[14px]">
                  <div className="font-semibold mb-1">Policy notes</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {results.notes.map((n: string, i: number) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3 rounded-xl bg-pink-50/70 px-3 py-2 text-[15px]">
                <strong>Decision: </strong>
                {results.decision}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white/60 p-4">
            <p className="text-[12.5px] leading-relaxed text-gray-700">
              <strong>Disclaimer:</strong> This tool provides an educational estimate only. It is not financial advice.
              All outcomes remain subject to the National Credit Act (NCA), lender policies, supporting documents,
              affordability assessments and credit checks. Actual results may differ from a lender’s assessment.
              Scend Pty Ltd does not store your personal data unless you explicitly choose to send your results via email.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
