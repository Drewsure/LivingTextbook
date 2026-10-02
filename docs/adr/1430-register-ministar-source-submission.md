# ADR 1430: Register MiniStar Unit 1 Source Submission

## Decision

Use the existing MiniStar curriculum DOCX as the first real publisher-source
submission for the pilot, staged outside the repository in the review-only
intake kit. Record the declared MiniStar tenant, source owner, target language,
Japanese support language, and hybrid delivery preference without treating the
submission as package approval.

## Current evidence

The source document is present in the external intake folder and the intake
preflight has produced a checksum-bound report. The report remains incomplete
because the required target-language audio and the optional declared image,
video, transcript, font, and background-media lanes are not yet supplied.
Retention, reporting, rights, accessibility, scan, and QR placement decisions
remain human review items.

## Safety boundary

The source stays outside `LivingTextbook` until canonical source review passes.
An incomplete intake cannot produce a source manifest, package, QR print
artifact, persistence activation, or student-facing route. No missing media or
approval is inferred from the MiniStar ownership declaration.

## Verification

`node scripts/publisher-pilot-intake-preflight.mjs --root "<ministar-pilot-input>"`

`node scripts/audit-first-saleable-pilot.mjs --publisher-root "<ministar-pilot-input>" --json`
