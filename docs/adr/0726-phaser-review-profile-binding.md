# ADR 0726: Phaser Review Profile Binding

## Status

Accepted

## Decision

The shared `PhaserCandidateContractReview` validator must resolve a review's
`gameMode` against the approved Phaser candidate profile manifest. When both
fields are present, the review is valid only when the profile exists and its
`parentEngine` matches the review's `parentEngine`.

## Consequences

The content model, teacher review surface, sample records, and external review
verifier cannot silently disagree about a candidate's engine identity. Unknown
candidate modes and mode/engine mismatches fail before evidence alignment can
be trusted. This remains a review-only guard and does not import source,
activate routes, mutate scoring or persistence, promote packages, or assign
students.
