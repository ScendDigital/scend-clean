"use client";

import LoanTool from "@/components/LoanTool";
import ToolLayout from "@/components/ToolLayout";

export default function LoanPage() {
  return (
    <ToolLayout
      title="Loan Qualification Tool"
      subtitle="Affordability, risk assessment, and compliance evaluation"
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section className="bg-white border border-gray-200 p-6">
          <LoanTool />
        </section>
      </div>
    </ToolLayout>
  );
}
