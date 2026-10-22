export const caps = {
  unsecured: { marginPct: 21 }, // Personal loans: repo + 21%
  vehicle: {
    marginPct: 17, // Other credit agreements: repo + 17%
    policy: { maxBalloonPct: 0.4, maxTermMonths: 72 },
  },
  mortgage: {
    marginPct: 12,
    fixedMaxAPR: undefined as number | undefined, // Optional product override
  },
  revolving: { marginPct: 14 }, // Credit facilities, including credit cards

  // Monthly service-fee cap (incl. VAT)
  serviceFeeMax: 69.0,

  // NCA Regulation 42 Table B initiation fee structures.
  initiationFee: {
    unsecured: { base: 165, pct: 0.10, threshold: 1_000, max: 1_050 },
    revolving: { base: 165, pct: 0.10, threshold: 1_050, max: 1_050 },
    vehicle:   { base: 165, pct: 0.10, threshold: 1_000, max: 1_050 },
    mortgage:  { base: 1_100, pct: 0.10, threshold: 10_000, max: 5_250 },
  },

  // SARB repo rate effective 1 October 2026; editable in the tool.
  repoDefaultPct: 7.25,
};

export type LoanRateClass = "unsecured" | "vehicle" | "mortgage" | "revolving";

/** NCA maximum nominal APR (decimal) for an agreement type. */
export function ncaMaxAPRDecimal(loanClass: LoanRateClass, repoPct = caps.repoDefaultPct): number {
  const marginPct = caps[loanClass].marginPct;
  return Math.max(0, (Math.max(0, repoPct) + marginPct) / 100);
}

/** Mortgage compatibility helper retained for existing imports. */
export function mortgageCapAPRDecimal(repoPct?: number): number {
  if (typeof caps.mortgage.fixedMaxAPR === "number") return caps.mortgage.fixedMaxAPR;
  return ncaMaxAPRDecimal("mortgage", repoPct);
}


