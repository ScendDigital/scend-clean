import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportTaxPdf(payload: {
  mode: "year"|"month";
  isProrated: boolean;
  grossIncome: number;
  monthlyTax?: number;
  annualTax?: number;
  medicalDependants: number;
  notes?: string;
}) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("SARS Tax Calculation (2024/2025)", 14, 18);

  autoTable(doc, {
    startY: 24,
    head: [["Field", "Value"]],
    body: [
      ["Mode", payload.mode === "year" ? "Yearly" : "Monthly"],
      ["Prorated month?", payload.isProrated ? "Yes" : "No"],
      ["Gross income used", `R ${Number(payload.grossIncome||0).toLocaleString()}`],
      ...(payload.mode === "month"
        ? [["Monthly PAYE", `R ${Number(payload.monthlyTax || 0).toFixed(2)}`] as [string, string]]
        : [["Annual PAYE", `R ${Number(payload.annualTax || 0).toFixed(2)}`] as [string, string]]),
      ["Medical dependants", String(payload.medicalDependants)],
      ...(payload.notes ? [["Notes", payload.notes] as [string, string]] : []),
    ],
    styles: { fontSize: 10 },
  });

  doc.save("tax-results.pdf");
}
