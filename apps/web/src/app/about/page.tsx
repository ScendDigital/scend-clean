"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Outer card – same style as Contact */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Top gradient header area */}
          <div className="bg-gradient-to-b from-pink-50 via-pink-50/60 to-white px-6 pb-6 pt-8 sm:px-8 sm:pt-10">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              About Us
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Scend is a multi-service ecosystem. We build digital tools, publish
              powerful stories, and offer practical services that help people move
              from confusion to clarity — financially, emotionally, and in everyday life.
            </p>
          </div>

          {/* Bottom content – 2 columns like Contact Us */}
          <div className="grid gap-8 border-t border-slate-100 px-6 pb-8 pt-6 sm:px-8 sm:pt-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
            {/* LEFT COLUMN – similar to "Send a message" card */}
            <div className="rounded-3xl border border-slate-100 bg-white px-5 py-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:px-6 sm:py-7">
              <h2 className="text-lg font-semibold text-slate-900">
                Who is Scend?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Scend was created for people who are tired of complicated systems
                and services that don&apos;t really serve them. Our work spans{" "}
                <span className="font-semibold text-slate-900">
                  digital tools, publishing, wellness and on-the-ground services
                </span>
                , but the heart is the same: making life easier and more dignified.
              </p>

              <div className="mt-5 space-y-4 text-sm text-slate-700">
                <div>
                  <h3 className="font-semibold text-slate-900">Scend Digital</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Web tools like <span className="font-medium">LoanTool</span>,
                    <span className="font-medium"> TaxTool</span> and the{" "}
                    <span className="font-medium">UIF claims tool</span> that explain
                    the &quot;why&quot; behind the numbers, not just the outcome.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">Scend Publishing</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Support for authors from idea to book-in-hand — editing, layout,
                    guidance and publishing. It all began with{" "}
                    <span className="italic">Silent Pain: The Untold Struggles of
                    South Africa&apos;s Black Men</span>.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Scend Wellness &amp; Services
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Practical tools for financial and emotional wellness, plus
                    real-world services like plumbing and maintenance that keep homes
                    and businesses running.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN – similar to pink WhatsApp card */}
            <div className="rounded-3xl border border-pink-100 bg-pink-50 px-5 py-6 sm:px-6 sm:py-7">
              <h2 className="text-lg font-semibold text-slate-900">
                Scend at a glance
              </h2>
              <p className="mt-2 text-sm text-slate-700">
                A quick snapshot of what defines us.
              </p>

              <dl className="mt-5 space-y-4 text-sm text-slate-800">
                <div>
                  <dt className="font-semibold text-slate-900">Based in</dt>
                  <dd className="text-slate-700">Johannesburg, South Africa</dd>
                </div>

                <div>
                  <dt className="font-semibold text-slate-900">
                    What we care about
                  </dt>
                  <dd className="text-slate-700">
                    Clarity, dignity and access — especially in spaces like money,
                    contracts and decision-making that usually feel intimidating.
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-slate-900">
                    How we show up
                  </dt>
                  <dd className="text-slate-700">
                    Through smart web tools, honest conversations, practical services
                    and books that challenge, heal and inform.
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-slate-900">
                    Our promise
                  </dt>
                  <dd className="text-slate-700">
                    To stay premium in quality but human in attitude — approachable,
                    transparent, and genuinely on the side of ordinary people.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

