import React from "react";
type Kind = "uif" | "tax" | "price" | "loan" | "generic";
export default function ToolDisclaimer({ kind = "generic" }: { kind?: Kind }) {
  let text: React.ReactNode;
  switch (kind) {
    case "price":
      text = <> <strong>Retail price disclaimer:</strong> This tool is an <em>estimator</em>. Prices, stock, and promotions change frequently and may differ by store, region, or date. Always verify with the retailer. </>;
      break;
    case "uif":
      text = <> <strong>UIF disclaimer:</strong> This is an <em>estimator</em>. The UIF/Dept. of Employment & Labour makes the final decision on eligibility, benefit amounts, and payment timing. </>;
      break;
    case "tax":
      text = <> <strong>SARS tax disclaimer:</strong> This is an <em>estimator</em>. SARS determines the final outcome. Confirm on eFiling or with a practitioner before filing. </>;
      break;
    case "loan":
      text = <> <strong>Credit disclaimer:</strong> This is an <em>estimator</em>. Lenders make the final decision based on underwriting, affordability, and credit checks. Quotes here are indicative, not a binding offer. </>;
      break;
    default:
      text = <> <strong>Disclaimer:</strong> These tools are estimators. Final decisions rest with official authorities or providers. </>;
  }
  return <div className="mt-8 rounded-xl border p-4 text-sm leading-6"><p>{text}</p></div>;
}
