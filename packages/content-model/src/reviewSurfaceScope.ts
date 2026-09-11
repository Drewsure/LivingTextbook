export const REVIEW_SURFACE_SCOPE_KINDS = ["platform", "tenant"] as const;

export type ReviewSurfaceScopeKind = (typeof REVIEW_SURFACE_SCOPE_KINDS)[number];

export function validateReviewSurfaceScope(value: unknown): string[] {
  if (typeof value !== "string" || !REVIEW_SURFACE_SCOPE_KINDS.includes(value as ReviewSurfaceScopeKind)) {
    return ["Review surface scope must be platform or tenant."];
  }
  return [];
}
