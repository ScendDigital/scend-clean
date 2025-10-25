export default function PublishingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-r from-pink-50 to-white border border-pink-100 p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl font-semibold text-pink-600 mb-4">Scend Publishing</h1>
        <p className="mt-3 text-gray-700 max-w-3xl">
          Transparent, author-first services &mdash; from editing and design to ISBN, KDP setup, and retail readiness.
          Built for South African authors.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/contact"
             className="inline-flex items-center rounded-2xl bg-pink-600 text-white px-6 py-3 shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400">
            Talk to Scend
          </a>
          <a href="#packages"
             className="inline-flex items-center rounded-2xl border border-gray-200 bg-white text-gray-800 px-6 py-3 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-200">
            View Packages
          </a>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="mt-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Publishing Packages</h2>
        <p className="mt-2 text-gray-700">Choose a tier now &mdash; we&rsquo;ll tailor specifics during onboarding.</p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {/* Starter */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-pink-300 transition-all">
            <div className="inline-block rounded-xl bg-pink-50 text-pink-700 text-xs font-semibold px-3 py-1 border border-pink-100">
              Best for first book
            </div>
            <h3 className="mt-3 text-xl font-semibold text-pink-700">Starter</h3>
            <p className="mt-1 text-gray-700">Essentials to get your manuscript retail-ready.</p>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-gray-800">
              <li>ISBN (print &amp; eBook) guidance</li>
              <li>KDP account + title setup</li>
              <li>Basic cover (front only)</li>
              <li>Interior template &amp; layout</li>
              <li>Proof upload &amp; checklist</li>
            </ul>
            <a href="/contact"
               className="mt-4 inline-block rounded-2xl bg-pink-600 text-white px-5 py-2 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400">
              Enquire about Starter
            </a>
          </div>

          {/* Standard */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-pink-300 transition-all">
            <div className="inline-block rounded-xl bg-pink-50 text-pink-700 text-xs font-semibold px-3 py-1 border border-pink-100">
              Most popular
            </div>
            <h3 className="mt-3 text-xl font-semibold text-pink-700">Standard</h3>
            <p className="mt-1 text-gray-700">Professional polish for both print and eBook.</p>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-gray-800">
              <li>Everything in Starter</li>
              <li>Full wrap cover (print) + eBook cover</li>
              <li>Light copy-edit (up to agreed word limit)</li>
              <li>Retail metadata &amp; pricing guidance</li>
              <li>Amazon Author Page setup</li>
            </ul>
            <a href="/contact"
               className="mt-4 inline-block rounded-2xl bg-pink-600 text-white px-5 py-2 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400">
              Enquire about Standard
            </a>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-pink-300 transition-all">
            <div className="inline-block rounded-xl bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 border border-gray-200">
              Complete service
            </div>
            <h3 className="mt-3 text-xl font-semibold text-pink-700">Pro</h3>
            <p className="mt-1 text-gray-700">End-to-end support, including marketing assets.</p>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-gray-800">
              <li>Everything in Standard</li>
              <li>Deeper edit &amp; proofing cycle</li>
              <li>Advanced layout (figures/tables/images)</li>
              <li>Launch kit: mockups &amp; social assets</li>
              <li>Bookstore outreach advisory</li>
            </ul>
            <a href="/contact"
               className="mt-4 inline-block rounded-2xl bg-pink-600 text-white px-5 py-2 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400">
              Enquire about Pro
            </a>
          </div>
        </div>

        <p className="mt-6 text-gray-700">
          Final quotes depend on manuscript length/complexity. Editing is priced per word/page. We&rsquo;ll confirm timelines during onboarding.
        </p>

        <div className="mt-6 rounded-2xl border border-pink-200 bg-pink-50/60 p-6">
          <h3 className="text-lg font-semibold text-pink-700">Ready to get started?</h3>
          <p className="mt-1 text-gray-800">
            Tell us about your manuscript, target format (print/eBook), and launch goals. We&rsquo;ll reply with next steps and a tailored quote.
          </p>
          <a href="/contact"
             className="mt-3 inline-block rounded-2xl bg-pink-600 text-white px-6 py-3 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400">
            Start Onboarding
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Frequently Asked Questions</h2>
        <div className="mt-6 space-y-4">

          <details className="group border border-gray-200 rounded-xl p-4 bg-white open:border-pink-300 transition-colors">
            <summary className="flex justify-between items-center cursor-pointer select-none">
              <span className="font-medium text-gray-900">Do you handle ISBNs?</span>
              <span className="text-pink-600 transition group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-gray-700">
              Yes &mdash; we guide print and eBook ISBNs and ensure your metadata is consistent across retailers.
            </p>
          </details>

          <details className="group border border-gray-200 rounded-xl p-4 bg-white open:border-pink-300 transition-colors">
            <summary className="flex justify-between items-center cursor-pointer select-none">
              <span className="font-medium text-gray-900">Can you publish only an eBook?</span>
              <span className="text-pink-600 transition group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-gray-700">
              Absolutely. We can do eBook-only with a matching cover and proper EPUB/KDP setup.
            </p>
          </details>

          <details className="group border border-gray-200 rounded-xl p-4 bg-white open:border-pink-300 transition-colors">
            <summary className="flex justify-between items-center cursor-pointer select-none">
              <span className="font-medium text-gray-900">Do you support marketing and launch?</span>
              <span className="text-pink-600 transition group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-gray-700">
              Yes. We provide launch assets (mockups, social posts) and guidance for pricing, categories, and positioning.
            </p>
          </details>

        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a href="/contact" className="rounded-2xl border border-gray-200 bg-white text-gray-800 px-6 py-3 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-200">
            Contact Us
          </a>
          <a href="/" className="rounded-2xl border border-gray-200 bg-white text-gray-800 px-6 py-3 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-200">
            Back to Home
          </a>
        </div>

        <p className="mt-10 text-sm text-gray-500">&copy; 2025 Scend Pty Ltd. All rights reserved.</p>
      </section>
    </main>
  );
}
