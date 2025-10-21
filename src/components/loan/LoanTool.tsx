"use client";

import { NCA_MAX_APR } from "../../lib/loanLogic";
import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/** Keep local alias for consistency with existing code paths. */
const NCA_MAX_RATE = NCA_MAX_APR;

type LoanType = "personal" | "vehicle" | "home" | "credit_card";

function clamp(n: number, min: number, max: number) { return Math.min(Math.max(n, min), max); }
function round2(n: number) { return Math.round(n * 100) / 100; }
function fmtMoney(n: number) { return n.toLocaleString("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 2 }); }

/** Parse numbers accepting comma decimals (e.g., "11,49"). */
function toNum(input: any): number {
  if (input === "" || input === null || input === undefined) return 0;
  const s = String(input).trim().replace(/[^\d,.\-]/g, "");
  let norm = s;
  if (/,/.test(s) && /\./.test(s)) norm = s.replace(/,/g, "");
  else norm = s.replace(",", ".");
  const n = parseFloat(norm);
  return Number.isFinite(n) ? n : 0;
}

/** PMT with optional FV (balloon). Rates are monthly decimals. */
function pmt(rate: number, nper: number, pv: number, fv: number = 0): number {
  if (rate === 0) return -(pv + fv) / nper;
  const r1 = Math.pow(1 + rate, nper);
  return -(pv * rate * r1 + fv * rate) / (r1 - 1);
}

type Result = {
  product: LoanType;
  rateUsed: number;       // annual %
  monthlyRate: number;    // decimal
  financedPV: number;     // principal - deposit (or CC balance)
  balloonFV: number;      // FV at term end
  payment: number;        // monthly repayment (core, excl. CC fee in target-mode)
  firstMonthOutflow: number; // includes fee for CC minimum-mode
  avgMonthlyOutflow?: number; // CC minimum-mode average payment including fees
  totalInterest: number;
  totalFees: number;      // service fees (credit card)
  totalRepayable: number;
  dti: number;            // decimal (SA style: (existing debts + new loan)/income)
  disposableIncome: number;  // R/month left after expenses+debts+this loan
  disposableRatio?: number;  // disposableIncome ÷ income
  affordabilityNote: string;
  approval: { bucket: "High"|"Moderate"|"Caution"|"Low"; chancePct: number; reason: string };
  scoreAuto?: number;     // auto-estimated score (0–999)
  monthsToClear?: number; // credit card minimum-mode payoff months
  negAmWarning?: boolean; // credit card: min payment < interest+fee
};

const Card: React.FC<{ title?: string; children: React.ReactNode; footer?: React.ReactNode; className?: string }> = ({ title, children, footer, className }) => (
  <div className={`rounded-2xl border shadow-sm bg-white ${className ?? ""}`}>
    {title && <div className="px-5 py-4 border-b"><h3 className="font-semibold">{title}</h3></div>}
    <div className="px-5 py-4">{children}</div>
    {footer && <div className="px-5 py-3 border-t bg-gray-50 rounded-b-2xl">{footer}</div>}
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode; hint?: string; right?: React.ReactNode }> = ({ label, children, hint, right }) => (
  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-3 items-center">
    <div className="text-sm text-gray-600">{label}</div>
    <div>{children}</div>
    {right && <div className="justify-self-end">{right}</div>}
    {hint && <div className="md:col-start-2 text-xs text-gray-500">{hint}</div>}
  </div>
);

type AprExplain = { source: "auto" | "manual"; dti?: number; score?: number; capped?: boolean; value: number };

/** Simple auto-APR heuristic (product base ± DTI/score nudges, capped). */
function deriveApr(
  loanType: LoanType,
  provisionalDti: number,           // 0..1
  score?: number                    // 0..999 (optional)
): number {
  let base =
    loanType === "personal"    ? 18 :
    loanType === "vehicle"     ? 14 :
    loanType === "home"        ? 12 :
                                  21; // credit_card
  if (provisionalDti <= 0.30) base -= 1.0;
  else if (provisionalDti <= 0.40) base += 0.5;
  else if (provisionalDti <= 0.50) base += 1.25;
  else base += 2.0;

  if (typeof score === "number" && isFinite(score)) {
    if (score >= 720) base -= 1.0;
    else if (score >= 680) base -= 0.5;
    else if (score <= 560) base += 1.0;
  }

  base = clamp(base, 6, NCA_MAX_RATE);
  return Math.round(base * 100) / 100;
}

export default function LoanTool() {
  // --- Inputs ---
  const [loanType, setLoanType] = useState<LoanType>("personal");

  const [enforceCap, setEnforceCap] = useState(true);
  const [amount, setAmount] = useState<number | "">("");
  const [deposit, setDeposit] = useState<number | "">("");
  const [balloonPct, setBalloonPct] = useState<number | "">("");
  const [termMonths, setTermMonths] = useState<number | "">(60);
  const [apr, setApr] = useState<number | string>("");

  const [income, setIncome] = useState<number | "">("");
  const [expenses, setExpenses] = useState<number | "">("");
  const [otherDebt, setOtherDebt] = useState<number | "">("");

  // Credit score handling
  const [autoScore, setAutoScore] = useState(true);
  const [autoApr, setAutoApr] = useState(true);
  const [creditScoreManual, setCreditScoreManual] = useState<number | "">("");

  // Credit card–specific inputs
  const [ccMinPct, setCcMinPct] = useState<number | "">(3);
  const [ccMinRand, setCcMinRand] = useState<number | "">(25);
  const [ccFee, setCcFee] = useState<number | "">(69);
  const [ccMinOnly, setCcMinOnly] = useState<boolean>(true);
  const [ccTotalLimit, setCcTotalLimit] = useState<number | "">("");

  // Results & UI
  const [res, setRes] = useState<Result | null>(null);
  const [dirty, setDirty] = useState(false);
  const markDirty = <T,>(setter: (v:T)=>void) => (v:T) => { setter(v); setDirty(true); };

  // (optional) last APR explanation (kept for possible UI chip)
  const [, setLastAprExplain] = useState<AprExplain | null>(null);

  // Derived helpers (per product)
  const limits = useMemo(() => {
    switch (loanType) {
      case "personal": return { min: 6, max: 72, balloonMax: 0, allowBalloon: false, showDeposit: false, labelAmount: "Loan amount (R)" }; // deposit hidden for Personal
      case "vehicle":  return { min: 12, max: 72, balloonMax: 40, allowBalloon: true,  showDeposit: true, labelAmount: "Vehicle price (R)" };
      case "home":     return { min: 120, max: 360, balloonMax: 0, allowBalloon: false, showDeposit: true, labelAmount: "Property price (R)" };
      case "credit_card": return { min: 6, max: 72, balloonMax: 0, allowBalloon: false, showDeposit: false, labelAmount: "Current balance (R)" };
    }
  }, [loanType]);

  // --- Auto score (0–999) heuristic ---
  function estimateScore(dti: number, aprPct: number, util?: number): number {
    let score = 650;
    if (isFinite(dti)) {
      if (dti < 0.2) score += 120;
      else if (dti < 0.3) score += 80;
      else if (dti < 0.4) score += 40;
      else if (dti < 0.5) score += 0;
      else if (dti < 0.6) score -= 60;
      else score -= 120;
    }
    if (aprPct >= NCA_MAX_RATE * 0.9) score -= 60;
    else if (aprPct >= 20) score -= 30;
    else if (aprPct <= 12) score += 20;

    if (util !== undefined && isFinite(util)) {
      if (util < 0.3) score += 60;
      else if (util < 0.5) score += 20;
      else if (util < 0.75) score -= 20;
      else score -= 80;
    }
    return clamp(Math.round(score), 0, 999);
  }

  function compute() {
    // Base inputs
    const amt = toNum(amount);
    const dep = toNum(deposit);
    const balPct = toNum(balloonPct);
    const n = toNum(termMonths);
    const inc = toNum(income);
    const exp = toNum(expenses);
    const oth = toNum(otherDebt);

    // --- Provisional payment to seed DTI for APR auto-derivation ---
    let placeholderPayment = 0;
    if (loanType === "credit_card") {
      const minPct = toNum(ccMinPct) / 100;
      const minRand = toNum(ccMinRand);
      placeholderPayment = Math.max(minRand, amt * minPct) + toNum(ccFee);
    } else {
      const pvSeed = Math.max(0, amt - (loanType !== "credit_card" && limits?.showDeposit ? Math.max(0, dep) : 0));
      const balloonFVSeed = loanType === "vehicle" ? (amt * clamp(balPct, 0, limits?.balloonMax ?? 0) / 100) : 0;
      const rateSeed = 18 / 100 / 12; // neutral seed 18% APR -> monthly
      placeholderPayment = (n > 0 && pvSeed > 0) ? Math.abs(pmt(rateSeed, n, pvSeed, balloonFVSeed)) : 0;
    }
    // SA DTI style for seeding APR: existing debt + new commitment over income
    const dtiSeed = inc > 0 ? ((placeholderPayment + oth) / inc) : 1;

    // --- APR selection (auto derives only on click) ---
    const scoreSeed = autoScore ? (res?.scoreAuto ?? undefined) : toNum(creditScoreManual);
    let aprUsed = autoApr || !toNum(apr)
      ? deriveApr(loanType, dtiSeed, scoreSeed)
      : clamp(toNum(apr), 0, 100);

    if (enforceCap) aprUsed = Math.min(aprUsed, NCA_MAX_RATE);
    const monthlyRate = aprUsed / 100 / 12;

    // Mirror derived APR into the control only after Calculate
    if (autoApr) setApr(aprUsed.toFixed(2));

    // Save explanation chip
    try {
      setLastAprExplain({
        source: (autoApr || !toNum(apr)) ? "auto" : "manual",
        dti: dtiSeed,
        score: scoreSeed,
        capped: enforceCap && aprUsed === NCA_MAX_RATE,
        value: Math.round(aprUsed * 100) / 100
      });
    } catch {}

    // ==== CREDIT CARD LOGIC ====
    if (loanType === "credit_card") {
      const minPct = toNum(ccMinPct) / 100;
      const minRand = toNum(ccMinRand);
      const fee = toNum(ccFee);
      const limit = toNum(ccTotalLimit) || 0;

      if (amt <= 0 || monthlyRate < 0) { setRes(null); return; }

      if (ccMinOnly) {
        // Minimum-only simulation
        let firstMonthPay = 0, avgPay = 0, months = 0;
        let totalInt = 0, totalFee = 0, negAm = false, totalPaidCore = 0;
        let bal = amt;
        const capMonths = 600;

        while (bal > 0.01 && months < capMonths) {
          const interest = bal * monthlyRate;
          const minDueCore = Math.max(minRand, bal * minPct);
          const outflow = minDueCore + fee;
          if (months === 0) firstMonthPay = outflow;

          const principal = minDueCore - interest;
          if (principal <= 0) { negAm = true; break; }

          bal = Math.max(0, bal - principal);
          totalInt += interest;
          totalFee += fee;
          totalPaidCore += minDueCore;
          months++;
          avgPay += outflow;
        }
        if (months > 0) avgPay = avgPay / months;

        const totalRepay = round2(totalPaidCore + totalFee);

        // SA DTI: (existing debt + firstMonthPay) / income   (expenses excluded)
        const dti = inc > 0 ? (firstMonthPay + oth) / inc : 1;
        const util = limit > 0 ? amt / limit : undefined;
        const auto = estimateScore(dti, aprUsed, util);

        // Disposable income (for affordability blend)
        const disposableIncome = inc - exp - oth - firstMonthPay;
        const disposableRatio = inc > 0 ? disposableIncome / inc : 0;

        // Approval likelihood: combined DTI + disposable model
        let bucket: Result["approval"]["bucket"] = "Low";
        let chance = 10;
        if (dti <= 0.35 && disposableRatio >= 0.20) { bucket = "High"; chance = 85; }
        else if (dti <= 0.45 && disposableRatio >= 0.15) { bucket = "Moderate"; chance = 60; }
        else if (dti <= 0.55 ||  disposableRatio >= 0.10) { bucket = "Caution"; chance = 35; }
        else { bucket = "Low"; chance = 10; }
        if (auto >= 700) chance += 5; else if (auto <= 550) chance -= 5;
        chance = clamp(chance, 5, 95);

        // Affordability note (refined bands)
        let aff = "";
        if (inc <= 0) aff = "Enter monthly income to evaluate affordability.";
        else if (disposableRatio >= 0.20) aff = "Healthy: strong disposable income after commitments.";
        else if (disposableRatio >= 0.10) aff = "Moderate: positive disposable income; manageable but monitor cash flow.";
        else if (disposableRatio >= 0.00) aff = "Tight: small disposable income; consider lowering term, amount, or APR.";
        else aff = "Risk: negative disposable income after commitments.";

        setRes({
          product: "credit_card",
          rateUsed: round2(aprUsed),
          monthlyRate,
          financedPV: amt,
          balloonFV: 0,
          payment: round2(firstMonthPay - fee), // core component (excl. fee)
          firstMonthOutflow: round2(firstMonthPay),
          avgMonthlyOutflow: round2(avgPay),
          totalInterest: round2(totalInt),
          totalFees: round2(totalFee),
          totalRepayable: round2(totalRepay),
          dti,
          disposableIncome: round2(disposableIncome),
          disposableRatio,
          affordabilityNote: aff,
          approval: { bucket, chancePct: chance, reason: `DTI ${(dti*100).toFixed(1)}%; APR ${round2(aprUsed)}%` },
          scoreAuto: auto,
          monthsToClear: negAm ? undefined : months,
          negAmWarning: negAm
        });
        setDirty(false);
        return;
      } else {
        // Target months to clear
        if (n <= 0) { setRes(null); return; }
        const paymentCore = Math.abs(pmt(monthlyRate, n, amt, 0)); // excludes fee
        const totalRepayCore = paymentCore * n;
        const totalInt = totalRepayCore - amt;
        const totalFee = fee * n;

        // SA DTI: (existing debts + (paymentCore + fee)) / income
        const dti = inc > 0 ? (paymentCore + fee + oth) / inc : 1;

        const util = limit > 0 ? amt / limit : undefined;
        const auto = estimateScore(dti, aprUsed, util);

        const disposableIncome = inc - exp - oth - (paymentCore + fee);
        const disposableRatio = inc > 0 ? disposableIncome / inc : 0;

        let bucket: Result["approval"]["bucket"] = "Low";
        let chance = 10;
        if (dti <= 0.35 && disposableRatio >= 0.20) { bucket = "High"; chance = 85; }
        else if (dti <= 0.45 && disposableRatio >= 0.15) { bucket = "Moderate"; chance = 60; }
        else if (dti <= 0.55 ||  disposableRatio >= 0.10) { bucket = "Caution"; chance = 35; }
        else { bucket = "Low"; chance = 10; }
        if (auto >= 700) chance += 5; else if (auto <= 550) chance -= 5;
        chance = clamp(chance, 5, 95);

        let aff = "";
        if (inc <= 0) aff = "Enter monthly income to evaluate affordability.";
        else if (disposableRatio >= 0.20) aff = "Healthy: strong disposable income after commitments.";
        else if (disposableRatio >= 0.10) aff = "Moderate: positive disposable income; manageable but monitor cash flow.";
        else if (disposableRatio >= 0.00) aff = "Tight: small disposable income; consider lowering term, amount, or APR.";
        else aff = "Risk: negative disposable income after commitments.";

        setRes({
          product: "credit_card",
          rateUsed: round2(aprUsed),
          monthlyRate,
          financedPV: amt,
          balloonFV: 0,
          payment: round2(paymentCore),
          firstMonthOutflow: round2(paymentCore + fee),
          totalInterest: round2(totalInt),
          totalFees: round2(totalFee),
          totalRepayable: round2(totalRepayCore + totalFee),
          dti,
          disposableIncome: round2(disposableIncome),
          disposableRatio,
          affordabilityNote: aff,
          approval: { bucket, chancePct: chance, reason: `DTI ${(dti*100).toFixed(1)}%; APR ${round2(aprUsed)}%` },
          scoreAuto: auto,
          monthsToClear: n
        });
        setDirty(false);
        return;
      }
    }

    // ==== INSTALMENT LOANS (personal/vehicle/home) ====
    const monthlyBalloonPct = loanType === "vehicle" ? clamp(toNum(balloonPct), 0, limits?.balloonMax ?? 0) : 0;
    // SA standard: balloon = % of vehicle price (not PV)
    const balloonFV = loanType === "vehicle" ? (toNum(amount) * monthlyBalloonPct / 100) : 0;
    const financedPV = Math.max(0, amt - (limits?.showDeposit ? Math.max(0, dep) : 0));

    if (financedPV <= 0 || n <= 0) {
      setRes(null);
      return;
    }

    const payment = Math.abs(pmt(monthlyRate, n, financedPV, balloonFV));
    const totalRepay = round2(payment * n + balloonFV);
    const totalInterest = round2(totalRepay - financedPV);

    // SA DTI: (existing debts + new loan payment) / income  (expenses excluded)
    const dti = inc > 0 ? (payment + oth) / inc : 1;

    const disposableIncome = inc - exp - oth - payment;
    const disposableRatio = inc > 0 ? disposableIncome / inc : 0;

    const auto = estimateScore(dti, aprUsed);

    // Approval likelihood: combined DTI + disposable model
    let bucket: Result["approval"]["bucket"] = "Low";
    let chance = 10;
    if (dti <= 0.35 && disposableRatio >= 0.20) { bucket = "High"; chance = 85; }
    else if (dti <= 0.45 && disposableRatio >= 0.15) { bucket = "Moderate"; chance = 60; }
    else if (dti <= 0.55 ||  disposableRatio >= 0.10) { bucket = "Caution"; chance = 35; }
    else { bucket = "Low"; chance = 10; }
    if (auto >= 700) chance += 5; else if (auto <= 550) chance -= 5;
    chance = clamp(chance, 5, 95);

    let aff = "";
    if (inc <= 0) aff = "Enter monthly income to evaluate affordability.";
    else if (disposableRatio >= 0.20) aff = "Healthy: strong disposable income after commitments.";
    else if (disposableRatio >= 0.10) aff = "Moderate: positive disposable income; manageable but monitor cash flow.";
    else if (disposableRatio >= 0.00) aff = "Tight: small disposable income; consider lowering term, amount, or APR.";
    else aff = "Risk: negative disposable income after commitments.";

    setRes({
      product: loanType,
      rateUsed: round2(aprUsed),
      monthlyRate,
      financedPV,
      balloonFV,
      payment: round2(payment),
      firstMonthOutflow: round2(payment),
      totalInterest,
      totalFees: 0,
      totalRepayable: totalRepay,
      dti,
      disposableIncome: round2(disposableIncome),
      disposableRatio,
      affordabilityNote: aff,
      approval: { bucket, chancePct: chance, reason: `DTI ${(dti*100).toFixed(1)}%; APR ${round2(aprUsed)}%${enforceCap && aprUsed===NCA_MAX_RATE ? " (capped)" : ""}` },
      scoreAuto: auto
    });
    setDirty(false);
  }

  function clearAll() {
    setLoanType("personal");
    setAmount("");
    setDeposit("");
    setBalloonPct("");
    setTermMonths(60);
    setApr("");
    setEnforceCap(true);
    setIncome("");
    setExpenses("");
    setOtherDebt("");
    setAutoScore(true);
    setCreditScoreManual("");

    setCcMinPct(3);
    setCcMinRand(25);
    setCcFee(69);
    setCcMinOnly(true);
    setCcTotalLimit("");

    setRes(null);
    setDirty(false);
  }

  // Share helpers
  function shareSummary() {
    if (!res) return "Scend Loan result: Enter inputs and click Calculate.";
    const base = [
      `Scend Loan — ${res.product.toUpperCase()} (${res.rateUsed}% APR${enforceCap && res.rateUsed===NCA_MAX_RATE ? " capped" : ""})`,
      `Payment: ${fmtMoney(res.firstMonthOutflow)}/mo`,
      `Total repayable: ${fmtMoney(res.totalRepayable)}`,
      `DTI: ${(res.dti*100).toFixed(1)}% (${res.approval.bucket} ${res.approval.chancePct}%)`
    ];
    if (res.product === "credit_card" && res.monthsToClear) base.push(`Months to clear: ${res.monthsToClear}`);
    return base.join(" • ");
  }
  function waShare() {
    const text = encodeURIComponent(shareSummary() + " — " + (typeof window !== "undefined" ? window.location.href : ""));
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }
  function emailShare() {
    const subject = encodeURIComponent("Scend Loan result");
    const body = encodeURIComponent(shareSummary() + "\n\n" + (typeof window !== "undefined" ? window.location.href : ""));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }
  async function copyShare() {
    try { await navigator.clipboard.writeText(shareSummary() + " — " + (typeof window !== "undefined" ? window.location.href : "")); alert("Copied to clipboard"); }
    catch { alert("Copy failed"); }
  }

  function exportPDF() {
    if (!res) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Scend — Loan Calculation", 14, 16);
    doc.setFontSize(10);
    doc.text(`Type: ${res.product}`, 14, 23);

    const rows: any[] = [
      ["APR", `${res.rateUsed}%${enforceCap && res.rateUsed===NCA_MAX_RATE ? " (capped)" : ""}`],
      ["Monthly rate", `${round2(res.monthlyRate*100)}%`],
      ["Financed PV / Balance", fmtMoney(res.financedPV)],
      ["Balloon (FV at end)", fmtMoney(res.balloonFV)],
      ["Monthly payment (first month outflow)", fmtMoney(res.firstMonthOutflow)],
      ["Total interest", fmtMoney(res.totalInterest)],
      ["Total service fees", fmtMoney(res.totalFees)],
      ["Total repayable", fmtMoney(res.totalRepayable)],
      ["DTI", `${(res.dti*100).toFixed(1)}%`],
      ["Disposable income", `${fmtMoney(res.disposableIncome)} (${((res.disposableRatio ?? 0)*100).toFixed(1)}%)`],
      ["Approval likelihood", `${res.approval.bucket} (${res.approval.chancePct}%) — ${res.approval.reason}`]
    ];
    if (res.product === "credit_card") {
      if (res.avgMonthlyOutflow) rows.splice(4, 0, ["Average monthly outflow (min-mode)", fmtMoney(res.avgMonthlyOutflow)]);
      if (res.monthsToClear) rows.push(["Months to clear (estimate)", String(res.monthsToClear)]);
      if (res.negAmWarning) rows.push(["Warning", "Negative amortization: minimum does not cover interest + fee."]);
    }

    autoTable(doc, { startY: 30, head: [["Field","Value"]], body: rows, styles: { fontSize: 10 }, theme: "grid", margin: { left: 14, right: 14 } });

    const disclaimer = "Indicative only — not an offer of credit. Final approval, rate and terms are at the discretion of the credit provider and applicable regulators. APR guarded to ≤27.75% for NCA safety; lenders may differ.";
    const pageWidth = doc.internal.pageSize.getWidth();
    const footerY = doc.internal.pageSize.getHeight() - 12;
    doc.setFontSize(8);
    doc.text(disclaimer, 14, footerY, { maxWidth: pageWidth - 28 });

    doc.save("Scend_Loan_Result.pdf");
  }

  // UI
  return (
    <section className="mx-auto max-w-5xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Loan Tool</h1>
          <p className="text-sm text-gray-600">Branded, compliant estimates with affordability, DTI & approval likelihood. Manual <b>Calculate</b> trigger.</p>
        </div>
      </div>

      <Card title="Inputs" footer={
        <div className="flex flex-wrap gap-2">
          <button className="rounded-xl px-4 py-2 bg-pink-600 text-white hover:opacity-90" onClick={compute}>Calculate</button>
          <button className="rounded-xl px-4 py-2 border" onClick={clearAll}>Clear</button>
          <button className="rounded-xl px-4 py-2 border" onClick={exportPDF} disabled={!res}>Export PDF</button>
          {dirty && <span className="text-xs text-amber-600 self-center">Values changed — click <b>Calculate</b>.</span>}
        </div>
      }>
        <div className="grid gap-4">
          <Field label="Loan type">
            <select className="border rounded-lg px-3 py-2 w-full" value={loanType} onChange={e=>markDirty(setLoanType)(e.target.value as LoanType)}>
              <option value="personal">Personal</option>
              <option value="vehicle">Vehicle</option>
              <option value="home">Home</option>
              <option value="credit_card">Credit card</option>
            </select>
          </Field>

          <Field label={limits?.labelAmount ?? "Amount (R)"} hint={loanType==="personal" ? "Personal: amount required." : (loanType==="credit_card" ? "Outstanding revolving balance you want to clear." : "Asset price.")}>
            <input type="number" min={0} className="border rounded-lg px-3 py-2 w-56"
              value={amount} onChange={e=>markDirty(setAmount)(e.target.value===""? "": toNum(e.target.value))} />
          </Field>

          {limits?.showDeposit && (
            <Field label="Deposit (R)">
              <input type="number" min={0} className="border rounded-lg px-3 py-2 w-56"
                value={deposit} onChange={e=>markDirty(setDeposit)(e.target.value===""? "": toNum(e.target.value))} />
            </Field>
          )}

          {limits?.allowBalloon && (
            <Field label="Balloon (%)" hint="Common for vehicles. Capped at 40%.">
              <input type="number" min={0} max={limits?.balloonMax ?? 0} className="border rounded-lg px-3 py-2 w-28"
                value={balloonPct} onChange={e=>markDirty(setBalloonPct)(e.target.value===""? "": toNum(e.target.value))} />
            </Field>
          )}

          {/* Term */}
          <Field label={loanType==="credit_card" && !ccMinOnly ? "Target months to clear" : "Term (months)"}>
            <input type="number" min={limits?.min ?? 1} max={limits?.max ?? 360} className="border rounded-lg px-3 py-2 w-28"
              value={termMonths} onChange={e=>markDirty(setTermMonths)(e.target.value===""? "": toNum(e.target.value))} disabled={loanType==="credit_card" && ccMinOnly} />
          </Field>

          {/* APR */}
          <div className="mt-2 mb-1">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={autoApr}
                onChange={e => { setAutoApr(e.target.checked); setDirty(true); }}
              />
              <span className="text-sm">Auto-calculate interest (APR)</span>
            </label>
            <p className="text-xs opacity-70">
              {autoApr
                ? `APR will be auto-derived and capped ≤ ${NCA_MAX_APR}% when you click Calculate.`
                : "Enter APR manually, e.g. 11.49."}
            </p>
          </div>
          <Field label="Interest rate (APR, %)" hint={`Guarded by NCA ≤ ${NCA_MAX_APR}%`}>
            <div className="flex items-center gap-3">
              <input
                type="text"
                inputMode="decimal"
                className="border rounded-lg px-3 py-2 w-28 disabled:bg-gray-100"
                value={
                  autoApr
                    ? (typeof res?.rateUsed === "number" ? res.rateUsed.toFixed(2) : "")
                    : (typeof apr === "number" ? apr.toString() : (apr ?? ""))
                }
                onChange={e => markDirty(setApr)(e.target.value)}
                disabled={autoApr}
                placeholder={autoApr ? "(auto after Calculate)" : "e.g. 11.49 or 11,49"}
                aria-label="APR"
              />
            </div>
          </Field>

          {/* Income & debts for DTI */}
          <Field label="Monthly income (R)">
            <input type="number" min={0} className="border rounded-lg px-3 py-2 w-56"
              value={income} onChange={e=>markDirty(setIncome)(e.target.value===""? "": toNum(e.target.value))} />
          </Field>

          <Field label="Monthly expenses (R)" hint="Committed living expenses (excl. this loan)">
            <input type="number" min={0} className="border rounded-lg px-3 py-2 w-56"
              value={expenses} onChange={e=>markDirty(setExpenses)(e.target.value===""? "": toNum(e.target.value))} />
          </Field>

          <Field label="Other debt repayments (R)" hint="Existing monthly repayments (credit cards, other loans)">
            <input type="number" min={0} className="border rounded-lg px-3 py-2 w-56"
              value={otherDebt} onChange={e=>markDirty(setOtherDebt)(e.target.value===""? "": toNum(e.target.value))} />
          </Field>

          {/* Credit card extras */}
          {loanType==="credit_card" && (
            <>
              <Field label="Minimum payment rule">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={ccMinOnly} onChange={e=>markDirty(setCcMinOnly)(e.target.checked)} />
                    <span className="text-sm">Minimum only (simulate amortization)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">% of balance</span>
                    <input type="number" min={0} step={0.1} className="border rounded-lg px-2 py-1 w-20"
                      value={ccMinPct} onChange={e=>markDirty(setCcMinPct)(e.target.value===""? "": toNum(e.target.value))} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Min rand</span>
                    <input type="number" min={0} className="border rounded-lg px-2 py-1 w-24"
                      value={ccMinRand} onChange={e=>markDirty(setCcMinRand)(e.target.value===""? "": toNum(e.target.value))} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Monthly fee</span>
                    <input type="number" min={0} className="border rounded-lg px-2 py-1 w-24"
                      value={ccFee} onChange={e=>markDirty(setCcFee)(e.target.value===""? "": toNum(e.target.value))} />
                  </div>
                </div>
              </Field>

              <Field label="Total revolving limit (optional)" hint="Used to estimate utilization (balance ÷ limits) for auto score.">
                <input type="number" min={0} className="border rounded-lg px-3 py-2 w-56"
                  value={ccTotalLimit} onChange={e=>markDirty(setCcTotalLimit)(e.target.value===""? "": toNum(e.target.value))} />
              </Field>
            </>
          )}
        </div>
      </Card>

      <Card title="Results" footer={
        <div className="flex flex-wrap gap-2">
          <button className="rounded-xl px-3 py-2 border" onClick={waShare} disabled={!res}>Share WhatsApp</button>
          <button className="rounded-xl px-3 py-2 border" onClick={emailShare} disabled={!res}>Share Email</button>
          <button className="rounded-xl px-3 py-2 border" onClick={copyShare} disabled={!res}>Copy summary</button>
        </div>
      }>
        {res ? (
          <div className="grid gap-2">
            <div className="flex justify-between"><span>Product</span><b>{res.product}</b></div>
            <div className="flex justify-between"><span>Financed amount / Balance (PV)</span><b>{fmtMoney(res.financedPV)}</b></div>
            {res.product!=="credit_card" && (
              <div className="flex justify-between"><span>Balloon (FV at end)</span><b>{fmtMoney(res.balloonFV)}</b></div>
            )}
            <div className="flex justify-between"><span>APR (used)</span><b>{res.rateUsed}%</b></div>
            <div className="flex justify-between">
              <span>{res.product==="credit_card" ? "First month outflow" : "Monthly repayment"}</span>
              <b>{fmtMoney(res.firstMonthOutflow)}</b>
            </div>
            {res.avgMonthlyOutflow !== undefined && (
              <div className="flex justify-between">
                <span>Average monthly outflow (min-mode)</span>
                <b>{fmtMoney(res.avgMonthlyOutflow)}</b>
              </div>
            )}
            {res.monthsToClear !== undefined && (
              <div className="flex justify-between">
                <span>Months to clear</span>
                <b>{res.monthsToClear}</b>
              </div>
            )}
            <div className="flex justify-between"><span>Total interest</span><b>{fmtMoney(res.totalInterest)}</b></div>
            {res.totalFees>0 && (
              <div className="flex justify-between"><span>Total service fees</span><b>{fmtMoney(res.totalFees)}</b></div>
            )}
            <div className="flex justify-between"><span>Total repayable</span><b>{fmtMoney(res.totalRepayable)}</b></div>
            <div className="flex justify-between"><span>DTI</span><b>{(res.dti*100).toFixed(1)}%</b></div>
            <div className="flex justify-between">
              <span>Disposable income</span>
              <b>{fmtMoney(res.disposableIncome)} ({((res.disposableRatio ?? 0)*100).toFixed(1)}%)</b>
            </div>
            <div className="flex justify-between"><span>Approval likelihood</span><b>{res.approval.bucket} ({res.approval.chancePct}%)</b></div>
            {res.scoreAuto !== undefined && (
              <div className="flex justify-between">
                <span>Auto-estimated score</span>
                <b>{res.scoreAuto}</b>
              </div>
            )}
            {res.negAmWarning && (
              <p className="text-xs text-amber-700 mt-2">
                Warning: Minimum payment does not cover interest + fee (negative amortization). Increase payment or lower APR.
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">{res.affordabilityNote}</p>
            {enforceCap && res.rateUsed===NCA_MAX_RATE && (
              <p className="text-xs text-amber-600 mt-1">APR capped at {NCA_MAX_RATE}% for NCA guard.</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600">Enter inputs and click <b>Calculate</b> to see results.</p>
        )}
      </Card>

      {/* Global disclaimer for the tool */}
      <div className="text-xs text-gray-500 bg-gray-50 border rounded-xl p-3">
        <b>Disclaimer:</b> This calculator provides indicative results and does not constitute an offer of credit. Final
        approval, interest rate, fees and terms are determined by the credit provider and applicable regulators (e.g. under the NCA).
      </div>
    </section>
  );
}
