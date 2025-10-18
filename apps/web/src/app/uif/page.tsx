"use client";

import { useMemo, useState } from "react";

type BenefitType = "unemployment" | "illness" | "maternity" | "adoption";

const ZAR = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" });
const AVG_DAYS_PER_MONTH = 30.4167;
const MONTHLY_THRESHOLD = 17712;
const THRESHOLD_ADR = MONTHLY_THRESHOLD / AVG_DAYS_PER_MONTH;

/** Sliding IRR: 60% → 38% (linear over capped ADR) */
function getSlidingIRR(adr: number) {
  if (adr <= 0) return 0.38;
  const ratio = Math.min(1, adr / THRESHOLD_ADR); // 0..1
  const irr = 0.60 - 0.22 * ratio;
  return Math.min(0.60, Math.max(0.38, irr));
}
function getCreditDays(months: number) {
  return Math.min(365, months * 7.5);
}

export default function UIFTool() {
  const [benefit, setBenefit] = useState<BenefitType>("unemployment");
  const [salary, setSalary]   = useState("10000");
  const [months, setMonths]   = useState("36");

  const calc = useMemo(() => {
    const avgSalary    = Math.max(0, parseFloat(salary || "0"));
    const monthsWorked = Math.max(0, parseInt(months || "0", 10));

    const cappedSalary = Math.min(avgSalary, MONTHLY_THRESHOLD);
    const employee     = cappedSalary * 0.01;
    const employer     = cappedSalary * 0.01;

    const adrActual = avgSalary / AVG_DAYS_PER_MONTH;
    const adrCapped = Math.min(adrActual, THRESHOLD_ADR);

    let irr = getSlidingIRR(adrCapped);
    let maxDays = 365, useCredit = true;

    switch (benefit) {
      case "illness":    maxDays = 238; break;
      case "maternity":  irr = 0.66; maxDays = 121; useCredit = false; break;
      case "adoption":   irr = 0.66; maxDays = 65;  useCredit = false; break;
    }

    const earned    = getCreditDays(monthsWorked);
    const eligible  = useCredit ? Math.min(earned, maxDays) : maxDays;

    const dailyBenefit   = adrCapped * irr;
    const monthlyBenefit = dailyBenefit * 30;
    const total          = dailyBenefit * eligible;

    return {
      benefit, avgSalary, monthsWorked, cappedSalary, employee, employer,
      adrActual, adrCapped, irr, eligible, earned, maxDays,
      dailyBenefit, monthlyBenefit, total
    };
  }, [benefit, salary, months]);

  function clearForm() { setSalary(""); setMonths(""); }

  async function exportPDF() {
    try {
      const mod = await import("jspdf");
      // @ts-ignore
      const doc = new mod.jsPDF();
      doc.setFontSize(12);
      doc.text("UIF Benefit Estimate", 14, 14);
      doc.text(`Benefit: ${calc.benefit}`, 14, 22);
      doc.text(`Avg Monthly Salary: ${ZAR.format(calc.avgSalary)}`, 14, 30);
      doc.text(`ADR (Capped): ${ZAR.format(calc.adrCapped)}`, 14, 38);
      doc.text(`IRR: ${(calc.irr * 100).toFixed(2)}%`, 14, 46);
      doc.text(`Daily Benefit: ${ZAR.format(calc.dailyBenefit)}`, 14, 54);
      doc.text(`Monthly Benefit (~30d): ${ZAR.format(calc.monthlyBenefit)}`, 14, 62);
      doc.text(`Eligible Days: ${calc.eligible}`, 14, 70);
      doc.text(`Total Estimated Payout: ${ZAR.format(calc.total)}`, 14, 78);
      doc.setFontSize(10);
      doc.text("Note: Estimate only. Department of Labour/UIF verifies & has final say.", 14, 92, { maxWidth: 180 });
      doc.save("uif-estimate.pdf");
    } catch { window.print(); }
  }

  /** Print just the documents checklist */
  function printChecklist() {
    const node = document.getElementById("docs-checklist");
    if (!node) return window.print();
    const w = window.open("", "_blank", "noopener,noreferrer,width=800,height=900");
    if (!w) return;
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>UIF Documents Checklist</title>
      <style>
        body{font-family:system-ui,Arial,sans-serif;padding:24px;line-height:1.5;}
        h1{font-size:20px;margin:0 0 12px;}
        ul{margin:0 0 8px 18px;}
        li{margin:4px 0;}
        .muted{color:#555;}
        .note{background:#f9fafb;border:1px solid #e5e7eb;padding:8px;border-radius:8px;margin-top:8px;}
        a{color:#be185d;text-decoration:underline;}
      </style></head><body>`);
    w.document.write(`<h1>UIF Documents Checklist</h1>`);
    w.document.write(node.innerHTML);
    w.document.write(`<p class="note muted">This checklist is for guidance. Always confirm with the Department of Labour/UIF.</p>`);
    w.document.write(`</body></html>`);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  }

  function A(props: { href: string; children: React.ReactNode }) {
    return <a className="text-pink-700 underline" target="_blank" rel="noopener noreferrer" href={props.href}>{props.children}</a>;
  }

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <details className="bg-gray-50 p-4 rounded" open>
        <summary className="font-semibold cursor-pointer">{title}</summary>
        <div className="mt-3 space-y-2 text-sm">{children}</div>
      </details>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">UIF Tool (Estimator)</h1>
      <p className="text-gray-600">
        Choose a benefit type. Calculations use a sliding IRR (where applicable) and cap benefits at the UIF ceiling.
      </p>

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block font-medium">Benefit Type</label>
          <select className="w-full border p-2 rounded" value={benefit}
            onChange={(e) => setBenefit(e.target.value as BenefitType)}>
            <option value="unemployment">Unemployment</option>
            <option value="illness">Illness</option>
            <option value="maternity">Maternity</option>
            <option value="adoption">Adoption</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Average Monthly Salary (ZAR)</label>
          <input type="number" min="0" step="0.01" className="w-full border p-2 rounded"
            value={salary} onChange={(e) => setSalary(e.target.value)} />
          <p className="text-sm text-gray-500 mt-1">Use average gross of last 6 months.</p>
        </div>
        <div>
          <label className="block font-medium">Months Contributed (last 4 years)</label>
          <input type="number" min="1" step="1" className="w-full border p-2 rounded"
            value={months} onChange={(e) => setMonths(e.target.value)} />
          <p className="text-sm text-gray-500 mt-1">Earn ≈7.5 credit days/month (max 365).</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={() => {}} className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">Calculate</button>
        <button onClick={clearForm} className="border px-4 py-2 rounded hover:bg-gray-50">Clear</button>
        <button onClick={exportPDF} className="border px-4 py-2 rounded hover:bg-gray-50">Export PDF</button>
      </div>

      {/* Results */}
      <Section title="Estimate">
        <ul className="space-y-1">
          <li><b>Benefit:</b> {benefit}</li>
          <li>ADR (Actual): {ZAR.format(calc.adrActual)}</li>
          <li>ADR (Capped): {ZAR.format(calc.adrCapped)}</li>
          <li>IRR: {(calc.irr * 100).toFixed(2)}%</li>
          <li>Daily Benefit: {ZAR.format(calc.dailyBenefit)}</li>
          <li>Monthly Benefit (~30d): <b>{ZAR.format(calc.monthlyBenefit)}</b></li>
          <li>Eligible Days: <b>{calc.eligible}</b> {(benefit==="unemployment"||benefit==="illness") ? `(credits: ${calc.earned.toFixed(0)}, cap: ${calc.maxDays})` : `(statutory cap: ${calc.maxDays})`}</li>
          <li>Total Potential Payout: <b>{ZAR.format(calc.total)}</b></li>
        </ul>
        <p className="text-xs text-gray-600 mt-2">
          Note: “Total Potential Payout” is the cumulative amount over your eligible days; UIF pays in monthly instalments, not as a once-off lump sum.
        </p>
      </Section>

      {/* Disclaimers */}
      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm text-gray-700">
        <b>Important:</b> This is an estimate for planning. The Department of Labour/UIF verifies all records and
        has the final say. Calculations use current caps and widely used UIF rules, so results should be close to what is paid.
      </div>

      {/* Collapsible: Eligibility */}
      <Section title="Who Qualifies for UIF and When You Can Claim">
        <p>
          UIF protects contributors who stop working or earning due to reasons <b>beyond their control</b>.
          You must have contributed (1% employee + 1% employer) and apply within 6 months of employment ending.
        </p>
        <h4 className="font-semibold">✅ Qualifying reasons</h4>
        <ul className="list-disc pl-5">
          <li>Retrenchment or downsizing</li>
          <li>End of fixed-term or project contract</li>
          <li>Employer closure/liquidation, or death (domestic workers)</li>
          <li>Illness or injury certified by a doctor</li>
          <li>Maternity leave (up to 121 days at ±66%)</li>
          <li>Adoption of a child under 2 years (up to 65 days at ±66%)</li>
          <li>Death of a contributor (dependants may claim)</li>
        </ul>
        <h4 className="font-semibold">🚫 Not covered</h4>
        <ul className="list-disc pl-5">
          <li>Voluntary resignation</li>
          <li>Dismissal for misconduct/fraud</li>
          <li>Absconding from work</li>
          <li>Receiving full salary during notice or leave</li>
          <li>Already receiving a pension/social grant replacing income</li>
        </ul>
        <h4 className="font-semibold">⏳ Claim timeframes</h4>
        <ul className="list-disc pl-5">
          <li><b>Unemployment:</b> up to 365 days (based on credits)</li>
          <li><b>Illness:</b> up to 238 days (medical certificate required)</li>
          <li><b>Maternity:</b> up to 121 days</li>
          <li><b>Adoption:</b> up to 65 days</li>
          <li><b>Death (dependants):</b> claim within 18 months</li>
        </ul>
        <div className="bg-gray-100 p-3 rounded text-sm text-gray-700">
          <b>After your benefit period ends:</b> UIF stops paying once eligible days are used.
          You can claim again only after working and contributing long enough to earn new credit days.
        </div>
      </Section>

      {/* Collapsible: Documents + print */}
      <Section title="Documents Required Before Visiting Labour (with download links)">
        <div id="docs-checklist">
          <ul className="list-disc pl-5">
            <li><b>SA ID/Smart ID</b> (or valid passport + work permit for foreign nationals)</li>
            <li><b>UI-19</b> — Employer declaration (employment start/end, reason for termination). <A href="https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI19_employers%20declarations.pdf">Download UI-19</A></li>
            <li><b>UI-2.8</b> — Banking details form (stamped by bank). <A href="https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-2_8-authorisation-pay-benefits-into-banking-account.pdf">Download UI-2.8</A></li>
            <li><b>Recent bank statement</b> (shows account holder & number)</li>
            <li><b>Payslips / proof of earnings</b> for the last 6 months</li>
            <li><b>Proof of termination</b> (retrenchment/contract expiry/closure letter)</li>
            <li>For <b>Illness</b>: Medical certificate; optionally UI-2.7 (income while on leave). <A href="https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-2_7-remuneration-whilst-in-employment.pdf">Download UI-2.7</A></li>
            <li>For <b>Maternity</b>: UI-2.3 application + doctor/midwife certificate. <A href="https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-2-3_application-for-martenity-benefits.pdf">Download UI-2.3</A></li>
            <li>For <b>Adoption/Parental</b>: Adoption order / parental form (UI-2.9). <A href="https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-2_9-payment-of-parental-benefits-terms-of-regulation6%283%29.pdf">Download UI-2.9</A></li>
            <li>For <b>Death (dependants)</b>: Death certificate + proof of relationship</li>
          </ul>
          <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded mt-2">
            Tip: Keep both physical and digital copies. Submit within 6 months of termination to avoid forfeiting benefits.
          </p>
        </div>
        <div className="mt-2">
          <button onClick={printChecklist} className="border px-3 py-2 rounded hover:bg-gray-50">Print Checklist</button>
          <span className="text-sm text-gray-600 ml-2">Opens a printer-friendly checklist.</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          More forms and updates: <A href="https://www.labour.gov.za/DocumentCenter/Pages/Forms.aspx?FolderCTID=0x012000D5ECDCDA58282140A4A77318EE711621&RootFolder=%2FDocumentCenter%2FForms%2FUnemployment%20Insurance%20Fund">Department of Labour: UIF Forms</A>
        </p>
      </Section>
    </main>
  );
}
