import dynamic from "next/dynamic";
const TaxTool = dynamic(() => import("../tools/TaxTool"), { ssr: false });
export default function TaxPage(){
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">SARS PAYE Calculator</h1>
        <TaxTool />
      </div>
    </div>
  );
}
