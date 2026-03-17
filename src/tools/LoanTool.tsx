"use client";

import { useMemo, useState } from "react";

type LoanType = "Vehicle" | "Home" | "Personal" | "CreditCard";

const NCA_MAX_RATE = 27.75;

const estimateCreditScore = (
  income: number,
  otherDebt: number,
  loanAmount: number,
  deposit: number
) => {
  const netExposure = Math.max(0, loanAmount - deposit);
  const dtiBase = income > 0 ? (otherDebt / income) * 100 : 100;

  let score = 650;

  if (income >= 60000) score += 60;
  else if (income >= 40000) score += 40;
  else if (income >= 25000) score += 20;
  else if (income < 12000) score -= 40;

  if (dtiBase <= 20) score += 50;
  else if (dtiBase <= 35) score += 20;
  else if (dtiBase > 50) score -= 60;

  if (netExposure <= income * 6) score += 25;
  else if (netExposure > income * 18) score -= 35;

  return Math.max(300, Math.min(850, Math.round(score)));
};

const getInterestRate = (loanType: LoanType, creditScore: number) => {
  let baseRate = 0;

  switch (loanType) {
    case "Personal":
      baseRate = 22;
      break;
    case "Vehicle":
      baseRate = 14;
      break;
    case "Home":
      baseRate = 11;
      break;
    case "CreditCard":
      baseRate = 24;
      break;
    default:
      baseRate = 20;
  }

  if (creditScore >= 750) baseRate -= 2.5;
  else if (creditScore >= 680) baseRate -= 1.5;
  else if (creditScore < 550) baseRate += 3;
  else if (creditScore < 620) baseRate += 1.5;

  return Math.min(Math.max(baseRate, 0), NCA_MAX_RATE);
};

const calculateMonthlyRepayment = (
  principal: number,
  annualRate: number,
  termMonths: number
) => {
  if (termMonths <= 0) return 0;

  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) return principal / termMonths;

  return (
    (principal * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -termMonths))
  );
};

const calculateDTI = (
  income: number,
  existingDebt: number,
  repayment: number
) => {
  if (income <= 0) return 0;
  return ((existingDebt + repayment) / income) * 100;
};

const getRiskLevel = (dti: number) => {
  if (dti < 30) return "Low";
  if (dti < 45) return "Moderate";
  if (dti < 55) return "High";
  return "Severe";
};

const getDecisionLabel = (
  dti: number,
  repayment: number,
  disposableIncome: number
) => {
  if (repayment > disposableIncome) return "Declined";
  if (dti > 55) return "Declined";
  if (dti > 45) return "Borderline";
  return "Approved";
};

const getDecisionColor = (label: string) => {
  switch (label) {
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Borderline":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-red-100 text-red-700";
  }
};

export default function LoanTool() {
  const [loanType, setLoanType] = useState<LoanType>("Vehicle");
  const [amount, setAmount] = useState(250000);
  const [term, setTerm] = useState(72);
  const [income, setIncome] = useState(22000);
  const [otherDebt, setOtherDebt] = useState(2500);
  const [deposit, setDeposit] = useState(0);
  const [balloonPct, setBalloonPct] = useState(0);

  function onTypeChange(v: LoanType) {
    setLoanType(v);
    if (v === "CreditCard") {
      setTerm(60);
      setBalloonPct(0);
    }
    if (v === "Personal") {
      setTerm(36);
      setBalloonPct(0);
    }
    if (v === "Home") {
      setTerm(240);
      setBalloonPct(0);
    }
    if (v === "Vehicle") {
      setTerm(72);
    }
  }

  const creditScore = useMemo(() => {
    return estimateCreditScore(income, otherDebt, amount, deposit);
  }, [income, otherDebt, amount, deposit]);

  const rate = useMemo(() => {
    return getInterestRate(loanType, creditScore);
  }, [loanType, creditScore]);

  const disposableIncome = useMemo(() => {
    return Math.max(0, income - otherDebt);
  }, [income, otherDebt]);

  const principalBase = useMemo(() => {
    let base = amount;
    if (loanType === "Vehicle" || loanType === "Home") {
      base = Math.max(0, amount - deposit);
    }
    return +base.toFixed(2);
  }, [amount, deposit, loanType]);

  const balloonAmount = useMemo(() => {
    if (loanType !== "Vehicle") return 0;
    return +(principalBase * (balloonPct / 100)).toFixed(2);
  }, [loanType, principalBase, balloonPct]);

  const financedPrincipal = useMemo(() => {
    if (loanType === "Vehicle") {
      return Math.max(0, principalBase - balloonAmount);
    }
    return principalBase;
  }, [loanType, principalBase, balloonAmount]);

  const repayment = useMemo(() => {
    return +calculateMonthlyRepayment(financedPrincipal, rate, term).toFixed(2);
  }, [financedPrincipal, rate, term]);

  const dti = useMemo(() => {
    return +calculateDTI(income, otherDebt, repayment).toFixed(2);
  }, [income, otherDebt, repayment]);

  const riskLevel = useMemo(() => getRiskLevel(dti), [dti]);

  const decisionLabel = useMemo(() => {
    return getDecisionLabel(dti, repayment, disposableIncome);
  }, [dti, repayment, disposableIncome]);

  const decision = useMemo(() => {
    const complianceOk = dti <= 55 && repayment <= disposableIncome;
    const label =
      decisionLabel === "Approved" && complianceOk
        ? "Approved (subject to checks)"
        : decisionLabel === "Borderline"
        ? "Borderline"
        : decisionLabel === "Declined" && dti > 55
        ? "Non-compliant (DTI)"
        : "Declined";

    return {
      label,
      color: getDecisionColor(decisionLabel),
    };
  }, [decisionLabel, dti, repayment, disposableIncome]);

  const totalInterest = useMemo(() => {
    return +(repayment * term - financedPrincipal).toFixed(2);
  }, [repayment, term, financedPrincipal]);

  const totalRepay = useMemo(() => {
    return +(repayment * term + (loanType === "Vehicle" ? balloonAmount : 0)).toFixed(2);
  }, [repayment, term, loanType, balloonAmount]);

  const affordabilityGap = useMemo(() => {
    return +(disposableIncome - repayment).toFixed(2);
  }, [disposableIncome, repayment]);

  const suggestions = useMemo(() => {
    const items: string[] = [];

    if (deposit === 0 && (loanType === "Vehicle" || loanType === "Home")) {
      items.push("Consider a deposit to reduce financed exposure and monthly repayment.");
    }

    if (balloonPct > 20 && loanType === "Vehicle") {
      items.push("A high balloon lowers instalments now but increases the end-of-term obligation.");
    }

    if (dti > 45) {
      items.push("Reduce existing debt to improve affordability and DTI.");
    }

    if (repayment > disposableIncome) {
      items.push("Current repayment exceeds disposable income; reduce loan amount or extend the term.");
    }

    if (creditScore < 620) {
      items.push("Improving credit behavior may help secure a lower interest rate.");
    }

    if (items.length === 0) {
      items.push("Affordability looks reasonable on the current inputs, subject to full lender checks.");
    }

    return items;
  }, [deposit, loanType, balloonPct, dti, repayment, disposableIncome, creditScore]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Loan Type</span>
          <select
            value={loanType}
            onChange={(e) => onTypeChange(e.target.value as LoanType)}
            className="mt-1 w-full border rounded-xl p-2"
          >
            <option value="Vehicle">Vehicle Finance</option>
            <option value="Home">Home Loan</option>
            <option value="Personal">Personal Loan</option>
            <option value="CreditCard">Credit Card</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Amount (ZAR)</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
            className="mt-1 w-full border rounded-xl p-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Term (months)</span>
          <input
            type="number"
            value={term}
            onChange={(e) => setTerm(+e.target.value)}
            className="mt-1 w-full border rounded-xl p-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Interest (% p.a.)</span>
          <input
            type="number"
            step="0.01"
            value={rate}
            readOnly
            className="mt-1 w-full border rounded-xl p-2 bg-gray-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Monthly Income</span>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(+e.target.value)}
            className="mt-1 w-full border rounded-xl p-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Other Debt Repayments</span>
          <input
            type="number"
            value={otherDebt}
            onChange={(e) => setOtherDebt(+e.target.value)}
            className="mt-1 w-full border rounded-xl p-2"
          />
        </label>

        {(loanType === "Vehicle" || loanType === "Home") && (
          <label className="block">
            <span className="text-sm font-medium">Deposit (ZAR)</span>
            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(+e.target.value)}
              className="mt-1 w-full border rounded-xl p-2"
            />
          </label>
        )}

        {loanType === "Vehicle" && (
          <label className="block">
            <span className="text-sm font-medium">Balloon (%)</span>
            <input
              type="number"
              value={balloonPct}
              onChange={(e) => setBalloonPct(+e.target.value)}
              className="mt-1 w-full border rounded-xl p-2"
            />
          </label>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">Monthly Repayment</div>
          <div className="text-2xl font-semibold">R {repayment.toLocaleString()}</div>
        </div>

        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">DTI</div>
          <div className="text-2xl font-semibold">{dti.toFixed(1)}%</div>
        </div>

        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">Risk Level</div>
          <div className="text-2xl font-semibold">{riskLevel}</div>
        </div>

        <div className={`rounded-2xl border p-4 ${decision.color}`}>
          <div className="text-sm">Decision</div>
          <div className="text-lg font-semibold">{decision.label}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">Estimated Credit Score</div>
          <div className="text-lg font-semibold">{creditScore}</div>
        </div>

        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">Disposable Income</div>
          <div className="text-lg font-semibold">R {disposableIncome.toLocaleString()}</div>
        </div>

        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">Interest Rate Applied</div>
          <div className="text-lg font-semibold">{rate.toFixed(2)}%</div>
        </div>

        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">Affordability Gap</div>
          <div className="text-lg font-semibold">R {affordabilityGap.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">Loan Base (after deposit)</div>
          <div className="text-lg font-semibold">R {principalBase.toLocaleString()}</div>
        </div>

        {loanType === "Vehicle" && (
          <div className="rounded-2xl border p-4">
            <div className="text-sm text-gray-600">Balloon (due at end)</div>
            <div className="text-lg font-semibold">R {balloonAmount.toLocaleString()}</div>
          </div>
        )}

        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">Total Repayment</div>
          <div className="text-lg font-semibold">R {totalRepay.toLocaleString()}</div>
        </div>

        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">Total Interest (est.)</div>
          <div className="text-lg font-semibold">R {totalInterest.toLocaleString()}</div>
        </div>
      </div>

      <div className="rounded-2xl border p-4">
        <div className="text-sm text-gray-600 mb-2">Recommendations</div>
        <ul className="list-disc pl-5 space-y-1">
          {suggestions.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
