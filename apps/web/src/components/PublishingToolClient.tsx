"use client";

import dynamic from "next/dynamic";

const PublishingTool = dynamic(() => import("@/tools/PublishingTool"), {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center text-gray-600">
      Loading Scend Publishing…
    </div>
  ),
});

export default function PublishingToolClient() {
  return <PublishingTool />;
}
