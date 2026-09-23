# ADR 1123: Browser, Privacy, and Tenant Evidence Packet

## Decision

Represent the first browser rehearsal gate as one provider-neutral,
review-only packet containing three mandatory lanes: browser continuity,
privacy-negative checks, and tenant-isolation negative checks.

## Boundaries

The packet is exact-scope evidence for one tenant, package, launch, unit, and
student session. Pending lanes are not verified evidence. The packet cannot
write hosted persistence, collect learner data, export evidence, promote a
release, or launch a classroom.

## Verification

- `npm run verify:browser-privacy-tenant-evidence-packet`
- `npm run typecheck --workspace @living-textbook/web`
- Full foundation verification before publication.
