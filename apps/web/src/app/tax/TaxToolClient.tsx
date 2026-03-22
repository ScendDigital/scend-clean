"use client";
import dynamic from "next/dynamic";

const TaxTool = dynamic(() => import("../../components/tax/TaxTool"), {
  ssr: false,
  loading: () => <div>Loading Tax ToolÃ¢â‚¬Â¦</div>,
});

export default function TaxToolClient() {
  return <TaxTool />;
}


