"use client";

import { useState } from "react";
import UifDocs from "./UifDocs";
import UifCalculator from "./UifCalculator";
import PaymentDuration from "./PaymentDuration";
import ShareBar from "./ShareBar";
import SectionHeading from "./SectionHeading";
import StatTiles from "./StatTiles";
import BenefitProgress from "./BenefitProgress";
import InfoCallout from "./InfoCallout";
import type { UifInputs, UifResults } from "./logic";
import { exportUifPdf } from "./exportUifPdf";

export default function Page() {
  const [results, setResults] = useState<UifResults | null>(null);
  const [inputs, setInputs] = useState<UifInputs | null>(null);

  return (
    <>
      {/* Estimator Section */}
      <section className="mx-auto max-w-5xl px-4 py-8 space-y-8 bg-gray-50 rounded-3xl shadow-sm" id="estimator">
        <SectionHeading
          title="UIF Benefit Estimator"
          subtitle="Indicative estimate. Actual amounts & timing depend on UIF verification and outcome."
        />

        <div className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm">
          <UifCalculator
            onCalculated={(r, i) => {
              setResults(r);
              if (i) setInputs(i);
            }}
          />

          {results && inputs && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
              <button
                onClick={() => exportUifPdf(inputs, results)}
                className="px-4 py-2 rounded-2xl shadow-sm border border-pink-500 bg-pink-500 text-white hover:bg-pink-600"
              >
                Export PDF
              </button>
              <ShareBar
                className="ml-auto"
                message={`My estimated UIF monthly benefit is ~R ${results.monthlyBenefitApprox.toFixed(2)} with ~${results.creditDays} credit days.`}
              />
            </div>
          )}
        </div>

        {results && (
          <div className="space-y-4">
            <StatTiles
              monthlyBenefit={results.monthlyBenefitApprox}
              creditDays={results.creditDays}
              monthsApprox={results.monthsApprox}
            />
            <BenefitProgress creditDays={results.creditDays} />
            <InfoCallout>
              Remember to keep your bank details active and respond quickly to any UIF requests. Continuation confirmations may be required monthly.
            </InfoCallout>
          </div>
        )}

        <PaymentDuration results={results} />
      </section>

      {/* Documents Section */}
      <div className="w-full bg-gray-100 border-t border-gray-300" id="documents">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <UifDocs />
        </div>
      </div>

      {/* Disclaimer */}
      <section className="mx-auto max-w-5xl px-4 py-8 bg-gray-50 rounded-2xl mt-6 border border-gray-200">
        <div className="text-xs text-gray-500">
          <p>
            <strong>Disclaimer:</strong> Scend provides independent tools and guidance and is not affiliated with the Department of Labour.
            This estimator uses simplified logic (benefit cap and rate tiers) to help you plan; it is not financial advice.
          </p>
        </div>
      </section>
    </>
  );
}
