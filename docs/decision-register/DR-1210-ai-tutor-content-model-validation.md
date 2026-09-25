# DR-1210: AI Tutor Content-Model Validation

The shared content model now fail-closes malformed optional AI Tutor
entitlements and unit plans. It validates bounded identities, package tiers,
tutor modes, source scopes, unique arrays, integer limits, and optional flags
without enabling any live AI, speech, billing, persistence, or student-facing
behavior.

References: ADR 1210 and the 2026-09-25 AI Tutor content-model validation
build session.
