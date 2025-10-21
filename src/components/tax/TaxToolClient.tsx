/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";

const LazyTaxTool = dynamic(() => import("./TaxTool"), {
  ssr: false,
  loading: () => <div className="p-6 text-sm">Loading Tax Tool…</div>,
});

export default function TaxToolClient(props: Record<string, any>) {
  return <LazyTaxTool {...props} />;
}

