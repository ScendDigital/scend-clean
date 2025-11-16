"use client";

export default function UifDocs() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <h2 className="text-2xl font-bold">Required documents & forms</h2>
      <p className="mt-2 text-sm opacity-90">
        Bring originals and certified copies where possible. Use the official forms below:
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <a className="rounded-xl border p-4 hover:bg-gray-50" target="_blank"
           href="https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI19_employers%20declarations.pdf">
          UI-19 — Employer Declaration (official PDF)
        </a>
        <a className="rounded-xl border p-4 hover:bg-gray-50" target="_blank"
           href="https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-2_8-authorisation-pay-benefits-into-banking-account.pdf">
          UI-2.8 — Banking Details / Authorisation (official PDF)
        </a>
        <a className="rounded-xl border p-4 hover:bg-gray-50" target="_blank"
           href="https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-2-1_application-for-unemployment-benefits.pdf">
          UI-2.1 — Application for Unemployment Benefits (official PDF)
        </a>
        <a className="rounded-xl border p-4 hover:bg-gray-50" target="_blank"
           href="https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/Salary%20Schedule%203.pdf">
          Salary Schedule (official PDF)
        </a>
      </div>

      <p className="mt-4 text-xs opacity-80">
        Credit days typically accrue at about 1 day for every 4 days worked (capped at 365 days).
      </p>
    </section>
  );
}
