import LoanToolClient from "../../components/loan/LoanToolClient";
import { computeLoanOutputs, parseZARNumber, NCA_MAX_APR } from "@/lib/loanLogic";

export default function Page() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-6">
      <LoanToolClient />
    </section>
  );
}





