import React from "react";
import UIFTool from "@/components/UIFTool";

export default function UIFPage() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">UIF Estimator</h1>
        <UIFTool />
      </div>
    </main>
  );
}
