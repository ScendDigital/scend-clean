"use client";

import dynamic from "next/dynamic";

// ✅ Load UIF Tool dynamically (client-side only)
const UifTool = dynamic(() => import("@/tools/UifTool"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 text-gray-600">
      Loading UIF Tool...
    </div>
  ),
});

export default function UifToolClient() {
  return (
    <div className="animate-fadeIn">
      <UifTool />
    </div>
  );
}
