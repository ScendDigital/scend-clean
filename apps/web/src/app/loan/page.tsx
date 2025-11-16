// src/app/loan/page.tsx
import LoanToolClient from "./LoanToolClient";

export const metadata = {
  title: "Loan Tool | Scend",
  description: "NCA-compliant loan affordability and qualification tool",
};

export default function LoanToolPage() {
  return <LoanToolClient />;
}
