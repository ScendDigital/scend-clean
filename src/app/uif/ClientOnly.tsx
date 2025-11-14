"use client";

import dynamic from "next/dynamic";

// Load UIFTool only on the client (avoids SSR hydration mismatches)
const UIFTool = dynamic(() => import("../../components/uif/UIFTool"), {
  ssr: false,
});

export default function ClientOnly() {
  return <UIFTool />;
}
