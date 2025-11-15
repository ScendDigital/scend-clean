/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";

/* ──────────────────────────────────────────────────────────────────
   SARS tables & helpers
   NOTE: 2025/26 is provisional — mirrors 2024/25 until official release.
   MTC: R364 (main+first), R246 (each additional) per month.
   ────────────────────────────────────────────────────────────────── */

type TaxBracket = { upTo: number | null; base: number; rate: number; over: number };
type Rebates = { primary: number; secondary: number; tertiary: number };
type MTC = { mainAndFirst: number; additional: number }; // monthly credits
type YearKey = "2025/26" | "2024/25" | "2023/24" | "2022/23" | "2021/22";

const PAYE_TABLES: Record<YearKey, { brackets: TaxBracket[]; rebates: Rebates; mtc: MTC }> = {
  // 🚧 Provisional: mirrors 2024/25 figures until official 2025/26 are confirmed.
  "2025/26": {
    brackets: [
      { upTo: 237100, base: 0, rate: 0.18, over: 0 },
      { upTo: 370500, base: 42678, rate: 0.26, over: 237100 },
      { upTo: 512800, base: 77362, rate: 0.31, over: 370500 },
      { upTo: 673000, base: 121475, rate: 0.36, over: 512800 },
      { upTo: 857900, base: 179147, rate: 0.39, over: 673000 },
      { upTo: 1817000, base: 251258, rate: 0.41, over: 857900 },
      { upTo: null, base: 644489, rate: 0.45, over: 1817000 },
    ],
    rebates: { primary: 17235, secondary: 9444, tertiary: 3145 },
    mtc: { mainAndFirst: 364, additional: 246 },
  },
  "2024/25": {
    brackets: [
      { upTo: 237100, base: 0, rate: 0.18, over: 0 },
      { upTo: 370500, base: 42678, rate: 0.26, over: 237100 },
      { upTo: 512800, base: 77362, rate: 0.31, over: 370500 },
      { upTo: 673000, base: 121475, rate: 0.36, over: 512800 },
      { upTo: 857900, base: 179147, rate: 0.39, over: 673000 },
      { upTo: 1817000, base: 251258, rate: 0.41, over: 857900 },
      { upTo: null, base: 644489, rate: 0.45, over: 1817000 },
    ],
    rebates: { primary: 17235, secondary: 9444, tertiary: 3145 },
    mtc: { mainAndFirst: 364, additional: 246 },
  },
  "2023/24": {
    brackets: [
      { upTo: 237100, base: 0, rate: 0.18, over: 0 },
      { upTo: 370500, base: 42678, rate: 0.26, over: 237100 },
      { upTo: 512800, base: 77362, rate: 0.31, over: 370500 },
      { upTo: 673000, base: 121475, rate: 0.36, over: 512800 },
      { upTo: 857900, base: 179147, rate: 0.39, over: 673000 },
      { upTo: 1817000, base: 251258, rate: 0.41, over: 857900 },
      { upTo: null, base: 644489, rate: 0.45, over: 1817000 },
    ],
    rebates: { primary: 17235, secondary: 9444, tertiary: 3145 },
    mtc: { mainAndFirst: 364, additional: 246 },
  },
  "2022/23": {
    brackets: [
      { upTo: 226000, base: 0, rate: 0.18, over: 0 },
      { upTo: 353100, base: 40680, rate: 0.26, over: 226000 },
      { upTo: 488700, base: 73726, rate: 0.31, over: 353100 },
      { upTo: 641400, base: 115762, rate: 0.36, over: 488700 },
      { upTo: 817600, base: 170734, rate: 0.39, over: 641400 },
      { upTo: 1731600, base: 239452, rate: 0.41, over: 817600 },
      { upTo: null, base: 614192, rate: 0.45, over: 1731600 },
    ],
    rebates: { primary: 16425, secondary: 9000, tertiary: 2997 },
    mtc: { mainAndFirst: 347, additional: 234 },
  },
  "2021/22": {
    brackets: [
      { upTo: 216200, base: 0, rate: 0.18, over: 0 },
      { upTo: 337800, base: 38916, rate: 0.26, over: 216200 },
      { upTo: 467500, base: 70532, rate: 0.31, over: 337800 },
      { upTo: 613600, base: 110739, rate: 0.36, over: 467500 },
      { upTo: 782200, base: 163335, rate: 0.39, over: 613600 },
      { upTo: 1656600, base: 229089, rate: 0.41, over: 782200 },
      { upTo: null, base: 587593, rate: 0.45, over: 1656600 },
    ],
    rebates: { primary: 15714, secondary: 8613, tertiary: 2871 },
    mtc: { mainAndFirst: 332, additional: 224 },
  },
};

// Retirement Lump Sum (at retirement/severance)
const RETIREMENT_LUMP_TABLE: { upTo: number | null; base: number; rate: number; over: number }[] = [
  { upTo: 550000, base: 0, rate: 0.0, over: 0 },
  { upTo: 770000, base: 0, rate: 0.18, over: 550000 },
  { upTo: 1155000, base: 39600, rate: 0.27, over: 770000 },
  { upTo: null, base: 143550, rate: 0.36, over: 1155000 },
];

// Withdrawal Lump Sum (old regime)
const WITHDRAWAL_LUMP_TABLE: { upTo: number | null; base: number; rate: number; over: number }[] = [
  { upTo: 27500, base: 0, rate: 0.0, over: 0 },
  { upTo: 726000, base: 0, rate: 0.18, over: 27500 },
  { upTo: 1089000, base: 125730, rate: 0.27, over: 726000 },
  { upTo: null, base: 223740, rate: 0.36, over: 1089000 },
];

const currency = (n: number) =>
  (isFinite(n) ? n : 0).toLocaleString("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 2 });

type YearMode = YearKey;
type Mode = "Monthly" | "Yearly";

type Inputs = {
  year: YearMode;
  mode: Mode;

  // income
  grossMonthly: number;
  grossAnnual: number;

  // credits/deductions
  retirementAnnuityAnnual: number;  // annual entry (Yearly mode)
  retirementAnnuityMonthly: number; // monthly entry (Monthly mode)
  carAllowanceMonthly: number;      // preview 80% taxable
  medicalDependants: number;        // excludes main member
  age: number;                      // replaces ID

  // proration
  prorataMonths: number; // Yearly mode: 1..12
  daysWorked: number;    // Monthly mode
  daysInMonth: number;   // Monthly mode

  // two-pot & lump sums
  savingsWithdrawal: number; // two-pot savings → marginal
  oldRegWithdrawal: number;  // old withdrawal table
  retirementLumpSum: number; // retirement table
  priorTaxableLumps: number; // cumulative (rolling)
};

type Computed = {
  taxableAnnualBeforeRA: number;
  raAllowedAnnual: number;
  taxableAnnualAfterRA: number;

  mtcAnnual: number;
  rebatesAnnual: number;

  payeAnnualBeforeCredits: number;
  payeAnnualAfterCredits: number;
  payeMonthly: number;
  estNetMonthly: number;

  marginalRate: number;
  savingsWithdrawalTax: number;
  oldRegWithdrawalTax: number;
  retirementLumpTax: number;

  prorataFactor: number;
  notes: string[];
};

function calcPAYEAnnual(year: YearKey, taxable: number): number {
  const { brackets } = PAYE_TABLES[year];
  for (const b of brackets) {
    if (b.upTo === null || taxable <= b.upTo) return b.base + (taxable - b.over) * b.rate;
  }
  return 0;
}

function ageRebates(year: YearKey, age: number): number {
  const r = PAYE_TABLES[year].rebates;
  let total = r.primary;
  if (age >= 65) total += r.secondary;
  if (age >= 75) total += r.tertiary;
  return total;
}

function mtcAnnual(year: YearKey, dependants: number): number {
  const mtc = PAYE_TABLES[year].mtc;
  const mainPlusFirst = Math.min(dependants + 1, 2); // main + up to first dependant
  const extra = Math.max(0, dependants + 1 - mainPlusFirst);
  const monthly = mainPlusFirst * mtc.mainAndFirst + extra * mtc.additional;
  return monthly * 12;
}

function taxableFromLump(
  table: { upTo: number | null; base: number; rate: number; over: number }[],
  amount: number,
  priorTaxable = 0
): number {
  const total = Math.max(0, priorTaxable) + Math.max(0, amount);
  const calc = (val: number) => {
    for (const b of table) {
      if (b.upTo === null || val <= b.upTo) return b.base + (val - b.over) * b.rate;
    }
    return 0;
  };
  const taxTotal = calc(total);
  const taxPrior = calc(Math.max(0, priorTaxable));
  return Math.max(0, taxTotal - taxPrior);
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

/* ────────────────────────────────────────────────────────────────── */

export default function TaxTool() {
  const [f, setF] = React.useState<Inputs>({
    year: "2025/26",
    mode: "Yearly",

    grossMonthly: 30000,
    grossAnnual: 360000,

    retirementAnnuityAnnual: 0,
    retirementAnnuityMonthly: 0,

    carAllowanceMonthly: 0,
    medicalDependants: 0,
    age: 35,

    prorataMonths: 12,
    daysWorked: 30,
    daysInMonth: 30,

    savingsWithdrawal: 0,
    oldRegWithdrawal: 0,
    retirementLumpSum: 0,
    priorTaxableLumps: 0,
  });

  const [computed, setComputed] = React.useState<Computed | null>(null);
  const [dirty, setDirty] = React.useState(false);

  // Keep monthly/annual fields in sync on mode flip (gross + RA)
  React.useEffect(() => {
    if (f.mode === "Monthly") {
      setF((v) => ({
        ...v,
        grossAnnual: Math.max(0, (v.grossMonthly || 0) * 12),
        retirementAnnuityMonthly: Math.max(0, Math.round((v.retirementAnnuityAnnual || 0) / 12)),
      }));
    } else {
      setF((v) => ({
        ...v,
        grossMonthly: Math.max(0, Math.round((v.grossAnnual || 0) / 12)),
        retirementAnnuityAnnual: Math.max(0, (v.retirementAnnuityMonthly || 0) * 12),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.mode]);

  const markDirty =
    <T,>(setter: React.Dispatch<React.SetStateAction<T>>) =>
    (v: unknown) => {
      setDirty(true);
      setComputed(null);
      setter(v as any);
    };

  function compute(): Computed {
    const year = f.year;
    const notes: string[] = [];

    if (year === "2025/26") {
      notes.push("2025/26 uses 2024/25 tables provisionally — update once official figures are confirmed.");
    }

    // Proration factor m
    // - Yearly mode: months/12
    // - Monthly mode: daysWorked/daysInMonth
    const m =
      f.mode === "Monthly"
        ? clamp01((f.daysWorked || 0) / Math.max(1, f.daysInMonth || 0))
        : clamp01((f.prorataMonths || 12) / 12);

    // Annualised base (pro-rated by m)
    const grossAnnual =
      f.mode === "Monthly"
        ? (f.grossMonthly || 0) * 12 * m
        : (f.grossAnnual || 0) * m;

    // Allowance 80% taxable (preview), annualised & pro-rated
    const carAnnualTaxable = Math.max(0, f.carAllowanceMonthly) * 12 * 0.8 * m;

    // RA input → annual before pro-rating
    const raInputAnnual =
      f.mode === "Monthly"
        ? Math.max(0, f.retirementAnnuityMonthly || 0) * 12
        : Math.max(0, f.retirementAnnuityAnnual || 0);

    // RA limit (annual) pro-rated: min(27.5% of income, R350k) × m
    const raMax = Math.min(grossAnnual * 0.275, 350000 * m);
    const raAllowed = Math.max(0, Math.min(raInputAnnual * m, raMax));
    if (raInputAnnual * m > raMax + 1e-6) {
      notes.push(`RA capped to ${currency(raAllowed)} (27.5% / R350k rule, pro-rated).`);
    }

    // Taxable income (simple model)
    const taxableBeforeRA = Math.max(0, grossAnnual + carAnnualTaxable);
    const taxableAfterRA = Math.max(0, taxableBeforeRA - raAllowed);

    // PAYE (annual) before credits
    const payeAnnual = calcPAYEAnnual(year, taxableAfterRA);

    // Credits (annual) pro-rated
    const rebates = ageRebates(year, f.age) * m;
    const mtc = mtcAnnual(year, f.medicalDependants) * m;

    const payeAfterCredits = Math.max(0, payeAnnual - rebates - mtc);

    // Monthly display
    // ✅ In Monthly mode divide by 12; in Yearly divide by months represented (rounded)
    const monthsCount = f.mode === "Monthly" ? 12 : Math.max(1, Math.round(12 * m));
    const payeMonthly = payeAfterCredits / monthsCount;
    const netMonthly = Math.max(0, (grossAnnual / monthsCount) - payeMonthly);

    // Marginal rate (for two-pot savings estimate)
    const brackets = PAYE_TABLES[year].brackets;
    const currentBracket = brackets.find((b) => b.upTo === null || taxableAfterRA <= (b.upTo as number))!;
    const marginal = currentBracket.rate;

    // Two-pot savings withdrawal taxed at marginal (estimate)
    const savingsWithdrawalTax = Math.max(0, f.savingsWithdrawal * marginal);

    // Old-reg withdrawal (table; rolling)
    const oldRegWithdrawalTax = taxableFromLump(WITHDRAWAL_LUMP_TABLE, f.oldRegWithdrawal, f.priorTaxableLumps);

    // Retirement lump sum (table; rolling with prior + oldReg)
    const retirementLumpTax = taxableFromLump(
      RETIREMENT_LUMP_TABLE,
      f.retirementLumpSum,
      f.priorTaxableLumps + f.oldRegWithdrawal
    );

    if (f.mode === "Monthly") notes.push(`Monthly proration: days worked (${f.daysWorked}) / days in month (${f.daysInMonth}).`);
    if (f.savingsWithdrawal > 0) notes.push(`Two-pot savings withdrawal taxed at marginal rate ≈ ${(marginal * 100).toFixed(1)}%.`);
    if (f.oldRegWithdrawal > 0) notes.push("Old-reg withdrawal lump-sum table applied.");
    if (f.retirementLumpSum > 0) notes.push("Retirement lump-sum table applied with rolling prior lumps.");

    return {
      taxableAnnualBeforeRA: taxableBeforeRA,
      raAllowedAnnual: raAllowed,
      taxableAnnualAfterRA: taxableAfterRA,
      mtcAnnual: mtc,
      rebatesAnnual: rebates,
      payeAnnualBeforeCredits: payeAnnual,
      payeAnnualAfterCredits: payeAfterCredits,
      payeMonthly,
      estNetMonthly: netMonthly,
      marginalRate: marginal,
      savingsWithdrawalTax,
      oldRegWithdrawalTax,
      retirementLumpTax,
      prorataFactor: m,
      notes,
    };
  }

  function onCompute() {
    const c = compute();
    setComputed(c);
    setDirty(false);
  }

  function onClear() {
    setF({
      year: "2025/26",
      mode: "Yearly",
      grossMonthly: 30000,
      grossAnnual: 360000,
      retirementAnnuityAnnual: 0,
      retirementAnnuityMonthly: 0,
      carAllowanceMonthly: 0,
      medicalDependants: 0,
      age: 35,
      prorataMonths: 12,
      daysWorked: 30,
      daysInMonth: 30,
      savingsWithdrawal: 0,
      oldRegWithdrawal: 0,
      retirementLumpSum: 0,
      priorTaxableLumps: 0,
    });
    setComputed(null);
    setDirty(false);
  }

  async function onPDF() {
    if (!computed) return alert("Click Calculate first.");

    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Scend – SARS Tax Estimate (${f.year})`, w / 2, 56, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, w / 2, 72, { align: "center" });

    autoTable(doc, {
      startY: 96,
      styles: { fontSize: 10, cellPadding: 6, halign: "left" },
      head: [["Item", "Value"]],
      body: [
        ["Year", f.year],
        ["Mode", f.mode],
        ["Age", String(f.age)],
        ...(f.mode === "Monthly"
          ? [
              ["Proration (days)", `${f.daysWorked} / ${f.daysInMonth}`],
              ["Proration factor", computed.prorataFactor.toFixed(4)],
            ]
          : [
              ["Pro-rata months", String(f.prorataMonths)],
              ["Proration factor", computed.prorataFactor.toFixed(4)],
            ]),
        [
          "Gross Annual (pro-rated)",
          currency(f.mode === "Monthly" ? f.grossMonthly * 12 * computed.prorataFactor : f.grossAnnual * computed.prorataFactor),
        ],
        ["Car Allowance taxable (annual)", currency(Math.max(0, f.carAllowanceMonthly) * 12 * 0.8 * computed.prorataFactor)],
        ["RA allowed (annual, pro-rated)", currency(computed.raAllowedAnnual)],
        ["Taxable Before RA", currency(computed.taxableAnnualBeforeRA)],
        ["Taxable After RA", currency(computed.taxableAnnualAfterRA)],
        ["PAYE (annual before credits)", currency(computed.payeAnnualBeforeCredits)],
        ["Age Rebates (annual, pro-rated)", currency(computed.rebatesAnnual)],
        ["Medical Tax Credits (annual, pro-rated)", currency(computed.mtcAnnual)],
        ["PAYE (annual after credits)", currency(computed.payeAnnualAfterCredits)],
        ["PAYE (monthly)", currency(computed.payeMonthly)],
        ["Estimated Net (monthly)", currency(computed.estNetMonthly)],
        ...(f.savingsWithdrawal > 0
          ? [["Two-pot Savings Withdrawal Tax (≈ marginal)", currency(computed.savingsWithdrawalTax)]]
          : []),
        ...(f.oldRegWithdrawal > 0
          ? [["Old-Reg Withdrawal Lump-Sum Tax", currency(computed.oldRegWithdrawalTax)]]
          : []),
        ...(f.retirementLumpSum > 0
          ? [["Retirement Lump-Sum Tax", currency(computed.retirementLumpTax)]]
          : []),
        ...(computed.notes.length ? computed.notes.map((n) => ["Note", n] as [string, string]) : []),
      ],
      theme: "striped",
      headStyles: { fillColor: [219, 39, 119] },
    });

    const y = (doc as any).lastAutoTable.finalY + 24;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text(
      "Disclaimer: Educational estimate, not tax advice. Actual PAYE / lump-sum tax depends on SARS rules,\n" +
        "employer payroll setup, allowable deductions, and cumulative history. Replace tables with your official pack if needed.",
      56,
      y
    );

    doc.save(`Scend_Tax_${f.year.replace("/", "-")}.pdf`);
  }

  /* ──────────────────────────────────────────────────────────────────
     UI — Premium look & feel (matching LoanTool)
     ────────────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-8">
      {/* Premium header */}
      <section className="rounded-3xl bg-gradient-to-br from-pink-50 via-white to-white p-8 shadow-sm ring-1 ring-gray-200/60">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Scend Tax Tool
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
            SARS-style PAYE with age rebates, medical credits, RA limits, <em>Monthly day-proration</em> or <em>Yearly months</em>, and Two-Pot / Lump-Sum calculations.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {/* Form */}
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-gray-200/70">
          <h2 className="text-lg font-semibold text-gray-900">Inputs</h2>

          <div className="mt-5 grid gap-4">
            {/* Year, Mode, Proration */}
            <div className="grid gap-3 md:grid-cols-3">
              <label className="text-[15px] text-gray-900">
                Tax Year
                <select
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.year}
                  onChange={(e) => markDirty(setF)({ ...f, year: e.target.value as YearMode })}
                >
                  <option>2025/26</option>
                  <option>2024/25</option>
                  <option>2023/24</option>
                  <option>2022/23</option>
                  <option>2021/22</option>
                </select>
              </label>

              <label className="text-[15px] text-gray-900">
                Mode
                <select
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.mode}
                  onChange={(e) => markDirty(setF)({ ...f, mode: e.target.value as Mode })}
                >
                  <option>Monthly</option>
                  <option>Yearly</option>
                </select>
              </label>

              {f.mode === "Yearly" ? (
                <label className="text-[15px] text-gray-900">
                  Pro-rata months
                  <input
                    type="number"
                    min={1}
                    max={12}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                    value={f.prorataMonths}
                    onChange={(e) => markDirty(setF)({ ...f, prorataMonths: Number(e.target.value) })}
                  />
                  <span className="mt-1 block text-[12px] text-gray-700">Use &lt;12 for YTD.</span>
                </label>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 md:col-span-1">
                  <label className="text-[15px] text-gray-900">
                    Days worked
                    <input
                      type="number"
                      min={0}
                      max={Math.max(1, f.daysInMonth)}
                      className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                      value={f.daysWorked}
                      onChange={(e) => markDirty(setF)({ ...f, daysWorked: Number(e.target.value) })}
                    />
                  </label>
                  <label className="text-[15px] text-gray-900">
                    Days in month
                    <input
                      type="number"
                      min={1}
                      className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                      value={f.daysInMonth}
                      onChange={(e) => markDirty(setF)({ ...f, daysInMonth: Number(e.target.value) })}
                    />
                    <span className="mt-1 block text-[12px] text-gray-700">Within-month proration.</span>
                  </label>
                </div>
              )}
            </div>

            {/* Income */}
            <div className="grid gap-3 md:grid-cols-3">
              {f.mode === "Monthly" ? (
                <label className="text-[15px] text-gray-900">
                  Gross Monthly (R)
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                    value={f.grossMonthly}
                    onChange={(e) => markDirty(setF)({ ...f, grossMonthly: Number(e.target.value) })}
                  />
                </label>
              ) : (
                <label className="text-[15px] text-gray-900">
                  Gross Annual (R)
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                    value={f.grossAnnual}
                    onChange={(e) => markDirty(setF)({ ...f, grossAnnual: Number(e.target.value) })}
                  />
                </label>
              )}

              <label className="text-[15px] text-gray-900">
                Age (years)
                <input
                  type="number"
                  min={18}
                  max={100}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.age}
                  onChange={(e) => markDirty(setF)({ ...f, age: Number(e.target.value) })}
                />
              </label>

              <label className="text-[15px] text-gray-900">
                Car Allowance (Monthly, R)
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.carAllowanceMonthly}
                  onChange={(e) => markDirty(setF)({ ...f, carAllowanceMonthly: Number(e.target.value) })}
                />
                <span className="mt-1 block text-[12px] text-gray-700">80% taxable preview.</span>
              </label>
            </div>

            {/* Credits & RA */}
            <div className="grid gap-3 md:grid-cols-3">
              <label className="text-[15px] text-gray-900">
                Medical Dependants
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.medicalDependants}
                  onChange={(e) => markDirty(setF)({ ...f, medicalDependants: Number(e.target.value) })}
                />
                <span className="mt-1 block text-[12px] text-gray-700">Excludes main member.</span>
              </label>

              {f.mode === "Monthly" ? (
                <label className="text-[15px] text-gray-900 md:col-span-2">
                  Retirement Annuity (Monthly, R)
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                    value={f.retirementAnnuityMonthly}
                    onChange={(e) => markDirty(setF)({ ...f, retirementAnnuityMonthly: Number(e.target.value) })}
                  />
                  <span className="mt-1 block text-[12px] text-gray-700">
                    Annualised ×12 and pro-rated by days when in Monthly mode. Cap: 27.5% of income, max R350k p.a.
                  </span>
                </label>
              ) : (
                <label className="text-[15px] text-gray-900 md:col-span-2">
                  Retirement Annuity (Annual, R)
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                    value={f.retirementAnnuityAnnual}
                    onChange={(e) => markDirty(setF)({ ...f, retirementAnnuityAnnual: Number(e.target.value) })}
                  />
                  <span className="mt-1 block text-[12px] text-gray-700">
                    Pro-rated by months when in Yearly mode. Cap: 27.5% of income, max R350k p.a.
                  </span>
                </label>
              )}
            </div>

            {/* Two-pot & Lump sums */}
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-[15px] text-gray-900">
                Two-Pot Savings Withdrawal (R)
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.savingsWithdrawal}
                  onChange={(e) => markDirty(setF)({ ...f, savingsWithdrawal: Number(e.target.value) })}
                />
                <span className="mt-1 block text-[12px] text-gray-700">Taxed at marginal rate (estimate).</span>
              </label>

              <label className="text-[15px] text-gray-900">
                Old-Reg Withdrawal Lump Sum (R)
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.oldRegWithdrawal}
                  onChange={(e) => markDirty(setF)({ ...f, oldRegWithdrawal: Number(e.target.value) })}
                />
                <span className="mt-1 block text-[12px] text-gray-700">Uses withdrawal table.</span>
              </label>

              <label className="text-[15px] text-gray-900">
                Retirement Lump Sum (R)
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.retirementLumpSum}
                  onChange={(e) => markDirty(setF)({ ...f, retirementLumpSum: Number(e.target.value) })}
                />
                <span className="mt-1 block text-[12px] text-gray-700">Uses retirement lump-sum table.</span>
              </label>

              <label className="text-[15px] text-gray-900">
                Prior Taxable Lumps (R)
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={f.priorTaxableLumps}
                  onChange={(e) => markDirty(setF)({ ...f, priorTaxableLumps: Number(e.target.value) })}
                />
                <span className="mt-1 block text-[12px] text-gray-700">Rolling basis for the tables.</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="mt-2 flex flex-wrap gap-3">
              <button
                onClick={onCompute}
                className="glow rounded-2xl px-4 py-2 text-sm font-semibold text-white bg-pink-600 hover:bg-pink-700"
              >
                Calculate
              </button>

              <button
                onClick={onClear}
                className="glow rounded-2xl px-4 py-2 text-sm font-semibold text-gray-900 bg-white ring-1 ring-gray-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-pink-200"
              >
                Clear
              </button>

              <button
                onClick={onPDF}
                className="glow rounded-2xl px-4 py-2 text-sm font-semibold text-gray-900 bg-white ring-1 ring-gray-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-pink-200"
                disabled={!computed}
                title={!computed ? "Click Calculate first" : "Export PDF"}
              >
                Export PDF
              </button>

              {dirty && (
                <span className="text-xs text-amber-600 self-center">
                  Values changed — click <b>Calculate</b>.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-gray-200/70">
          <h2 className="text-lg font-semibold text-gray-900">Results</h2>

          {!computed ? (
            <div className="mt-4 text-[15px] text-gray-700">
              Enter details and click <strong>Calculate</strong> to see results.
            </div>
          ) : (
            <div className="mt-4 grid gap-2 text-[15px]">
              <div className="flex items-center justify-between">
                <span>Taxable Before RA</span>
                <span>{currency(computed.taxableAnnualBeforeRA)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>RA Allowed (annual)</span>
                <span>{currency(computed.raAllowedAnnual)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Taxable After RA</span>
                <span>{currency(computed.taxableAnnualAfterRA)}</span>
              </div>

              <div className="mt-2 grid gap-2 rounded-xl bg-gray-50 px-3 py-2">
                <div className="flex items-center justify-between">
                  <span>PAYE (annual before credits)</span>
                  <span>{currency(computed.payeAnnualBeforeCredits)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Age Rebates (annual, pro-rated)</span>
                  <span>{currency(computed.rebatesAnnual)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Medical Tax Credits (annual, pro-rated)</span>
                  <span>{currency(computed.mtcAnnual)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>PAYE (annual after credits)</span>
                  <span>{currency(computed.payeAnnualAfterCredits)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>PAYE (monthly)</span>
                  <span>{currency(computed.payeMonthly)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>Estimated Net (monthly)</span>
                  <span>{currency(computed.estNetMonthly)}</span>
                </div>
              </div>

              {(f.savingsWithdrawal > 0 || f.oldRegWithdrawal > 0 || f.retirementLumpSum > 0) && (
                <>
                  <div className="mt-2 text-[13px] text-gray-700 font-medium">Lump-sum / Two-Pot results</div>
                  {f.savingsWithdrawal > 0 && (
                    <div className="flex items-center justify-between">
                      <span>Two-Pot Savings Withdrawal Tax</span>
                      <span>
                        {currency(computed.savingsWithdrawalTax)}{" "}
                        <em className="text-gray-500">(≈ marginal {(computed.marginalRate * 100).toFixed(1)}%)</em>
                      </span>
                    </div>
                  )}
                  {f.oldRegWithdrawal > 0 && (
                    <div className="flex items-center justify-between">
                      <span>Old-Reg Withdrawal Lump-Sum Tax</span>
                      <span>{currency(computed.oldRegWithdrawalTax)}</span>
                    </div>
                  )}
                  {f.retirementLumpSum > 0 && (
                    <div className="flex items-center justify-between">
                      <span>Retirement Lump-Sum Tax</span>
                      <span>{currency(computed.retirementLumpTax)}</span>
                    </div>
                  )}
                </>
              )}

              {computed.notes.length > 0 && (
                <div className="mt-2 rounded-xl bg-pink-50/70 px-3 py-2 text-[14px]">
                  <div className="font-semibold mb-1">Notes</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {computed.notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-4 rounded-xl bg-white px-3 py-2 ring-1 ring-gray-200 text-[12.5px] text-gray-700">
                <strong>Disclaimer:</strong> Educational estimate. Tables and outcomes depend on SARS rules,
                cumulative assessments, and employer payroll setup. Replace tables with your official SARS pack if needed.
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

