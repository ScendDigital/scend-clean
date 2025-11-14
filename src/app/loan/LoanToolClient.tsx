// src/app/loan/LoanToolClient.tsx
"use client";

import dynamic from "next/dynamic";

const LoanTool = dynamic(() => import("@/components/loan/LoanTool"), {
  ssr: false,
  loading: () => <div className="p-6 text-[15px] text-[var(--scend-gray-700)]">Loading Loan Tool…</div>,
});

export default function LoanToolClient() {
  return <LoanTool />;
}
