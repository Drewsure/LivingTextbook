# ADR 0773: Teacher Session Provider Boundaries

## Status

Accepted

## Context

Teacher reporting and roster identity are part of the same white-label
classroom flow as student launch. A reusable teacher card must not infer a
sample roster from a launch code, and the teacher monitor must not resolve a
sample game offer map independently of the launch provider.

## Decision

The launch-context provider supplies the optional class roster plan and the
curated unit offer map. Teacher session routes pass the roster plan into the
roster identity card, and the teacher monitor consumes the offer map already
resolved by that context. Reusable teacher features remain data consumers;
sample resolvers are responsible for translating demo fixtures.

## Consequences

Hosted, local, and partner providers can supply tenant-specific roster and
pathway records without changing teacher components. Missing plans remain
explicit preview states rather than silently creating production identities.

## Verification

Run `npm run typecheck --workspace @living-textbook/web`,
`npm run verify:foundation-composition`, and `npm run verify:routes`.
