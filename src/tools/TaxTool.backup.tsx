import { useMemo, useState } from "react";

// 2024/25 SA personal tax brackets
function annualTaxBeforeRebates(taxable: number){
  const b = [
    { up: 237100, base: 0, rate: 0.18 },
    { up: 370500, base: 42678, rate: 0.26, over: 237100 },
    { up: 512800, base: 77362, rate: 0.31, over: 370500 },
    { up: 673000, base: 121475, rate: 0.36, over: 512800 },
    { up: 857900, base: 179147, rate: 0.39, over: 673000 },
    { up: 1817000, base: 251258, rate: 0.41, over: 857900 },
    { up: Infinity, base: 644489, rate: 0.45, over: 1817000 }
  ];
  for(const br of b){
    if(taxable <= br.up){
      if(!("over" in br)) return taxable * br.rate;
      // @ts-expect-error - known typing quirk
      return br.base + (taxable - br.over) * br.rate;
    }
  }
  return 0;
}

function rebatesByAge(age: number){
  const primary = 17235; // <65
  const secondary = 9444; // 65+ additional
  const tertiary = 3145; // 75+ additional
  if(age >= 75) return primary + secondary + tertiary;
  if(age >= 65) return primary + secondary;
  return primary;
}

function medCredits(beneficiaries: number){
  // R364 each for first two (main + first dependent), R246 each thereafter
  if(beneficiaries <= 0) return 0;
  const firstTwo = Math.min(beneficiaries, 2) * 364;
  const extra = Math.max(0, beneficiaries - 2) * 246;
  return firstTwo + extra;
}

export default function TaxTool(){
  const [annualIncome, setAnnualIncome] = useState(360000); // excluding travel allowance; we add below
  const [dependents, setDependents] = useState(0); // number of medical scheme dependents besides the taxpayer
  const [age, setAge] = useState(35);

  const [travelAllowance, setTravelAllowance] = useState(0); // annual travel allowance
  const [travelTaxablePct, setTravelTaxablePct] = useState(80); // SARS default 80% taxable

  // Mid-month controls
  const [periodDays, setPeriodDays] = useState(30); // calendar days in pay period
  const [daysWorked, setDaysWorked] = useState(15); // days worked/paid in this run

  // Build annual taxable remuneration approximation
  const annualTravelTaxable = useMemo(() => travelAllowance * (travelTaxablePct/100), [travelAllowance, travelTaxablePct]);
  const annualTaxable = useMemo(() => annualIncome + annualTravelTaxable, [annualIncome, annualTravelTaxable]);

  // --- Mid-month proration approach ---
  // 1) Determine "period remuneration" as proportion of monthly (annual/12) by days worked
  const monthlyEquivalent = useMemo(() => annualTaxable / 12, [annualTaxable]);
  const periodRem = useMemo(() => monthlyEquivalent * (daysWorked/Math.max(1, periodDays)), [monthlyEquivalent, daysWorked, periodDays]);

  // 2) Annualise the period remuneration to compute PAYE per SARS method (approx)
  const annualisedForPaye = useMemo(() => (periodRem * 12), [periodRem]);

  const annualTax = useMemo(() => annualTaxBeforeRebates(annualisedForPaye), [annualisedForPaye]);
  const annualRebates = useMemo(() => rebatesByAge(age), [age]);
  const monthlyMedCredits = useMemo(() => medCredits(1 + Math.max(0, dependents)), [dependents]);

  // Convert annual tax back to period tax and subtract monthly medical credits proportionally
  const monthlyTax = useMemo(() => Math.max(0, (annualTax - annualRebates)/12), [annualTax, annualRebates]);
  const periodTaxBeforeCredits = useMemo(() => monthlyTax * (daysWorked/Math.max(1, periodDays)), [monthlyTax, daysWorked, periodDays]);
  const periodTax = useMemo(() => Math.max(0, periodTaxBeforeCredits - (monthlyMedCredits * (daysWorked/Math.max(1, periodDays)))), [periodTaxBeforeCredits, monthlyMedCredits, daysWorked, periodDays]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Annual Income (excl. Travel)</span>
          <input type="number" value={annualIncome} onChange={e=>setAnnualIncome(+e.target.value)} className="mt-1 w-full border rounded-xl p-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Medical Aid Dependents (excl. you)</span>
          <input type="number" value={dependents} onChange={e=>setDependents(+e.target.value)} className="mt-1 w-full border rounded-xl p-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Age</span>
          <input type="number" value={age} onChange={e=>setAge(+e.target.value)} className="mt-1 w-full border rounded-xl p-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Travel Allowance (annual)</span>
          <input type="number" value={travelAllowance} onChange={e=>setTravelAllowance(+e.target.value)} className="mt-1 w-full border rounded-xl p-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Travel Taxable Portion</span>
          <select value={travelTaxablePct} onChange={e=>setTravelTaxablePct(+e.target.value)} className="mt-1 w-full border rounded-xl p-2">
            <option value={80}>80% (default)</option>
            <option value={20}>20% (logbook/proven)</option>
          </select>
        </label>
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">Monthly Medical Credits</div>
          <div className="text-lg font-semibold">R {medCredits(1 + Math.max(0, dependents)).toLocaleString()}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Days in Pay Period</span>
          <input type="number" value={periodDays} onChange={e=>setPeriodDays(+e.target.value)} className="mt-1 w-full border rounded-xl p-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Days Worked/Payable</span>
          <input type="number" value={daysWorked} onChange={e=>setDaysWorked(+e.target.value)} className="mt-1 w-full border rounded-xl p-2" />
        </label>
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">Period Remuneration (approx)</div>
          <div className="text-lg font-semibold">R {periodRem.toLocaleString(undefined,{maximumFractionDigits:2})}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">Estimated Period PAYE</div>
          <div className="text-2xl font-semibold">R {periodTax.toLocaleString(undefined,{maximumFractionDigits:2})}</div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">Annualised (for calc)</div>
          <div className="text-lg font-semibold">R {annualisedForPaye.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">Monthly Med Credits (pro-rated)</div>
          <div className="text-lg font-semibold">R {(medCredits(1 + Math.max(0, dependents)) * (daysWorked/Math.max(1,periodDays))).toLocaleString(undefined,{maximumFractionDigits:2})}</div>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Note: This is an approximate PAYE method using annualisation and pro-rating for mid-month payments.
        For payroll production, apply full SARS rules and fringe benefit treatment.
      </p>
    </div>
  );
}
