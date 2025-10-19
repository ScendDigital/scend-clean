export default function Page() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About Scend</h1>
      <p className="mt-4 text-lg md:text-xl opacity-85">
        Scend builds practical, compliant tools that make complex decisions simple for South Africans—across credit,
        tax, UIF claims and price discovery. We combine transparent calculations, plain language, and thoughtful UX so
        you can act with confidence.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border p-6">
          <h3 className="text-xl font-semibold">Credible</h3>
          <p className="mt-2 text-sm opacity-80">Sensible assumptions, transparent methods, and clear caveats. The final say belongs to the official authority.</p>
        </div>
        <div className="rounded-2xl border p-6">
          <h3 className="text-xl font-semibold">Actionable</h3>
          <p className="mt-2 text-sm opacity-80">Step-by-step guidance, document lists, and share options so you can move fast and accurately.</p>
        </div>
        <div className="rounded-2xl border p-6">
          <h3 className="text-xl font-semibold">Human</h3>
          <p className="mt-2 text-sm opacity-80">Built in SA, for SA. Clear language and respectful defaults for real-world decisions.</p>
        </div>
      </div>
    </div>
  );
}
