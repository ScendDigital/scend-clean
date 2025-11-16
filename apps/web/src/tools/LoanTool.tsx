import { useMemo, useState } from "react";

type LoanType = "Vehicle" | "Home" | "Personal" | "CreditCard";

function defaultRateFor(type: LoanType){
  switch(type){
    case "Vehicle": return 16.5;
    case "Home": return 13.5;
    case "Personal": return 23.0;
    case "CreditCard": return 20.5;
  }
}

function monthlyRate(annualRatePct: number){
  return (annualRatePct/100) / 12;
}

function pmt(monthlyRateDec: number, nMonths: number, principal: number){
  if(monthlyRateDec === 0) return principal / nMonths;
  const i = monthlyRateDec;
  return (i * principal) / (1 - Math.pow(1+i, -nMonths));
}

export default function LoanTool(){
  const [loanType, setLoanType] = useState<LoanType>("Vehicle");
  const [amount, setAmount] = useState(250000);
  const [term, setTerm] = useState(72);
  const [rate, setRate] = useState(defaultRateFor("Vehicle")!);
  const [income, setIncome] = useState(22000);
  const [otherDebt, setOtherDebt] = useState(2500);

  const [deposit, setDeposit] = useState(0);
  const [balloonPct, setBalloonPct] = useState(0);

  function onTypeChange(v: LoanType){
    setLoanType(v);
    setRate(defaultRateFor(v)!);
    if(v === "CreditCard"){ setTerm(60); setBalloonPct(0); }
    if(v === "Personal"){ setTerm(36); setBalloonPct(0); }
    if(v === "Home"){ setTerm(240); setBalloonPct(0); }
    if(v === "Vehicle"){ setTerm(72); }
  }

  const principalBase = useMemo(() => {
    let base = amount;
    if(loanType === "Vehicle" || loanType === "Home"){ base = Math.max(0, amount - deposit); }
    return base;
  }, [amount, deposit, loanType]);

  const balloonAmount = useMemo(() => {
    if(loanType !== "Vehicle") return 0;
    return +(principalBase * (balloonPct/100)).toFixed(2);
  }, [loanType, principalBase, balloonPct]);

  const financedPrincipal = useMemo(() => {
    if(loanType === "Vehicle"){
      return Math.max(0, principalBase - balloonAmount);
    }
    return principalBase;
  }, [loanType, principalBase, balloonAmount]);

  const mRate = monthlyRate(rate);
  const repayment = useMemo(() => +pmt(mRate, term, financedPrincipal).toFixed(2), [mRate, term, financedPrincipal]);
  const dti = useMemo(() => (income > 0 ? ((otherDebt + repayment) / income) * 100 : 0), [income, otherDebt, repayment]);

  const decision = useMemo(() => {
    if(repayment > Math.max(0, income - otherDebt)) return { label: "Declined", color: "bg-red-100 text-red-700" };
    if(dti > 55) return { label: "Non-compliant (DTI)", color: "bg-red-100 text-red-700" };
    if(dti > 45) return { label: "Borderline", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Approved (subject to checks)", color: "bg-green-100 text-green-700" };
  }, [dti, income, otherDebt, repayment]);

  const totalInterest = useMemo(() => {
    return +(repayment * term - financedPrincipal).toFixed(2);
  }, [repayment, term, financedPrincipal]);

  const totalRepay = useMemo(() => {
    return +(repayment * term + (loanType === "Vehicle" ? balloonAmount : 0)).toFixed(2);
  }, [repayment, term, loanType, balloonAmount]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Loan Type</span>
          <select value={loanType} onChange={e=>onTypeChange(e.target.value as LoanType)} className="mt-1 w-full border rounded-xl p-2">
            <option value="Vehicle">Vehicle Finance</option>
            <option value="Home">Home Loan</option>
            <option value="Personal">Personal Loan</option>
            <option value="CreditCard">Credit Card</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Amount (ZAR)</span>
          <input type="number" value={amount} onChange={e=>setAmount(+e.target.value)} className="mt-1 w-full border rounded-xl p-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Term (months)</span>
          <input type="number" value={term} onChange={e=>setTerm(+e.target.value)} className="mt-1 w-full border rounded-xl p-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Interest (% p.a.)</span>
          <input type="number" step="0.01" value={rate} onChange={e=>setRate(+e.target.value)} className="mt-1 w-full border rounded-xl p-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Monthly Income</span>
          <input type="number" value={income} onChange={e=>setIncome(+e.target.value)} className="mt-1 w-full border rounded-xl p-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Other Debt Repayments</span>
          <input type="number" value={otherDebt} onChange={e=>setOtherDebt(+e.target.value)} className="mt-1 w-full border rounded-xl p-2" />
        </label>

        {(loanType === "Vehicle" || loanType === "Home") && (
          <label className="block">
            <span className="text-sm font-medium">Deposit (ZAR)</span>
            <input type="number" value={deposit} onChange={e=>setDeposit(+e.target.value)} className="mt-1 w-full border rounded-xl p-2" />
          </label>
        )}
        {loanType === "Vehicle" && (
          <label className="block">
            <span className="text-sm font-medium">Balloon (%)</span>
            <input type="number" value={balloonPct} onChange={e=>setBalloonPct(+e.target.value)} className="mt-1 w-full border rounded-xl p-2" />
          </label>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">Monthly Repayment</div>
          <div className="text-2xl font-semibold">R {repayment.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-600">DTI</div>
          <div className="text-2xl font-semibold">{dti.toFixed(1)}%</div>
        </div>
        <div className={`rounded-2xl border p-4 ${decision.color}`}>
          <div className="text-sm">Decision</div>
          <div className="text-lg font-semibold">{decision.label}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
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
    </div>
  );
}
