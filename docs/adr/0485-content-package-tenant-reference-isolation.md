# ADR 0485: Content Package Tenant and Reference Isolation

Status: Accepted

## Decision

`validateContentPackage` is the review-time boundary for white-label package isolation. It must reject duplicate units and identifiers, cross-tenant package records, orphan media/audio references, cross-unit playlist media, and multimedia bindings from another unit.

## Boundaries

- Validation is pure and does not write storage, upload files, publish packages, mutate routes, or launch learners.
- Package metadata, unit payloads, media assets, audio cues, audio plans, playlists, multimedia plans, and assist-language plans remain tenant- and unit-consistent.
- Existing MiniStar and sample-publisher fixtures must pass unchanged.

## Verification

Protect the contract with `npm run verify:package-readiness`, typecheck, production build, and foundation verification.
