# ADR 1427: Explicit Publisher Language And Delivery Choices

## Decision

Make the publisher intake kit accept explicit target-language, delivery-mode,
and hosted-persistence choices. Preserve English and hybrid as reference-pilot
defaults, but do not hard-code them as white-label platform requirements.

## Rationale

A saleable white-label pilot must support publishers whose textbook teaches a
language other than English and whose delivery requirement is closed-local,
hosted PWA, or hybrid. Hosted persistence is a separate policy decision because
it creates storage, retention, backup, cost, and privacy obligations.

## Safety boundary

Language ids and delivery modes are bounded and validated. The hosted opt-in
flag is explicit and rejected for closed-local delivery. These options change
the review brief only; package assembly, QR printing, promotion, persistence
activation, and student-facing use remain disabled.

## Verification

`node scripts/create-publisher-pilot-intake-kit.mjs --self-test`

`node scripts/verify-publisher-pilot-intake-kit.mjs`
