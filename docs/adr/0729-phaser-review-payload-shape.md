# ADR 0729: Phaser Review Payload Shape

## Status

Accepted

## Context

Phaser contract-review records arrive as JSON evidence from an external
builder. TypeScript interfaces describe expected records, but they do not
protect runtime callers from missing arrays, null entries, or incomplete nested
approval fields. A review validator that throws at this boundary weakens the
review-only workflow and obscures the evidence defect.

## Decision

Normalize expected collections to empty arrays for validation and explicitly
reject malformed entries with actionable errors. The validator must handle
missing or non-array `sourceFiles`, `findings`, `missingEvidence`, and
`blockedActions`, null collection entries, missing approval blockers, and
non-array review collections without throwing.

## Consequences

Partial or malformed external handoffs fail closed and remain review-only.
Review surfaces can display validation failures instead of crashing, while
valid candidate records retain their existing profile, path, checksum, replay,
and blocked-action requirements. This decision does not permit source import,
route activation, package promotion, or student assignment.

## Verification

Run `npm run verify:runtime-behavior`,
`npm run verify:phaser-candidate-reviews`, and
`npm run typecheck --workspace @living-textbook/web`.
