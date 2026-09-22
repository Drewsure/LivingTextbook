# ADR 0956: Phaser Candidate Evidence Return Packet

Status: Accepted

## Context

The project can now issue a precise, human-triggered Memory Match request to
Z.ai. A return manifest alone does not prove that each required contract was
returned or reviewed. The next boundary must make missing evidence visible
without importing external files.

## Decision

Add a provider-neutral evidence return packet with one receipt per canonical
Phaser eligibility lane. The packet has an explicit `awaiting-return` state,
requires all receipts to remain missing in that state, and requires all lanes
to cite reviewed artifacts before a returned packet can be labelled
`received-review-only`.

Keep import, route replacement, student assignment, and all game authority
flags disabled in every state.

## Consequences

- The UI can show an honest next action before Z.ai returns anything.
- Returned packages can be reviewed for completeness before deeper analysis.
- The architecture remains independent of Z.ai, Phaser, storage vendors, and
  any future game builder.
- A real returned package still needs human-provided files and Codex review.

## Verification

- `node scripts/verify-phaser-candidate-evidence-return.mjs`
- `npm run verify:foundation-composition`

