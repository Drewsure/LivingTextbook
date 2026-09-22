# Teacher Draft Persistence Preflight Checks

This check covers the admission boundary between a teacher-only draft preview and any future tenant-owned persistence provider.

## Required guarantees

- The preflight matches the exact tenant, draft, source package, unit, and source-draft import preview identities.
- Teacher ownership and private tenant visibility are explicit requirements, not inferred from a route.
- The contract remains provider-neutral and review-only.
- Draft writes, assignment, package promotion, raw source binary storage, learner audio storage, and transcript storage remain blocked.
- Required source, rights, audio, policy, retention, export, and rollback evidence is visible before a future provider-specific work order.

## Verification

Run `npm run verify:source-draft-import` for the static contract check. The web typecheck and foundation runtime harness also compile the shared contract.
