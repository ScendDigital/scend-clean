/**
 * fees.ts
 * Centralise fee caps & calculation helpers. Update these values from NCR fee schedules.
 * All amounts are ZAR. VAT handling is explicit.
 */

// Placeholders — replace with current caps.
export const feeCaps = {
  serviceMonthlyMaxInclVAT: 69.00,  // e.g. monthly service fee cap (incl. VAT) – UPDATE
  vatRate: 0.15,                    // VAT (confirm current rate)
};

// Initiation fee policy for unsecured loans (config-driven; update when NCR changes)
export const unsecuredInitiationPolicy = {
  // Option A: Flat + percentage, with an absolute max (typical NCR structure).
  // Replace these with current NCR values:
  flatBase: 165.00,         // R… base
  percent: 0.10,            // …% of the amount (portion defined by NCR)
  absoluteMax: 1050.00,     // Upper limit cap (incl. VAT if NCR specifies so)
  vatIncluded: true,        // true if the caps published are VAT-inclusive
};

/** Compute service fee actually charged (never above cap). */
export function serviceFeeMonthly(actualRequested: number): number {
  return Math.min(
    Math.max(actualRequested, 0),
    feeCaps.serviceMonthlyMaxInclVAT
  );
}

/**
 * Compute the maximum allowed initiation fee for an unsecured loan.
 * This uses a simple base + percent structure with an overall cap.
 * If your products require stepped/tiered formulas, extend this function accordingly.
 */
export function unsecuredInitiationCap(amount: number): number {
  const { flatBase, percent, absoluteMax } = unsecuredInitiationPolicy;
  const fee = flatBase + (percent * Math.max(amount - 1000, 0)); // example policy: over R1,000 portion
  return Math.min(Math.max(fee, 0), absoluteMax);
}

/** Clamp a requested initiation fee to the allowed maximum. */
export function clampUnsecuredInitiation(requested: number, amount: number): number {
  return Math.min(Math.max(requested, 0), unsecuredInitiationCap(amount));
}