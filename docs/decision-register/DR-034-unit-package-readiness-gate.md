# DR-034: Unit Package Readiness Gate

Status: Accepted

Decision: Add a unit package readiness gate that computes launchability from content package data before a tenant unit is treated as classroom-ready.

White-label impact: Strongly positive. The same readiness logic can evaluate MiniStar units, sample publisher units, future PDF-derived textbook units, and closed local companion packages without hard-coding a tenant.

Cost impact: Positive. A computed readiness adapter catches missing audio, validation, route, media, release, and support-language issues while the build is still static and cheap to change.

Portability: Positive. The gate reads the shared content package model, release records, and validation functions. Future persistence or PDF import work can feed the same shape rather than creating a separate approval system.

Constraints:

- Reviewed content package data remains the source of truth for student-facing launch readiness.
- Audio-first learner support is a hard gate for pilot readiness.
- Support language remains comprehension support and never satisfies progression or unlock requirements.
- Placeholder media and media-rights review must remain visible until real assets and rights proof are provided.
- Teacher or tenant release approval remains distinct from package validation.

Verification:

- See `docs/verification/UNIT_PACKAGE_READINESS_CHECKS.md`.
