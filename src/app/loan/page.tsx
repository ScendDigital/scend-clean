import ShareButtons from "../../components/ShareButtons";
import ToolDisclaimer from "../../components/ToolDisclaimer";
import LoanToolClient from "../../components/LoanToolClient";

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Loan Tool</h1>
      
      <ShareButtons />
      <ToolDisclaimer kind="loan" />
</div>
  );
}



// ---- SCEND NOTE (LOAN) ----
// import { calcLoan } from "./loanEngine";
//
// Example usage after validating inputs:
//   const out = calcLoan({
//     type: loanType,                    // "vehicle" | "home" | "personal" | "credit"
//     principal: Number(price),
//     deposit: Number(deposit || 0),
//     balloonPct: Number(balloonPct || 0),  // vehicle only
//     annualRatePct: Number(interestPct),
//     termMonths: Number(term),
//     incomeMonthly: Number(income),
//     expensesMonthly: Number(expenses),
//   });
//   // Display:
//   // out.monthlyRepayment, out.totalInterest, out.totalRepaid,
//   // out.balloonAmountEnd, out.disposableIncome, out.dtiPct,
//   // out.ncaRateAppliedPct, out.approved, out.reasons
// ----------------------------
