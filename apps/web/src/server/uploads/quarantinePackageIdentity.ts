/**
 * Derive the candidate package identity shared by every review-only upload
 * route. A later explicit package id may override this value, but the default
 * must remain deterministic for the same tenant and unit key.
 */
export function deriveQuarantinePackageId(tenantId: string, unitKey?: string): string {
  const identity = (unitKey || `${tenantId}:unassigned`).replace(/[^A-Za-z0-9._:-]+/g, "-").slice(0, 120);
  return `${identity}-package`;
}
