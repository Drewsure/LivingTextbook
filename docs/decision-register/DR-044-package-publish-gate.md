# DR-044: Package Publish Gate

Date: 2026-07-09

## Status

Accepted

## Decision

Add a package publish gate to the teacher/admin intake scaffold. The gate aggregates release-blocking readiness for content, media, games, QR, reports, policy, deployment, and persistence before a tenant package can be treated as pilot-publishable.

## Rationale

The platform is becoming credible enough that a demo could be mistaken for a sellable or pilot-ready package. That is a product risk. A white-label publisher package needs a clear release-control surface that says what is ready, what needs review, what blocks release, and who owns the next action.

## White-Label Impact

Positive. The gate applies to MiniStar and to future publisher/school tenants. It supports yearly textbook maintenance because media, games, QR aliases, package versions, and report policy can be reviewed together instead of being scattered across one-off screens.

## Cost Impact

Positive. The first gate is a data-driven admin scaffold, not a new backend workflow. It reduces future rework by naming release blockers before expensive production storage, local installers, media migrations, or premium AI features are introduced.

## Constraints

- Demo-ready is not pilot-publishable.
- No package can be marked pilot-publishable while a release-blocking item is blocked or still needs review.
- Media rights, report policy, and persistence must stay visible blockers until accepted.
- Optional premium features such as AI Tutor and speech scoring remain tenant-gated and cost-visible.
- The gate must not hard-code MiniStar assumptions.

## Verification

Use `docs/verification/PACKAGE_PUBLISH_GATE_CHECKS.md` after pulling connector-side commits.
