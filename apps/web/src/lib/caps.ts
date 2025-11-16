export const caps = {
  unsecured: { maxAPR: 0.2775 }, // 27.75% (policy cap; update if needed)
  vehicle: {
    maxAPR: 0.2775,
    policy: { maxBalloonPct: 0.4, maxTermMonths: 72 },
  },
  mortgage: {
    fixedMaxAPR: undefined as number | undefined, // if set, overrides repo-linked cap
  },

  // Monthly service-fee cap (incl. VAT)
  serviceFeeMax: 69.0,

  // Initiation fee examples — replace with NCR schedule for production
  initiationFee: {
    unsecured: { base: 165, pct: 0.10, max: 1050 },
    vehicle:   { base: 0,   pct: 0.00, max: 0    },
    mortgage:  { base: 0,   pct: 0.00, max: 0    },
  },

  // Repo inputs for mortgage cap
  repoDefaultPct: 8.25,
  mortgageMarginPct: 12.0,
  mortgageMaxHardCap: 24.0,
};

/** Mortgage cap APR (decimal) from repo or fixed cap. */
export function mortgageCapAPRDecimal(repoPct?: number): number {
  const repo = (repoPct ?? caps.repoDefaultPct) / 100;
  if (typeof caps.mortgage.fixedMaxAPR === "number") return caps.mortgage.fixedMaxAPR;
  const margin = (caps.mortgageMarginPct ?? 12) / 100;
  const candidate = repo + margin;
  const hard = (caps.mortgageMaxHardCap ?? 24) / 100;
  return Math.min(candidate, hard);
}
