"use client";

import dynamic from "next/dynamic";

// Load UifTool only on the client (avoids SSR hydration mismatches)
const UifTool = dynamic(() => import("../../components/uif/UifTool"), {
  ssr: false,
});

export default function ClientOnly() {
  return <UifTool />;
}

