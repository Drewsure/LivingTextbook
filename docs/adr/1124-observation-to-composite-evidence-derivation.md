# ADR 1124: Observation-to-Composite Evidence Derivation

## Decision

Derive the composite browser/privacy/tenant evidence packet from the exact
browser observation when a teacher records it locally. Advance only the
browser lane when its required route-continuity and student-to-teacher-handoff
checks are present.

## Boundaries

Privacy-negative and tenant-isolation lanes remain pending until their own
specific checks are captured. Derivation does not infer privacy or isolation
from a successful browser journey and does not enable hosted writes, learner
data collection, export, promotion, or classroom launch.

## Verification

- `npm run verify-browser-privacy-tenant-evidence-packet`
- `npm run verify-browser-privacy-tenant-evidence-packet-derivation`
- `npm run typecheck --workspace @living-textbook/web`
- Full foundation verification before publication.
