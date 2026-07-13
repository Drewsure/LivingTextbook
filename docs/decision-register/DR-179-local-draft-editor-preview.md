# DR-179: Local Draft Editor Preview

## Decision

Add a local-only draft editor preview to the teacher draft package route.

## Rationale

The build needs visible teacher authoring affordances, but live authoring must not arrive before persistence, review, audio, rights, route, and approval gates.

## Implications

- The draft page can validate vocabulary and target sentence shape locally.
- Save draft, submit for review, student assignment, and audio regeneration remain blocked.
- Local edits are not persisted and do not alter reviewed package data.

## Next

Connect the editor to durable draft records only after authentication, ownership, verifier workflow, audio regeneration policy, and package approval workflow are accepted.
