export default function PriceComparePage() {
  return (
    <div className="scend-tool-ui w-full py-4 md:py-6">
      <section className="overflow-hidden rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-gray-50 px-6 py-8 shadow-[0_14px_40px_rgba(31,41,55,0.07)] sm:px-9 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-700">Scend digital tools</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-pink-700 sm:text-4xl">Scend Price Compare Tool</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-gray-600">Compare everyday prices across South African retailers with a clear, simple view.</p>
        <div className="mt-8 max-w-2xl rounded-2xl border border-pink-100 bg-white/90 p-5 shadow-sm sm:p-6">
          <span className="inline-flex rounded-full border border-pink-100 bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">In development</span>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Price comparison is coming soon</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">We are preparing this tool. It is not available for use yet.</p>
        </div>
      </section>
    </div>
  );
}
