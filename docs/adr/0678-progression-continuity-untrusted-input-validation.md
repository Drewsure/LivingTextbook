# ADR 0678: Progression Continuity Untrusted Input Validation

## Decision

Treat progression continuity runtime requests as untrusted at the boundary.
Expected tenant, package, launch, and student-session identifiers must be
validated as non-blank strings before comparison. Malformed values return
validation errors and must never cause runtime exceptions or side effects.

## Rationale

The continuity contract is consumed by route and adapter boundaries where
inputs may originate outside the typed TypeScript call site. A type annotation
does not validate JSON, browser messages, or a future provider adapter. A
thrown `.trim()` error is less useful and less safe than a deterministic
rejection that can be displayed in the review and verification surfaces.

## Consequence

The review-only adapter remains side-effect-free for malformed requests, and a
regression fixture now proves that an undefined expected tenant is rejected as
validation evidence rather than crashing the runtime harness.
