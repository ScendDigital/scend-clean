"use client";

import * as React from "react";
import {
  clampRateToCap,
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

/* Helpers */
const currency = (n: number) =>
  (isFinite(n) ? n : 0).toLocaleString("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 2 });

const DEFAULT_MIN_PCT = 0.03; // assumed min payment from other balance
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

    depositAmount: 0,            // home & vehicle
    balloonPct: 0,               // vehicle

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

    // Policy: vehicle clamps
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
      balloonAmount = priceAfterDeposit * Math.max(0, balloonPct) / 100;
      const pvBalloon = balloonAmount / Math.pow(1 + r, f.term);
      financed = Math.max(0, priceAfterDeposit - pvBalloon) + (initFinanced ? initFee : 0);
    }
    // Personal/Credit Card -> financed already set

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
    const termWithinAge = endAge <= 70;
    if (!termWithinAge) notes.push(`Term ends at age ${endAge.toFixed(1)} (> ${MAX_END_AGE})`);

    // Decision (policy)
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
    doc.text(`Scend – ${results.loanType} Results`, w/2, 56, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, w/2, 72, { align: "center" });

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
        ["DTI (post-loan)", `${(results.dti*100).toFixed(1)}% (${results.dtiBand})`],
        ["Term end age", `${results.endAge.toFixed(1)} yrs`],
        ["Decision", results.decision],
        ...(results.notes?.length ? results.notes.map((n: string)=>["Policy note", n]) : []),
      ],
      theme: "striped",
      headStyles: { fillColor: [219, 39, 119] },
    });

    doc.save(`Scend_${results.loanType.replace(/\s+/g,"")}_Results.pdf`);
  }

  function shareText() {
    if (!results) return "";
    return [
      `Scend – ${results.loanType} Results`,
      `APR (capped): ${results.aprPctFinal.toFixed(2)}%`,
      `Instalment: ${currency(results.monthly)}`,
      ...(results.loanType === "Vehicle Finance"
        ? [`Deposit: ${currency(Math.max(0, results.depositAmount))}`, `Balloon (end): ${currency(results.balloonAmount)}`]
        : results.loanType === "Home Loan"
        ? [`Deposit: ${currency(Math.max(0, results.depositAmount))}`]
        : []),
      `Total repay${results.loanType === "Vehicle Finance" ? " (incl. balloon)" : ""}: ${currency(results.totalRepay)}`,
      `DTI: ${(results.dti*100).toFixed(1)}% (${results.dtiBand})`,
      `Disposable: ${currency(results.disposable)}`,
      ...(results.notes?.length ? [`Notes: ${results.notes.join("; ")}`] : []),
      `Decision: ${results.decision}`,
      `Generated: ${new Date().toLocaleString()}`,
    ].join("\n");
  }

  async function onEmail() {
    if (!results) return alert("Calculate first.");
    const to = prompt("Recipient email:");
    if (!to) return;
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject: `Scend – ${results.loanType} Results`, text: shareText() }),
    });
    alert("Email sent (see server logs for details).");
  }
  function onWhatsApp() {
    if (!results) return alert("Calculate first.");
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText())}`, "_blank");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Scend Loan Tool</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Form */}
        <div className="rounded-2xl border p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="col-span-2">
              Loan type
              <select className="mt-1 w-full border rounded p-2" value={f.loanType}
                onChange={e=>setF(v=>({...v, loanType: e.target.value as any}))}>
                {LOAN_TYPES.map(t=> <option key={t}>{t}</option>)}
              </select>
            </label>

            <label>
              Amount / Price (R)
              <input type="number" className="mt-1 w-full border rounded p-2" value={f.amount}
                onChange={e=>setF(v=>({...v, amount: Number(e.target.value)}))}/>
            </label>
            <label>
              Term (months)
              <input type="number" className="mt-1 w-full border rounded p-2" value={f.term}
                onChange={e=>setF(v=>({...v, term: Number(e.target.value)}))}/>
            </label>
          </div>

          {f.loanType === "Home Loan" && (
            <label className="block">
              Deposit (R)
              <input type="number" className="mt-1 w-full border rounded p-2" value={f.depositAmount}
                onChange={e=>setF(v=>({...v, depositAmount: Number(e.target.value)}))}/>
            </label>
          )}

          {f.loanType === "Vehicle Finance" && (
            <div className="grid grid-cols-2 gap-3">
              <label>
                Deposit (R)
                <input type="number" className="mt-1 w-full border rounded p-2" value={f.depositAmount}
                  onChange={e=>setF(v=>({...v, depositAmount: Number(e.target.value)}))}/>
              </label>
              <label>
                Balloon (%)
                <input type="number" className="mt-1 w-full border rounded p-2" value={f.balloonPct}
                  onChange={e=>setF(v=>({...v, balloonPct: Number(e.target.value)}))}/>
              </label>
            </div>
          )}

          {/* Mortgage repo */}
          {f.loanType === "Home Loan" && (
            <label className="block">
              Current repo rate (%)
              <input type="number" className="mt-1 w-full border rounded p-2" value={f.repoPct}
                onChange={e=>setF(v=>({...v, repoPct: Number(e.target.value)}))}/>
            </label>
          )}

          {/* APR */}
          <div className="grid grid-cols-2 gap-3">
            <label className="col-span-2 flex items-center gap-2">
              <input type="checkbox" checked={f.autoAPR} onChange={e=>setF(v=>({...v, autoAPR: e.target.checked}))}/>
              Auto APR
            </label>
            <label className="col-span-2">
              Proposed APR (%)
              <input type="number" className="mt-1 w-full border rounded p-2" value={f.aprPercent} disabled={f.autoAPR}
                onChange={e=>setF(v=>({...v, aprPercent: Number(e.target.value)}))}/>
              <div className="text-xs text-gray-600 mt-1">
                Cap for {f.loanType}: {(getCapAPRByLoanType(f.loanType, f.repoPct)*100).toFixed(2)}%
              </div>
            </label>
          </div>

          {/* Score / Employment / Age */}
          <div className="grid grid-cols-3 gap-3">
            <label>
              Credit score
              <input type="number" className="mt-1 w-full border rounded p-2" value={f.creditScore}
                onChange={e=>setF(v=>({...v, creditScore: Number(e.target.value)}))}/>
            </label>
            <label>
              Employment type
              <select className="mt-1 w-full border rounded p-2" value={f.employmentType}
                onChange={e=>setF(v=>({...v, employmentType: e.target.value}))}>
                {EMPLOYMENT_TYPES.map(t=> <option key={t}>{t}</option>)}
              </select>
            </label>
            <label>
              Age (years)
              <input type="number" className="mt-1 w-full border rounded p-2" value={f.ageYears}
                onChange={e=>setF(v=>({...v, ageYears: Number(e.target.value)}))}/>
            </label>
          </div>

          {/* Income & debts */}
          <div className="grid grid-cols-3 gap-3">
            <label>
              Gross income (R)
              <input type="number" className="mt-1 w-full border rounded p-2" value={f.gross}
                onChange={e=>setF(v=>({...v, gross: Number(e.target.value)}))}/>
            </label>
            <label>
              Net income (R)
              <input type="number" className="mt-1 w-full border rounded p-2" value={f.net}
                onChange={e=>setF(v=>({...v, net: Number(e.target.value)}))}/>
            </label>
            <label>
              Existing monthly debts (R)
              <input type="number" className="mt-1 w-full border rounded p-2" value={f.existingMonthlyDebts}
                onChange={e=>setF(v=>({...v, existingMonthlyDebts: Number(e.target.value)}))}/>
            </label>
          </div>

          {/* Expenses & owed */}
          <div className="grid grid-cols-3 gap-3">
            <label>
              Declared expenses (R)
              <input type="number" className="mt-1 w-full border rounded p-2" value={f.declaredExpenses}
                onChange={e=>setF(v=>({...v, declaredExpenses: Number(e.target.value)}))}/>
            </label>
            <label>
              Current owed balance (R)
              <input type="number" className="mt-1 w-full border rounded p-2" value={f.owedBalance}
                onChange={e=>setF(v=>({...v, owedBalance: Number(e.target.value)}))}/>
            </label>
            <label className="flex items-end gap-2">
              <input type="checkbox" checked={f.applyMinPctFromBalance}
                onChange={e=>setF(v=>({...v, applyMinPctFromBalance: e.target.checked}))}/>
              Apply assumed min from balance ({Math.round(DEFAULT_MIN_PCT*100)}%)
            </label>
          </div>

          {/* Service fee */}
          <label className="block">
            Service fee (monthly, R)
            <input type="number" className="mt-1 w-full border rounded p-2" value={f.requestedServiceFee}
              onChange={e=>setF(v=>({...v, requestedServiceFee: Number(e.target.value)}))}/>
            <div className="text-xs text-gray-600 mt-1">
              Clamped to cap automatically (R {caps.serviceFeeMax.toFixed(2)})
            </div>
          </label>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button onClick={onCalculate} className="bg-pink-600 text-white px-4 py-2 rounded">Calculate</button>
            <button onClick={onPDF} className="border px-4 py-2 rounded">Export PDF</button>
            <button onClick={onClear} className="glow rounded-2xl px-4 py-2 text-sm font-semibold text-gray-900 bg-white ring-1 ring-gray-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-pink-200 disabled:opacity-50border px-4 py-2 rounded
            <button onClick={onEmail} className="border px-4 py-2 rounded">Email</button>
            <button onClick={onWhatsApp} className="border px-4 py-2 rounded">WhatsApp</button>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-2xl border p-4">
          {!results ? (
            <p>Enter details and click <b>Calculate</b> to see results.</p>
          ) : (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>APR (capped)</span><span>{results.aprPctFinal.toFixed(2)}%</span></div>
              <div className="flex justify-between"><span>Service fee (applied)</span><span>{currency(results.requestedServiceFee)}</span></div>
              <div className="flex justify-between"><span>Initiation fee</span><span>{currency(results.initFee)} {results.initFinanced ? "(financed)" : "(upfront)"}</span></div>
              <div className="flex justify-between"><span>Base instalment</span><span>{currency(results.basePMT)}</span></div>
              <div className="flex justify-between font-semibold"><span>Monthly instalment</span><span>{currency(results.monthly)}</span></div>

              {results.loanType === "Vehicle Finance" && (
                <>
                  <div className="flex justify-between"><span>Deposit (applied)</span><span>{currency(results.depositAmount)}</span></div>
                  <div className="flex justify-between"><span>Balloon (end of term)</span><span>{currency(results.balloonAmount)}</span></div>
                  <div className="text-xs text-gray-600">Instalment excludes balloon; balloon due at term end.</div>
                </>
              )}
              {results.loanType === "Home Loan" && (
                <div className="flex justify-between"><span>Deposit (applied)</span><span>{currency(results.depositAmount)}</span></div>
              )}

              <div className="mt-2 rounded bg-gray-50 p-2 space-y-1">
                <div className="flex justify-between"><span>Total interest (approx)</span><span>{currency(results.totalInterestApprox)}</span></div>
                <div className="flex justify-between"><span>Total service fees</span><span>{currency(results.totalServiceFees)}</span></div>
                <div className="flex justify-between font-semibold"><span>Total repayment{results.loanType==="Vehicle Finance"?" (incl. balloon)":""}</span><span>{currency(results.totalRepay)}</span></div>
              </div>

              <div className="flex justify-between"><span>Expenses used (MEN)</span><span>{currency(results.usedExpenses)}</span></div>
              <div className="flex justify-between"><span>Assumed min from other balance</span><span>{currency(results.minFromBalance)}</span></div>
              <div className="flex justify-between"><span>Existing debts (final)</span><span>{currency(results.existingFinal)}</span></div>

              <div className="mt-2 rounded bg-gray-50 p-2 space-y-1">
                <div className="flex justify-between"><span>Disposable income</span><span>{currency(results.disposable)}</span></div>
                <div className="flex justify-between"><span>DTI (post-loan)</span><span>{(results.dti*100).toFixed(1)}% ({results.dtiBand})</span></div>
                <div className="flex justify-between"><span>Term end age</span><span>{results.endAge.toFixed(1)} yrs</span></div>
              </div>

              {results.notes?.length > 0 && (
                <div className="mt-2 rounded bg-pink-50 p-2">
                  <div className="font-semibold">Policy notes</div>
                  <ul className="list-disc pl-4">
                    {results.notes.map((n: string, i: number)=><li key={i}>{n}</li>)}
                  </ul>
                </div>
              )}

              <div className="mt-2 rounded bg-pink-50 p-2">
                <b>Decision:</b> {results.decision}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

