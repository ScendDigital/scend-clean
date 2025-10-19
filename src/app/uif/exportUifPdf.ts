import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { UifInputs, UifResults } from "./logic";

export function exportUifPdf(inputs: UifInputs, results: UifResults) {
  const doc = new jsPDF({ unit: "pt" }); // points for nicer spacing
  const title = "Scend — UIF Benefit Summary";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title, 40, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("This is an indicative estimate only. Actual benefits, timing, and eligibility depend on UIF rules, verification, and your claim outcome.", 40, 60, { maxWidth: 515 });

  const inputRows = [
    ["Average Monthly Salary", formatMoney(inputs.avgMonthlySalary)],
    ["Days Worked (last 48 months)", String(inputs.daysWorkedLast48Months)],
    ["UIF Salary Cap", formatMoney(inputs.salaryCap ?? 17712)],
  ];

  autoTable(doc, {
    startY: 85,
    head: [["Inputs", "Value"]],
    body: inputRows,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [236, 72, 153] }, // Scend pink
  });

  const estRows = [
    ["Benefit Rate", `${(results.benefitRate * 100).toFixed(0)}%`],
    ["Capped Salary Used", formatMoney(results.cappedSalary)],
    ["Daily Remuneration", formatMoney(results.dailyRemuneration)],
    ["Daily UIF Benefit", formatMoney(results.dailyBenefit)],
    ["Monthly Benefit (approx)", formatMoney(results.monthlyBenefitApprox)],
    ["Credit Days", String(results.creditDays)],
    ["Estimated Duration", `${results.monthsApprox.toFixed(1)} month(s)`],
    ["Total Potential (full credit days)", formatMoney(results.totalPotential)],
  ];

  // place estimates table right after inputs table
  const afterInputsY = (doc as any).lastAutoTable.finalY + 14;
  autoTable(doc, {
    startY: afterInputsY,
    head: [["Estimates", "Value"]],
    body: estRows,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [107, 114, 128] }, // neutral gray
  });

  // footer note
  const afterEstimatesY = (doc as any).lastAutoTable.finalY + 24;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    "Disclaimer: Scend provides independent tools and guidance and is not affiliated with the Department of Labour.",
    40,
    afterEstimatesY
  );
  doc.text(
    "This estimator uses simplified logic (benefit cap and rate tiers) to help planning; it is not financial advice.",
    40,
    afterEstimatesY + 14
  );

  doc.save("uif-benefit-summary.pdf");
}

function formatMoney(v: number): string {
  if (!isFinite(v)) return "R 0.00";
  return "R " + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
