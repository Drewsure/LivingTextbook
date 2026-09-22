# Phaser Candidate Evidence Adjudication Standard

Status: Active foundation standard

The evidence return packet is not itself a decision. The adjudication layer
records who acts next and which state the evidence is in:

- `awaiting-external-return`: the outside builder still owes the evidence-only
  packet.
- `returned-awaiting-codex-review`: the packet is complete enough to enter
  manual review, but no wrapper proposal or integration approval exists.
- `blocked`: packet validation or identity evidence prevents review.

The adjudication owner is respectively the external builder, Codex, or the
platform owner resolving the blocker. This ownership state must remain
separate from approval state.

Every state keeps wrapper execution, integration approval, route writes,
source import, scoring, persistence, promotion, QR activation, and student
assignment disabled. A future wrapper proposal must be a separately reviewed
work order and must not be inferred from this state machine.

Verification:

- `node scripts/verify-phaser-candidate-evidence-adjudication.mjs`
- `npm run verify:foundation-composition`

