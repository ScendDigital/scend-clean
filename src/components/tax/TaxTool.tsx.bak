"use client";

import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ---------------- Tax years ----------------
type Bracket = { upTo: number; base: number; rate: number; excessOver: number };
type YearConfig = {
  label: string;
  taxYearEnd: Date;
  brackets: Bracket[];
  rebates: { primary: number; secondary65: number; tertiary75: number };
  mtc: { self: number; firstDep: number; additional: number }; // per month
  isProvisional?: boolean;
};

const BRACKETS_2425: Bracket[] = [
  { upTo: 237_100, base: 0, rate: 0.18, excessOver: 0 },
  { upTo: 370_500, base: 42_678, rate: 0.26, excessOver: 237_100 },
  { upTo: 512_800, base: 77_362, rate: 0.31, excessOver: 370_500 },
  { upTo: 673_000, base: 121_475, rate: 0.36, excessOver: 512_800 },
  { upTo: 857_900, base: 179_147, rate: 0.39, excessOver: 673_000 },
  { upTo: 1_817_000, base: 251_258, rate: 0.41, excessOver: 857_900 },
  { upTo: Number.POSITIVE_INFINITY, base: 644_489, rate: 0.45, excessOver: 1_817_000 },
];

const YEARS: Record<string, YearConfig> = {
  "2023/2024": {
    label: "2023/2024",
    taxYearEnd: new Date(2024, 1, 29),
    brackets: BRACKETS_2425,
    rebates: { primary: 17_235, secondary65: 9_444, tertiary75: 3_145 },
    mtc: { self: 364, firstDep: 364, additional: 246 },
  },
  "2024/2025": {
    label: "2024/2025",
    taxYearEnd: new Date(2025, 1, 28),
    brackets: BRACKETS_2425,
    rebates: { primary: 17_235, secondary65: 9_444, tertiary75: 3_145 },
    mtc: { self: 364, firstDep: 364, additional: 246 },
  },
  "2025/2026 (provisional)": {
    label: "2025/2026 (provisional)",
    taxYearEnd: new Date(2026, 1, 28),
    brackets: BRACKETS_2425,
    rebates: { primary: 17_235, secondary65: 9_444, tertiary75: 3_145 },
    mtc: { self: 364, firstDep: 364, additional: 246 },
    isProvisional: true,
  },
};

// Travel/Car allowance PAYE inclusion
const DEFAULT_CAR_ALLOWANCE_INCLUSION = 0.8;

function fmt(n: number) {
  return n.toLocaleString("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 2 });
}

function normalTaxAnnual(annualTaxable: number, brackets: Bracket[]) {
  const b = brackets.find(br => annualTaxable <= br.upTo)!;
  return b.base + (annualTaxable - b.excessOver) * b.rate;
}

function monthlyMTC(dependants: number, mtc: YearConfig["mtc"]) {
  if (dependants <= 0) return mtc.self;              // taxpayer only
  const firstTwo = mtc.self + mtc.firstDep;          // taxpayer + first dependant
  const extra = Math.max(0, dependants - 1) * mtc.additional;
  return firstTwo + extra;
}

// --- UI helpers (cards/fields) ---
const Card: React.FC<{ title?: string; children: React.ReactNode; footer?: React.ReactNode; className?: string }> = ({ title, children, footer, className }) => (
  <div className={`rounded-2xl border shadow-sm bg-white ${className ?? ""}`}>
    {title && <div className="px-5 py-4 border-b">
      <h3 className="font-semibold">{title}</h3>
    </div>}
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

type Computed = {
  monthlyTaxableForPAYE: number;
  annualTaxableBeforeRA: number;
  annualRAAllowed: number;
  annualTaxableAfterRA: number;
  monthlyBeforeMTC: number;
  monthlyPAYE: number;
  annualPAYE: number;
  mtcPerMonth: number;
  inclusionRate: number;
};

export default function TaxTool() {
  const [taxYearKey, setTaxYearKey] = useState<keyof typeof YEARS>("2024/2025");
  const cfg = YEARS[taxYearKey];

  const [mode, setMode] = useState<"yearly" | "monthly">("monthly");

  // Independent gross values
  const [grossMonthly, setGrossMonthly] = useState<number | "">("");
  const [grossAnnual, setGrossAnnual] = useState<number | "">("");

  const [age, setAge] = useState<number | "">("");
  const [medicalMember, setMedicalMember] = useState<boolean>(false);
  const [dependants, setDependants] = useState<number>(0);
  const [carAllowance, setCarAllowance] = useState<number | "">("");
  const [use20pcInclusion, setUse20pcInclusion] = useState(false);
  const [prorated, setProrated] = useState(false);
  const [daysWorked, setDaysWorked] = useState<number | "">("");
  const [daysInMonth, setDaysInMonth] = useState<number | "">("");

  // Retirement contributions (monthly if mode=monthly, else annual)
  const [retirementContribution, setRetirementContribution] = useState<number | "">("");

  // Brand/logo
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/scend-logo.png");
        if (!res.ok) return;
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onload = () => setLogoDataUrl(String(reader.result));
        reader.readAsDataURL(blob);
      } catch { /* ignore */ }
    })();
  }, []);

  // Rebates from age (no ID captured)
  const rebates = useMemo(() => {
    const a = typeof age === "number" ? age : Number(age || 0);
    let r = cfg.rebates.primary;
    if (a >= 65) r += cfg.rebates.secondary65;
    if (a >= 75) r += cfg.rebates.tertiary75;
    return r;
  }, [age, cfg]);

  // Manual calculation only when clicking "Calculate"
  const [computed, setComputed] = useState<Computed | null>(null);
  const [dirty, setDirty] = useState(false);

  function computeNow() {
    // pick gross matching mode
    const g = Number((mode === "monthly" ? grossMonthly : grossAnnual) || 0);
    if (!Number.isFinite(g) || g < 0) { setComputed(null); return; }

    const monthlyBase = mode === "monthly" ? g : g / 12;
    const inclusionRate = use20pcInclusion ? 0.2 : DEFAULT_CAR_ALLOWANCE_INCLUSION;
    const monthlyAllowanceIncludable = Number(carAllowance || 0) * inclusionRate;

    const dw = typeof daysWorked === "number" ? daysWorked : Number(daysWorked || 0);
    const dm = typeof daysInMonth === "number" ? daysInMonth : Number(daysInMonth || 0);
    const prorataFactor = prorated && dw > 0 && dm > 0 ? Math.min(1, dw / dm) : 1;

    // Remuneration-like base used for RA cap: monthlyBase + includable allowance (pre-RA)
    const monthlyRemuneration = (monthlyBase + monthlyAllowanceIncludable) * prorataFactor;

    // Annualised taxable BEFORE RA deduction
    const annualTaxableBeforeRA = monthlyRemuneration * 12;

    // ---------------- RA deduction (CORRECT) ----------------
    // Contribution input: monthly if mode=monthly, else annual
    const contribAnnual = mode === "monthly"
      ? Number(retirementContribution || 0) * 12
      : Number(retirementContribution || 0);

    // Cap base = greater of (annual remuneration, annual taxable before RA)
    const annualRemuneration = monthlyRemuneration * 12;
    const raCapBase = Math.max(annualRemuneration, annualTaxableBeforeRA);

    // Allowed = min(contribution, 27.5% * capBase, 350_000), floored at 0
    const cap27_5 = 0.275 * raCapBase;
    const annualRAAllowed = Math.max(0, Math.min(contribAnnual, cap27_5, 350_000));

    // Apply RA deduction
    const annualTaxableAfterRA = Math.max(0, annualTaxableBeforeRA - annualRAAllowed);

    // Annual normal tax (after RA), then apply rebates
    const annualTax = Math.max(0, normalTaxAnnual(annualTaxableAfterRA, cfg.brackets) - rebates);

    // Monthly before credits, then subtract MTC (if member)
    const monthlyBeforeMTC = annualTax / 12;
    const mtc = medicalMember ? monthlyMTC(Math.max(0, dependants ?? 0), cfg.mtc) : 0;
    const monthlyPAYE = Math.max(0, monthlyBeforeMTC - mtc);

    setComputed({
      monthlyTaxableForPAYE: monthlyRemuneration,
      annualTaxableBeforeRA,
      annualRAAllowed,
      annualTaxableAfterRA,
      monthlyBeforeMTC,
      monthlyPAYE,
      annualPAYE: monthlyPAYE * 12,
      mtcPerMonth: mtc,
      inclusionRate,
    });
    setDirty(false);
  }

  // --- Share helpers ---
  function shareSummary() {
    if (!computed) return "SARS Tax result (Scend): Enter inputs and click Calculate.";
    return [
      `SARS Tax Calculator — ${cfg.label}`,
      `Taxable (annualised): ${fmt(computed.annualTaxableAfterRA)} (after RA deduction of ${fmt(computed.annualRAAllowed)})`,
      `PAYE (monthly): ${fmt(computed.monthlyPAYE)}`,
      `MTC (monthly): ${fmt(computed.mtcPerMonth)}`,
    ].join(" • ");
  }
  function waShare() {
    const text = encodeURIComponent(shareSummary() + " — " + (typeof window !== "undefined" ? window.location.href : ""));
    const url = `https://wa.me/?text=${text}`;
    window.open(url, "_blank");
  }
  function emailShare() {
    const subject = encodeURIComponent("SARS Tax result — Scend");
    const body = encodeURIComponent(shareSummary() + "\n\n" + (typeof window !== "undefined" ? window.location.href : ""));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }
  async function copyShare() {
    try {
      const text = shareSummary() + " — " + (typeof window !== "undefined" ? window.location.href : "");
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  }

  function exportPDF() {
    if (!computed) return;
    const doc = new jsPDF();

    if (logoDataUrl) { try { doc.addImage(logoDataUrl, "PNG", 160, 10, 34, 14); } catch {} }

    doc.setFontSize(14);
    doc.text("SARS Tax Calculator — Scend", 14, 16);
    doc.setFontSize(10);
    doc.text(`Tax year: ${cfg.label}${cfg.isProvisional ? " (provisional)" : ""} — ends ${cfg.taxYearEnd.toDateString()}`, 14, 23);
    doc.text(`Mode: ${mode}`, 14, 28);

    autoTable(doc, {
      startY: 34,
      head: [["Field", "Value"]],
      body: [
        ["Age (years)", typeof age === "number" ? String(age) : String(Number(age || 0))],
        ["Medical aid member?", medicalMember ? "Yes" : "No"],
        ["Gross Monthly (entered)", fmt(Number(grossMonthly || 0))],
        ["Gross Annual (entered)", fmt(Number(grossAnnual || 0))],
        ["Car Allowance (monthly, includable)", fmt((Number(carAllowance || 0) * (computed.inclusionRate || 0)))],
        ["Prorated?", prorated ? `Yes (${daysWorked}/${daysInMonth})` : "No"],
        ["Retirement contributions (" + (mode === "monthly" ? "monthly" : "annual") + " input)", fmt(Number(retirementContribution || 0))],
        ["RA deduction allowed (annual)", fmt(computed.annualRAAllowed)],
        ["Taxable income (annualised, before RA)", fmt(computed.annualTaxableBeforeRA)],
        ["Taxable income (annualised, after RA)", fmt(computed.annualTaxableAfterRA)],
        ["PAYE before MTC (monthly)", fmt(computed.monthlyBeforeMTC)],
        ["Medical tax credit (monthly)", fmt(computed.mtcPerMonth)],
        ["PAYE (monthly)", fmt(computed.monthlyPAYE)],
        ["PAYE (annual)", fmt(computed.annualPAYE)],
      ],
      styles: { fontSize: 10 },
      theme: "grid",
      margin: { left: 14, right: 14 },
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const footerY = doc.internal.pageSize.getHeight() - 12;
    const disclaimer = "Disclaimer: Estimates for guidance only. Retirement deduction limited to 27.5% (R350k cap). 2025/26 values marked 'provisional'. Final liability depends on SARS assessment.";
    doc.setFontSize(8);
    doc.text(disclaimer, 14, footerY, { maxWidth: pageWidth - 28 });

    doc.save("Scend_Tax_Calculation.pdf");
  }

  function clearAll() {
    setMode("monthly");
    setGrossMonthly("");
    setGrossAnnual("");
    setAge("");
    setMedicalMember(false);
    setDependants(0);
    setCarAllowance("");
    setUse20pcInclusion(false);
    setProrated(false);
    setDaysWorked("");
    setDaysInMonth("");
    setRetirementContribution("");
    setComputed(null);
    setDirty(false);
  }

  function markDirty<T>(setter: (v: T) => void) {
    return (v: T) => { setter(v); setDirty(true); };
  }

  return (
    <section className="mx-auto max-w-5xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SARS Tax Tool</h1>
          <p className="text-sm text-gray-600">Choose yearly or monthly, add dependants, age (for rebates), car allowance, and retirement contributions.</p>
        </div>
      </div>

      {/* Inputs */}
      <Card title="Inputs" footer={
        <div className="flex flex-wrap gap-2">
          <button className="rounded-xl px-4 py-2 bg-pink-600 text-white hover:opacity-90" onClick={computeNow}>Calculate</button>
          <button className="rounded-xl px-4 py-2 border" onClick={clearAll}>Clear</button>
          <button className="rounded-xl px-4 py-2 border" onClick={exportPDF} disabled={!computed} title={!computed ? "Click Calculate first" : "Export PDF"}>Export PDF</button>
          {dirty && <span className="text-xs text-amber-600 self-center">Values changed — click <b>Calculate</b>.</span>}
        </div>
      }>
        <div className="grid gap-4">
          <Field label="Tax Year">
            <select
              className="border rounded-lg px-3 py-2 w-full"
              value={taxYearKey}
              onChange={(e) => { setTaxYearKey(e.target.value as keyof typeof YEARS); setDirty(true); }}
            >
              {Object.keys(YEARS).map((k) => (
                <option key={k} value={k}>{YEARS[k].label}</option>
              ))}
            </select>
          </Field>
          {YEARS[taxYearKey].isProvisional && (
            <div className="text-xs text-amber-600 -mt-2">Provisional values — update when SARS publishes 2025/26 tables.</div>
          )}

          <Field label="Calculation Mode">
            <select
              className="border rounded-lg px-3 py-2 w-full"
              value={mode}
              onChange={(e) => { setMode(e.target.value as "yearly" | "monthly"); setDirty(true); }}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </Field>

          {/* Independent gross fields */}
          <Field label="Gross Monthly Income (R)" hint="Used when mode = Monthly. Annual value is preserved separately.">
            <input
              type="number" min={0}
              className="border rounded-lg px-3 py-2 w-56"
              value={grossMonthly}
              onChange={(e) => markDirty(setGrossMonthly)(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </Field>

          <Field label="Gross Annual Income (R)" hint="Used when mode = Yearly. Monthly value is preserved separately.">
            <input
              type="number" min={0}
              className="border rounded-lg px-3 py-2 w-56"
              value={grossAnnual}
              onChange={(e) => markDirty(setGrossAnnual)(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </Field>

          <Field label="Age (years)">
            <input
              type="number" min={0}
              className="border rounded-lg px-3 py-2 w-28"
              value={age}
              onChange={(e) => markDirty(setAge)(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="e.g. 40"
              title="Age in years (at end of selected tax year)"
            />
          </Field>

          <Field label="Medical aid member?">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={medicalMember} onChange={(e) => markDirty(setMedicalMember)(e.target.checked)} />
              <span className="text-sm">I belong to a registered medical aid</span>
            </label>
          </Field>

          <Field label="Medical Aid Dependants" hint="Dependants on the scheme, excluding you">
            <input
              type="number" min={0}
              className="border rounded-lg px-3 py-2 w-28 disabled:bg-gray-100"
              value={dependants}
              onChange={(e) => markDirty(setDependants)(Math.max(0, Number(e.target.value)))}
              disabled={!medicalMember}
              title={!medicalMember ? "Enable by ticking medical aid membership" : "Number of dependants on the scheme (excluding you)"}
            />
          </Field>

          <Field label="Car Allowance (Monthly) (R)">
            <input
              type="number" min={0}
              className="border rounded-lg px-3 py-2 w-56"
              value={carAllowance}
              onChange={(e) => markDirty(setCarAllowance)(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </Field>

          <Field label="Travel allowance PAYE inclusion" hint="PAYE normally withholds on 80% of a travel allowance; 20% may be used if employer is satisfied ≥80% is for business use.">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={use20pcInclusion} onChange={(e) => markDirty(setUse20pcInclusion)(e.target.checked)} />
              <span className="text-sm">Use 20% inclusion (≥80% business use)</span>
            </label>
          </Field>

          <Field label="Month is prorated">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={prorated} onChange={(e) => markDirty(setProrated)(e.target.checked)} />
              <span className="text-sm">Enable prorata</span>
            </label>
          </Field>

          {prorated && (
            <div className="grid md:grid-cols-2 gap-4 pl-0 md:pl-[220px]">
              <div>
                <div className="text-sm text-gray-600 mb-1">Days worked this month</div>
                <input
                  className="border rounded-lg px-3 py-2 w-full"
                  placeholder="e.g. 23"
                  type="number" min={1}
                  value={daysWorked}
                  onChange={(e) => markDirty(setDaysWorked)(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Total days in month</div>
                <input
                  className="border rounded-lg px-3 py-2 w-full"
                  placeholder="e.g. 28 / 30 / 31"
                  type="number" min={1}
                  value={daysInMonth}
                  onChange={(e) => markDirty(setDaysInMonth)(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* Retirement contributions */}
          <Field label={`Retirement contributions (${mode === "monthly" ? "monthly" : "annual"})`} hint="Deduction limited to the lesser of: your contribution, 27.5% of the greater of remuneration or taxable income (pre-RA), and R350,000 per year. Unused may be carried forward at assessment (not modelled here).">
            <input
              type="number" min={0}
              className="border rounded-lg px-3 py-2 w-56"
              value={retirementContribution}
              onChange={(e) => markDirty(setRetirementContribution)(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder={mode === "monthly" ? "e.g. 3000 (per month)" : "e.g. 36000 (per year)"}
            />
          </Field>
        </div>
      </Card>

      {/* Results */}
      <Card title="Results" footer={
        <div className="flex flex-wrap gap-2">
          <button className="rounded-xl px-3 py-2 border" onClick={waShare} disabled={!computed}>Share WhatsApp</button>
          <button className="rounded-xl px-3 py-2 border" onClick={emailShare} disabled={!computed}>Share Email</button>
          <button className="rounded-xl px-3 py-2 border" onClick={copyShare} disabled={!computed}>Copy summary</button>
        </div>
      }>
        {computed ? (
          <div className="grid gap-2">
            <div className="flex justify-between"><span>Taxable (annualised) — before retirement</span><b>{fmt(computed.annualTaxableBeforeRA)}</b></div>
            <div className="flex justify-between"><span>Retirement deduction allowed (annual)</span><b>{fmt(computed.annualRAAllowed)}</b></div>
            <div className="flex justify-between"><span>Taxable (annualised) — after retirement</span><b>{fmt(computed.annualTaxableAfterRA)}</b></div>
            <div className="flex justify-between"><span>PAYE (monthly)</span><b>{fmt(computed.monthlyPAYE)}</b></div>
            <div className="flex justify-between"><span>PAYE (annual)</span><b>{fmt(computed.annualPAYE)}</b></div>
            <div className="flex justify-between"><span>Medical tax credit (per month)</span><b>{fmt(computed.mtcPerMonth)}</b></div>
            <p className="text-xs text-gray-500 mt-2">
              Retirement deduction rule applied: lesser of contribution, 27.5% of the greater of remuneration or taxable income (pre-RA), and R350,000 cap.
              Brackets, rebates and medical credits per SARS. {YEARS[taxYearKey].isProvisional ? "This tax year is provisional — update when SARS releases tables." : ""}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Enter inputs and click <b>Calculate</b> to see results.</p>
        )}
      </Card>
    </section>
  );
}
