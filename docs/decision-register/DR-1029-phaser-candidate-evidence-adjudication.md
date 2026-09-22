# DR-1029: Phaser Candidate Evidence Adjudication

Decision: represent the external evidence handoff as an owner-bound state
machine separate from integration approval.

The current Memory Match sample remains `awaiting-external-return`; the next
owner is the external builder. A future complete packet moves to
`returned-awaiting-codex-review`, never directly to integration.

Evidence: `docs/PHASER_CANDIDATE_ADJUDICATION_STANDARD.md`,
`packages/content-model/src/phaserCandidateEvidenceAdjudication.ts`, and
`apps/web/src/data/samplePhaserCandidateEvidenceAdjudication.ts`.

