# ADR 0717: Active Phaser Candidate Order Resolution

- Status: Accepted
- Date: 2026-09-14

## Context

The frozen Z.ai inventory contained an older Balloon Pop-first sentence, while
the later wrapper decision, controlled integration history, and human handoff
brief selected Memory Match first. Leaving both statements active would make
the next external request ambiguous.

## Decision

The active review order is Memory Match first, Balloon Pop second, Label It
third, and a gated voice candidate after those reviews. Memory Match proves the
smallest bounded pairing wrapper. Balloon Pop follows for motion, timing, and
miss semantics. Label It follows for reviewed image-asset mapping. Voice
surfaces remain gated by microphone, privacy, cost, and fallback policy.

This order does not approve import, route replacement, scoring ownership,
persistence, package promotion, or student assignment.

## Consequences

- Z.ai receives one unambiguous evidence request at a time.
- The frozen source remains preserved and review-only.
- Historical inventory records remain useful without competing with the active
  decision.
- A later pilot or evidence result may reopen the order through a new decision
  record.

## Verification

Run `npm run verify:phaser-scene-inventory`,
`npm run verify:canonical-games`, and `npm run verify:foundation` after
changing candidate order or wrapper gates.
