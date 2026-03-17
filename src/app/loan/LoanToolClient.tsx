"use client";
import dynamic from "next/dynamic";

const LoanTool = dynamic(() => import("../../tools/LoanTool"), {
  ssr: false,
  loading: () => <div>Loading Loan Tool...</div>,
});

export default function LoanToolClient() {
  return <LoanTool />;
}
