"use client";

import dynamic from "next/dynamic";

const LazyUifTool = dynamic(() => import("./UifTool"), {
  ssr: false,
  loading: () => <div className="p-6 text-sm">Loading…</div>,
});

export default function UifClient(props: Record<string, any>) {
  return <LazyUifTool {...props} />;
}
