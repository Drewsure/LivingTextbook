# ADR 1429: Align Human Delivery Evidence With Intake Modes

## Decision

The human evidence generator accepts the same publisher-facing delivery choices as intake. It normalizes `hosted-pwa` to the evidence contract's `hosted` value and carries the explicit hosted-persistence opt-in into both delivery policy and release authorization drafts.

## Rationale

The publisher should not need to understand two names for the same delivery path. Keeping the normalization at the external handoff boundary prevents false identity drift while preserving the existing validator contract.

## Safety boundary

Hosted persistence remains a separate explicit choice. Generator and validator reject hosted opt-in for closed-local delivery. Draft evidence remains outside the repository, incomplete until human approval, and incapable of upload, assembly, QR printing, persistence activation, or student use.

## Verification

`node scripts/create-pilot-human-evidence-packet.mjs --self-test`

`node scripts/verify-pilot-human-evidence.mjs --self-test`
