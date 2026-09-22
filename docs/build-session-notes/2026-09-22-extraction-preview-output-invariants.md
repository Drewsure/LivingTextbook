# Extraction-Preview Output Invariants

Date: 2026-09-22

The structured extraction preview now has a second validation boundary after
creation. It checks deterministic normalized text, segment identity,
candidate-unit coverage, summary counts, page ranges, and review-only blocked
actions before package or readiness evidence can consume the preview.

No extraction acceptance, storage write, promotion, route, assignment, or
student activation is enabled.
