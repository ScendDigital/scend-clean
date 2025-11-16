/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";

/* ──────────────────────────────────────────────────────────────────
   UIF Rules (Dept of Labour fact-sheets, summarized)

   Unemployment:
   - Monthly ceiling (UIF) applied: UIF_MONTHLY_CEILING
   - Daily income Y1 = min(avg monthly, ceiling) * 12 / 365
   - IRR% = 29.2 + (7173.92 / (232.92 + Y1))
   - Daily Benefit Amount (DBA) = Y1 * IRR%
   - Credits: 1 day credit for every 4 days worked (max 365 over 4 years)
   - Total benefit ≈ DBA * credit days

   Illness / Maternity / Adoption / Parental / RWT:
   - Benefit = 66% of income capped at UIF ceiling
   - Paid as daily amount (dailyFromMonthly)
   - Top-up (RWT & partial-pay leave): min(daily income diff, DBA)

   Dependants:
   - Lump-sum style; this tool provides forms & checklist, not a formula.

   These are approximations for guidance, not official determinations.
   ────────────────────────────────────────────────────────────────── */

type ClaimType =
  | "Unemployment"
  | "Reduced Work Time"
  | "Illness"
  | "Maternity"
  | "Adoption"
  | "Parental"
  | "Dependants / Death";

const UIF_MONTHLY_CEILING = 17712; // Adjust if UIF publishes a new ceiling.

// Formatting helpers
const ZAR = (n: number) =>
  (isFinite(n) ? n : 0).toLocaleString("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  });

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

function dailyFromMonthly(m: number) {
  return (m * 12) / 365;
}

function creditsFromDays(daysWorkedInLast4Years: number) {
  return clamp(Math.floor(daysWorkedInLast4Years / 4), 0, 365);
}

// Income Replacement Rate formula for unemployment
function irrPercentFromY1(y1Daily: number) {
  return 29.2 + 7173.92 / (232.92 + y1Daily);
}

/* ──────────────────────────────────────────────────────────────────
   Benefit calculators
   ────────────────────────────────────────────────────────────────── */

function calcUnemployment({
  avgMonthly,
  daysWorked4y,
  monthsToClaim,
}: {
  avgMonthly: number;
  daysWorked4y: number;
  monthsToClaim: number;
}) {
  const cappedMonthly = Math.min(avgMonthly, UIF_MONTHLY_CEILING);
  const y1 = dailyFromMonthly(cappedMonthly);
  const irrPct = irrPercentFromY1(y1) / 100;
  const dailyBenefit = y1 * irrPct;
  const creditDays = creditsFromDays(daysWorked4y);
  const estMonthly = dailyBenefit * 30;
  const totalBenefitIfAllCreditsUsed = dailyBenefit * creditDays;

  const monthsUsedDays = clamp(Math.round(monthsToClaim * 30), 0, creditDays);
  const payoutForChosenMonths = dailyBenefit * monthsUsedDays;

  return {
    y1,
    irrPct: irrPct * 100,
    dailyBenefit,
    estMonthly,
    creditDays,
    totalBenefitIfAllCreditsUsed,
    payoutForChosenMonths,
  };
}

function calcSixtySixPercentDaily({
  grossMonthly,
  inServiceMonthly = 0,
}: {
  grossMonthly: number;
  inServiceMonthly?: number;
}) {
  const benefitMonthlyBase = 0.66 * Math.min(grossMonthly, UIF_MONTHLY_CEILING);
  const dailyBenefit = dailyFromMonthly(benefitMonthlyBase);

  const dailyIncomeActual = dailyFromMonthly(grossMonthly);
  const dailyInService = dailyFromMonthly(inServiceMonthly);
  const dailyDiff = Math.max(0, dailyIncomeActual - dailyInService);
  const topUpPaid = Math.min(dailyDiff, dailyBenefit);

  return {
    dailyBenefit,
    monthlyBenefitApprox: dailyBenefit * 30,
    dailyIncomeActual,
    dailyInService,
    dailyDiff,
    topUpPaid,
  };
}

/* ──────────────────────────────────────────────────────────────────
   Forms & links
   ────────────────────────────────────────────────────────────────── */

type Link = { label: string; href: string };

const LINKS: Record<string, Link[]> = {
  Common: [
    {
      label: "UI-2.8: Bank Account Authorisation (PDF)",
      href: "https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-2_8-authorisation-pay-benefits-into-banking-account.pdf",
    },
    {
      label: "UI-19: Employer Declaration (PDF)",
      href: "https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI19_employers%20declarations.pdf",
    },
    {
      label: "UI-2.7: Remuneration While Employed (PDF)",
      href: "https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-2_7-remuneration-whilst-in-employment.pdf",
    },
  ],
  Unemployment: [
    {
      label: "UI-2.1: Application for Unemployment Benefits (PDF)",
      href: "https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-2-1_application-for-unemployment-benefits.pdf",
    },
  ],
  Maternity: [
    {
      label: "UI-2.3: Application for Maternity Benefits (PDF)",
      href: "https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-2-3_application-for-martenity-benefits.pdf",
    },
    {
      label: "UI-4: Continuation of Maternity Payments (PDF)",
      href: "https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-4_continuation-of-payments-for-maternity-benefits.pdf",
    },
  ],
  Illness: [
    {
      label: "UI-3: Continuation of Illness Payments (PDF)",
      href: "https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-3_continuation-of-payment-for-illness.pdf",
    },
  ],
  Adoption: [
    {
      label: "UI-2.4: Application for Adoption Benefits (PDF)",
      href: "https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-2-4_application-for-adoption-benefits.pdf",
    },
  ],
  Dependants: [
    {
      label: "UI-2.5: Dependant’s Benefits (Spouse / Life Partner) (PDF)",
      href: "https://www.labour.gov.za/DocumentCenter/Publications/Unemployment%20Insurance%20Fund/UI.2.5%20Form%20UI-2.5%20-%20Application%20for%20dependant%27s%20benefits%20by%20surviving%20spouse%20or%20life%20partner.pdf",
    },
    {
      label: "UI-2.6: Dependant’s Benefits (Other Dependants / Children) (PDF)",
      href: "https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-2-6-dependants-benefits-other-than-spouse.pdf",
    },
  ],
};

/* ──────────────────────────────────────────────────────────────────
   Checklists per claim type
   ────────────────────────────────────────────────────────────────── */

const CHECKLIST: Record<ClaimType, string[]> = {
  Unemployment: [
    "ID/Passport",
    "UI-2.1 (Application for Unemployment)",
    "UI-19 (Employer declaration with last day worked & reason)",
    "UI-2.8 (Bank details, stamped)",
    "3 months bank statements",
    "Last 6 months payslips",
  ],
  "Reduced Work Time": [
    "ID/Passport",
    "UI-2.7 (Remuneration while employed) from employer",
    "UI-19 (if requested)",
    "UI-2.8 (Bank details, stamped)",
    "Payslips before and during reduced time",
    "Employer letter on company letterhead confirming reduced hours",
  ],
  Illness: [
    "ID/Passport",
    "Medical certificate confirming period of incapacity",
    "UI-3 (Continuation of Illness payments) monthly while off",
    "UI-2.8 (Bank details, stamped)",
    "Recent payslips",
  ],
  Maternity: [
    "ID/Passport",
    "UI-2.3 (Application for Maternity)",
    "UI-4 (Continuation of Maternity payments)",
    "Child’s birth certificate or medical confirmation of due date",
    "UI-2.8 (Bank details, stamped)",
    "UI-2.7 (if employer pays partial income)",
  ],
  Adoption: [
    "ID/Passport",
    "UI-2.4 (Application for Adoption benefits)",
    "Court adoption order / placement letter",
    "UI-2.8 (Bank details, stamped)",
    "UI-2.7 (if employer pays partial income)",
  ],
  Parental: [
    "ID/Passport",
    "Child’s birth certificate",
    "Proof of parental leave from employer",
    "UI-2.8 (Bank details, stamped)",
    "UI-2.7 (if partial income)",
  ],
  "Dependants / Death": [
    "Deceased’s ID / Passport",
    "Death certificate",
    "UI-2.5 or UI-2.6 (depending on relationship)",
    "Proof of relationship (marriage certificate / birth certificate)",
    "UI-2.8 (Bank details of claimant, stamped)",
    "Deceased’s UI-19 / employer confirmation if available",
  ],
};

/* ──────────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────────── */

export default function UifTool() {
  const [claimType, setClaimType] = React.useState<ClaimType>("Unemployment");

  const [inputs, setInputs] = React.useState({
    averageMonthlyRemuneration: 12000,
    daysWorkedLast4Years: 900,
    monthsToClaim: 6,
    currentMonthlyIncomeWhileOff: 0,
    expectedLeaveDays: 0,
  });

  const [result, setResult] = React.useState<any>(null);
  const [dirty, setDirty] = React.useState(false);

  const markDirty =
    <T,>(setter: React.Dispatch<React.SetStateAction<T>>) =>
    (updater: unknown) => {
      setDirty(true);
      setResult(null);
      setter(updater as any);
    };

  function compute() {
    const notes: string[] = [];
    const avgMonthly = Math.max(0, inputs.averageMonthlyRemuneration);

    if (claimType === "Unemployment") {
      const r = calcUnemployment({
        avgMonthly,
        daysWorked4y: Math.max(0, inputs.daysWorkedLast4Years),
        monthsToClaim: Math.max(0, inputs.monthsToClaim),
      });
      notes.push(
        "Unemployment: IRR formula applied with UIF ceiling applied to salary.",
        "Credits = floor(days worked in last 4 years ÷ 4), capped at 365 days."
      );
      setResult({ type: claimType, ...r, notes });
      setDirty(false);
      return;
    }

    const sixtySix = calcSixtySixPercentDaily({
      grossMonthly: avgMonthly,
      inServiceMonthly: Math.max(0, inputs.currentMonthlyIncomeWhileOff || 0),
    });

    if (claimType === "Reduced Work Time") {
      notes.push(
        "Reduced Work Time: UIF top-up = min(daily salary difference, UIF daily benefit).",
        "If employer income already exceeds UIF benefit, top-up may be zero."
      );
    } else if (claimType === "Maternity") {
      notes.push("Maternity: Benefit is 66% of income capped at UIF ceiling; continuation via UI-4.");
    } else if (claimType === "Illness") {
      notes.push("Illness: Benefit is 66% of income capped at UIF ceiling; continuation via UI-3.");
    } else if (claimType === "Adoption") {
      notes.push("Adoption: 66% capped benefit for the adoption leave period.");
    } else if (claimType === "Parental") {
      notes.push(
        "Parental: 66% capped benefit for the short parental leave (days).",
        "Use expected leave days as a planning reference only."
      );
    } else if (claimType === "Dependants / Death") {
      notes.push(
        "Dependants: Lump-sum style benefit. Use forms UI-2.5 / UI-2.6 and provide proof of relationship and banking documents."
      );
      setResult({ type: claimType, infoOnly: true, notes });
      setDirty(false);
      return;
    }

    setResult({
      type: claimType,
      dailyBenefit: sixtySix.dailyBenefit,
      monthlyBenefitApprox: sixtySix.monthlyBenefitApprox,
      dailyIncomeActual: sixtySix.dailyIncomeActual,
      dailyInService: sixtySix.dailyInService,
      dailyTopUpPaid: sixtySix.topUpPaid,
      notes,
    });
    setDirty(false);
  }

  async function onPDF() {
    if (!result) return alert("Calculate first.");

    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Scend – UIF Estimate (${result.type})`, w / 2, 56, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, w / 2, 72, { align: "center" });

    const body: string[][] = [];
    body.push(["Claim type", result.type]);
    body.push(["Avg monthly remuneration (user)", ZAR(inputs.averageMonthlyRemuneration)]);
    body.push(["UIF monthly ceiling (current)", ZAR(UIF_MONTHLY_CEILING)]);

    if (result.type === "Unemployment") {
      body.push(
        ["Daily income Y1 (capped)", ZAR(result.y1)],
        ["IRR (%)", `${result.irrPct.toFixed(2)}%`],
        ["Daily benefit (estimate)", ZAR(result.dailyBenefit)],
        ["Estimated monthly benefit", ZAR(result.estMonthly)],
        ["Available credit days", `${result.creditDays}`],
        ["Total if all credits used", ZAR(result.totalBenefitIfAllCreditsUsed)],
        ["Payout for chosen months", ZAR(result.payoutForChosenMonths)]
      );
    } else if (result.infoOnly) {
      body.push([
        "Note",
        "Dependants benefits are lump-sum style; use UI-2.5 / UI-2.6 and supply death + relationship documents.",
      ]);
    } else {
      body.push(
        ["Daily benefit (66% capped)", ZAR(result.dailyBenefit)],
        ["Estimated monthly benefit", ZAR(result.monthlyBenefitApprox)],
        ["Daily income actual (for comparison)", ZAR(result.dailyIncomeActual)],
        ["Daily income while on leave/RWT", ZAR(result.dailyInService)],
        ["Daily top-up (min(diff, DBA))", ZAR(result.dailyTopUpPaid)]
      );
    }

    if (result.notes?.length) {
      result.notes.forEach((n: string) => body.push(["Note", n]));
    }

    autoTable(doc, {
      startY: 96,
      styles: { fontSize: 10, cellPadding: 6, halign: "left" },
      head: [["Item", "Value"]],
      body,
      theme: "striped",
      headStyles: { fillColor: [219, 39, 119] },
    });

    // Forms + checklist on second page
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Forms & Documents Checklist", 56, 56);

    const links: Link[] = [
      ...LINKS.Common,
      ...(result.type === "Unemployment"
        ? LINKS.Unemployment
        : result.type === "Maternity"
        ? LINKS.Maternity
        : result.type === "Illness"
        ? LINKS.Illness
        : result.type === "Adoption"
        ? LINKS.Adoption
        : result.type === "Dependants / Death"
        ? LINKS.Dependants
        : result.type === "Reduced Work Time"
        ? [LINKS.Common[2]]
        : []),
    ];

    autoTable(doc, {
      startY: 72,
      styles: { fontSize: 10, cellPadding: 6, halign: "left" },
      head: [["Form / Resource", "URL"]],
      body: links.map((l) => [l.label, l.href]),
      theme: "grid",
      headStyles: { fillColor: [219, 39, 119] },
    });

    const ck = CHECKLIST[result.type as ClaimType];
    if (ck?.length) {
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 16,
        styles: { fontSize: 10, cellPadding: 6, halign: "left" },
        head: [[`${result.type} – Required documents`]],
        body: ck.map((c) => [c]),
        theme: "plain",
      });
    }

    const y =
      (doc as any).lastAutoTable?.finalY !== undefined
        ? (doc as any).lastAutoTable.finalY + 24
        : 96;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text(
      "Disclaimer: Educational estimate. UIF payments depend on Fund rules, credit days, verification and official calculations.\n" +
        "Submit complete forms and supporting documents via a Labour Centre or uFiling. Amounts and eligibility may differ from this estimate.",
      56,
      y
    );

    doc.save(`Scend_UIF_${result.type.replace(/[ /]/g, "_")}.pdf`);
  }

  function glowBtn(base: string) {
    return `glow rounded-2xl px-4 py-2 text-sm font-semibold ${base}`;
  }

  const typeOptions: ClaimType[] = [
    "Unemployment",
    "Reduced Work Time",
    "Illness",
    "Maternity",
    "Adoption",
    "Parental",
    "Dependants / Death",
  ];

  const activeLinks: Link[] = [
    ...LINKS.Common,
    ...(claimType === "Unemployment"
      ? LINKS.Unemployment
      : claimType === "Maternity"
      ? LINKS.Maternity
      : claimType === "Illness"
      ? LINKS.Illness
      : claimType === "Adoption"
      ? LINKS.Adoption
      : claimType === "Dependants / Death"
      ? LINKS.Dependants
      : claimType === "Reduced Work Time"
      ? [LINKS.Common[2]]
      : []),
  ];

  const checklist = CHECKLIST[claimType];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl bg-gradient-to-br from-pink-50 via-white to-white p-8 shadow-sm ring-1 ring-gray-200/60">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Scend UIF Tool
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
            Estimate UIF benefits and see the exact forms & document checklist for each claim type.
            This uses the official UIF IRR and 66% rules with the current income ceiling.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {/* Inputs */}
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-gray-200/70">
          <h2 className="text-lg font-semibold text-gray-900">Inputs</h2>

          <div className="mt-5 grid gap-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-[15px] text-gray-900">
                Claim type
                <select
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={claimType}
                  onChange={(e) => markDirty(setClaimType)(e.target.value as ClaimType)}
                >
                  {typeOptions.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>

              <label className="text-[15px] text-gray-900">
                Average Monthly Remuneration (last 6 months, R)
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={inputs.averageMonthlyRemuneration}
                  onChange={(e) =>
                    markDirty(setInputs)({
                      ...inputs,
                      averageMonthlyRemuneration: Number(e.target.value),
                    })
                  }
                />
                <span className="mt-1 block text-[12px] text-gray-700">
                  UIF ceiling currently {ZAR(UIF_MONTHLY_CEILING)} is applied to income in calculations.
                </span>
              </label>
            </div>

            {claimType === "Unemployment" && (
              <div className="grid gap-3 md:grid-cols-3">
                <label className="text-[15px] text-gray-900">
                  Days worked (last 4 years)
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                    value={inputs.daysWorkedLast4Years}
                    onChange={(e) =>
                      markDirty(setInputs)({
                        ...inputs,
                        daysWorkedLast4Years: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label className="text-[15px] text-gray-900">
                  Months you plan to claim now
                  <input
                    type="number"
                    min={0}
                    max={12}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                    value={inputs.monthsToClaim}
                    onChange={(e) =>
                      markDirty(setInputs)({
                        ...inputs,
                        monthsToClaim: Number(e.target.value),
                      })
                    }
                  />
                  <span className="mt-1 block text-[12px] text-gray-700">
                    We’ll show an approximate payout for these months using ~30 days per month.
                  </span>
                </label>
                <div className="text-[13px] text-gray-700 self-end">
                  Credits accrue at 1 per 4 days worked, capped at 365 days.
                </div>
              </div>
            )}

            {(claimType === "Reduced Work Time" ||
              claimType === "Maternity" ||
              claimType === "Illness" ||
              claimType === "Adoption" ||
              claimType === "Parental") && (
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-[15px] text-gray-900">
                  Current Monthly Income while on leave/RWT (R)
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                    value={inputs.currentMonthlyIncomeWhileOff}
                    onChange={(e) =>
                      markDirty(setInputs)({
                        ...inputs,
                        currentMonthlyIncomeWhileOff: Number(e.target.value),
                      })
                    }
                  />
                  <span className="mt-1 block text-[12px] text-gray-700">
                    If employer pays partial income, the UIF top-up uses min(difference, UIF daily benefit).
                  </span>
                </label>

                {claimType === "Parental" && (
                  <label className="text-[15px] text-gray-900">
                    Expected leave days (optional)
                    <input
                      type="number"
                      min={0}
                      className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-200"
                      value={inputs.expectedLeaveDays}
                      onChange={(e) =>
                        markDirty(setInputs)({
                          ...inputs,
                          expectedLeaveDays: Number(e.target.value),
                        })
                      }
                    />
                    <span className="mt-1 block text-[12px] text-gray-700">
                      For planning; total payout = daily benefit × days actually approved.
                    </span>
                  </label>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={compute}
                className={glowBtn("text-white bg-pink-600 hover:bg-pink-700")}
              >
                Calculate
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setDirty(false);
                  setInputs({
                    averageMonthlyRemuneration: 12000,
                    daysWorkedLast4Years: 900,
                    monthsToClaim: 6,
                    currentMonthlyIncomeWhileOff: 0,
                    expectedLeaveDays: 0,
                  });
                  setClaimType("Unemployment");
                }}
                className={glowBtn(
                  "text-gray-900 bg-white ring-1 ring-gray-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-pink-200"
                )}
              >
                Clear
              </button>
              <button
                onClick={onPDF}
                disabled={!result}
                title={!result ? "Click Calculate first" : "Export UIF estimate + forms to PDF"}
                className={glowBtn(
                  "text-gray-900 bg-white ring-1 ring-gray-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-pink-200 disabled:opacity-50"
                )}
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

        {/* Results & Forms */}
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-gray-200/70">
          <h2 className="text-lg font-semibold text-gray-900">Results</h2>

          {!result ? (
            <div className="mt-4 text-[15px] text-gray-700">
              Enter details and click <strong>Calculate</strong> to see results.
            </div>
          ) : result.infoOnly ? (
            <div className="mt-4 grid gap-2 text-[15px]">
              <div className="rounded-xl bg-pink-50/70 px-3 py-2">
                Dependants / Death claims are calculated as lump-sum benefits. Use forms UI-2.5 / UI-2.6 with death and
                relationship documents and stamped banking details.
              </div>
              {result.notes?.length > 0 && (
                <div className="mt-2 rounded-xl bg-pink-50/70 px-3 py-2 text-[14px]">
                  <div className="font-semibold mb-1">Notes</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.notes.map((n: string, i: number) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : result.type === "Unemployment" ? (
            <div className="mt-4 grid gap-2 text-[15px]">
              <div className="flex items-center justify-between">
                <span>Daily income Y1 (capped)</span>
                <span>{ZAR(result.y1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>IRR</span>
                <span>{result.irrPct.toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Daily benefit (estimate)</span>
                <span>{ZAR(result.dailyBenefit)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated monthly benefit</span>
                <span>{ZAR(result.estMonthly)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Available credit days</span>
                <span>{result.creditDays}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total if all credits used</span>
                <span>{ZAR(result.totalBenefitIfAllCreditsUsed)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Payout for chosen months</span>
                <span>{ZAR(result.payoutForChosenMonths)}</span>
              </div>

              {result.notes?.length > 0 && (
                <div className="mt-2 rounded-xl bg-pink-50/70 px-3 py-2 text-[14px]">
                  <div className="font-semibold mb-1">Notes</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.notes.map((n: string, i: number) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 grid gap-2 text-[15px]">
              <div className="flex items-center justify-between">
                <span>Daily benefit (66% capped)</span>
                <span>{ZAR(result.dailyBenefit)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated monthly benefit</span>
                <span>{ZAR(result.monthlyBenefitApprox)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Daily income actual</span>
                <span>{ZAR(result.dailyIncomeActual)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Daily income while on leave/RWT</span>
                <span>{ZAR(result.dailyInService)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Daily top-up (min(diff, DBA))</span>
                <span>{ZAR(result.dailyTopUpPaid)}</span>
              </div>

              {result.notes?.length > 0 && (
                <div className="mt-2 rounded-xl bg-pink-50/70 px-3 py-2 text-[14px]">
                  <div className="font-semibold mb-1">Notes</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.notes.map((n: string, i: number) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Forms & checklist */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white/60 p-4">
            <div className="text-[15px] font-semibold mb-2">Forms & Links</div>
            <ul className="list-disc pl-5 space-y-1 text-[14px]">
              {activeLinks.map((l) => (
                <li key={l.href}>
                  <a
                    className="text-pink-700 hover:underline"
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            {checklist?.length ? (
              <>
                <div className="mt-4 text-[15px] font-semibold">
                  Required Documents – {claimType}
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[14px]">
                  {checklist.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </>
            ) : null}

            <p className="mt-4 text-[12.5px] leading-relaxed text-gray-700">
              <strong>Tip:</strong> Submit complete packs via your nearest Labour Centre or uFiling. Banking (UI-2.8)
              must be stamped, with no alterations. Incomplete forms and missing employer declarations (UI-19, UI-2.7)
              are the most common cause of delays.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

