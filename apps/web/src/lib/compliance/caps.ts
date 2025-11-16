/**
 * caps.ts
 * Keep all product interest caps here (annual nominal). Update when NCR publishes new tables.
 * NOTE: Values below are placeholders. Replace with current official caps.
 */
export const caps = {
  unsecured: { maxAPR: 0.2775 },   // Personal Loan (Unsecured)
  vehicle:   { maxAPR: 0.2775 },   // Vehicle Finance
  mortgage:  { maxAPR: 0.2775 },   // Home Loan
  revolving: { maxAPR: 0.2775 },   // Credit Card / Revolving
} as const;

export type ProductKey = keyof typeof caps;

export function clampRateToCap(apr: number, product: ProductKey) {
  const cap = caps[product].maxAPR;
  return Math.min(Math.max(apr, 0), cap);
}