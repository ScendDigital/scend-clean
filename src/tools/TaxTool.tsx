
import React, { useState } from "react";

interface Result {
  annualIncome: number;
  taxBeforeRebate: number;
  rebate: number;
  medicalCredit: number;
  finalTax: number;
  monthlyTax: number;
  netIncome: number;
  age: number | null;
}

const TAX_CONFIG = {
  "2025/2026": {
    brackets: [
      { min: 0, max: 237100, rate: 0.18, base: 0 },
      { min: 237101, max: 370500, rate: 0.26, base: 42678 },
      { min: 370501, max: 512800, rate: 0.31, base: 77362 },
      { min: 512801, max: 673000, rate: 0.36, base: 121475 },
      { min: 673001, max: 857900, rate: 0.39, base: 179147 },
      { min: 857901, max: 1817000, rate: 0.41, base: 251258 },
      { min: 1817001, max: Infinity, rate: 0.45, base: 644489 },
    ],
    rebates: { primary: 17235, secondary: 9444, tertiary: 3145 },
    medical: { main: 364, additional: 246 },
  },

  "2026/2027": {
    brackets: [
      { min: 0, max: 250000, rate: 0.18, base: 0 },
      { min: 250001, max: 390000, rate: 0.26, base: 45000 },
      { min: 390001, max: 540000, rate: 0.31, base: 80000 },
      { min: 540001, max: 700000, rate: 0.36, base: 125000 },
      { min: 700001, max: 900000, rate: 0.39, base: 185000 },
      { min: 900001, max: 1900000, rate: 0.41, base: 260000 },
      { min: 1900001, max: Infinity, rate: 0.45, base: 650000 },
    ],
    rebates: { primary: 18000, secondary: 9800, tertiary: 3300 },
    medical: { main: 370, additional: 250 },
  },
};

const TaxTool: React.FC = () => {
  const [taxYear, setTaxYear] = useState<string>("2025/2026");
  const [income, setIncome] = useState<string>("");
  const [dependents, setDependents] = useState<string>("");
  const [idNumber, setIdNumber] = useState<string>("");
  const [result, setResult] = useState<Result | null>(null);

  const config = TAX_CONFIG[taxYear];

  const getAgeFromID = (id: string): number | null => {
    if (!id || id.length < 6) return null;

    const year = parseInt(id.substring(0, 2), 10);
    const month = parseInt(id.substring(2, 4), 10);
    const day = parseInt(id.substring(4, 6), 10);

    const currentYear = new Date().getFullYear() % 100;
    const fullYear = year > currentYear ? 1900 + year : 2000 + year;

    const birthDate = new Date(fullYear, month - 1, day);
    return new Date().getFullYear() - birthDate.getFullYear();
  };

  const calculateTax = (annualIncome: number): number => {
    for (let bracket of config.brackets) {
      if (annualIncome >= bracket.min && annualIncome <= bracket.max) {
        return bracket.base + (annualIncome - bracket.min) * bracket.rate;
      }
    }
    return 0;
  };

  const calculateMedicalCredit = (deps: number): number => {
    if (deps <= 0) return 0;
    if (deps === 1) return config.medical.main;
    if (deps === 2) return config.medical.main * 2;

    return (
      config.medical.main * 2 +
      (deps - 2) * config.medical.additional
    );
  };

  const getRebate = (age: number | null): number => {
    let rebate = config.rebates.primary;

    if (age && age >= 65) rebate += config.rebates.secondary;
    if (age && age >= 75) rebate += config.rebates.tertiary;

    return rebate;
  };

  const handleCalculate = () => {
    if (!income || !dependents || !idNumber) {
      alert("Please complete all fields.");
      return;
    }

    const annualIncome = Number(income);
    const deps = Number(dependents);
    const age = getAgeFromID(idNumber);

    const taxBeforeRebate = calculateTax(annualIncome);
    const rebate = getRebate(age);
    const medicalCredit = calculateMedicalCredit(deps) * 12;

    let finalTax = taxBeforeRebate - rebate - medicalCredit;
    if (finalTax < 0) finalTax = 0;

    const monthlyTax = finalTax / 12;
    const netIncome = annualIncome - finalTax;

    setResult({
      annualIncome,
      taxBeforeRebate,
      rebate,
      medicalCredit,
      finalTax,
      monthlyTax,
      netIncome,
      age,
    });
  };

  const handleClear = () => {
    setIncome("");
    setDependents("");
    setIdNumber("");
    setResult(null);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Scend Tax Calculator</h2>

      <select
        value={taxYear}
        onChange={(e) => setTaxYear(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      >
        <option value="2025/2026">2025/2026</option>
        <option value="2026/2027">2026/2027</option>
      </select>

      <input
        type="number"
        placeholder="Annual Income (R)"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Medical Aid Dependents"
        value={dependents}
        onChange={(e) => setDependents(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="text"
        placeholder="ID Number"
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      <div className="flex gap-2">
        <button
          onClick={handleCalculate}
          className="bg-pink-600 text-white px-4 py-2 rounded"
        >
          Calculate
        </button>

        <button
          onClick={handleClear}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Results</h3>

          <p className="font-semibold">Tax Year: {taxYear}</p>
          <p>Age: {result.age}</p>
          <p>Annual Income: R{result.annualIncome.toLocaleString()}</p>
          <p>Tax Before Rebates: R{result.taxBeforeRebate.toLocaleString()}</p>
          <p>Total Rebates: R{result.rebate.toLocaleString()}</p>
          <p>Medical Credits: R{result.medicalCredit.toLocaleString()}</p>

          <hr className="my-2" />

          <p className="font-bold">
            Final Annual Tax: R{result.finalTax.toLocaleString()}
          </p>

          <p>Monthly PAYE: R{result.monthlyTax.toFixed(2)}</p>

          <p className="mt-2 font-semibold">
            Net Income After Tax: R{result.netIncome.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaxTool;
