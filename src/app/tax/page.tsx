import TaxTool from "@/tools/TaxTool";

export default function TaxPage() {
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_TAX_V2 === "true";

  if (!isEnabled) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-bold">Tax Tool Coming Soon</h1>
      </div>
    );
  }

  return <TaxTool />;
}
