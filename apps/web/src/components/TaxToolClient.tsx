"use client";
import dynamic from "next/dynamic";

// If your TaxTool lives at src/tools/TaxTool.(tsx|ts|jsx|js)
const TaxTool = dynamic(() => import("../tools/TaxTool"), { ssr: false });

export default function TaxToolClient() {
  return <TaxTool />;
}
