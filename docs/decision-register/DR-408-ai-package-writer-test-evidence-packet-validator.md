# DR-408: AI Package Writer Test Evidence Packet Validator

Date: 2026-08-11

## Decision

AI-generated package writer test evidence packets now use a shared content-model validator before future writer test harness work can be considered.

## Rationale

The test evidence packet is where fixture proof, route proof, audio/media proof, local/assignment proof, rollback proof, and support-language proof come together. It must remain evidence planning only. A shared guard prevents evidence review from becoming evidence upload, signed approval capture, test execution, app-file mutation, route mutation, or assignment activation.

## Rules Preserved

- Test evidence packet status stays blocked in the foundation.
- Required evidence lanes cover fixture, route/QR, audio/media, local/assignment, and rollback/support-language proof.
- Required evidence includes reviewed JSON fixture replay, tap-to-speak audio coverage, rollback drill replay, and support-language boundary proof.
- Automated writer tests, writer mutation browser runs, evidence upload or signed approval capture, app file patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only evidence passes remain blocked.
- Missing evidence stays visible until future storage, school policy, and Codex test harness decisions exist.

## Consequences

The generator pages show `Test evidence guard active`, `Test evidence guard blocks`, and `Test evidence guard warnings`. `verify:ai-generator` fails if the shared test evidence packet validator or visible guard labels disappear.
