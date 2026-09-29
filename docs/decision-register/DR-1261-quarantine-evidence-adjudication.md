# DR-1261: Quarantine Evidence Adjudication

Date: 2026-09-29
Status: Accepted

The publisher pilot now has an explicit metadata-only evidence review record
for each quarantined source or media asset. It records scan status, rights
basis, source review, target mapping, accessibility, reviewer identity, notes,
and release recommendation. The record is tenant-bound, immutable, idempotent
for identical resubmission, and gated by
`LIVING_TEXTBOOOK_EVIDENCE_REVIEWS_ENABLED=true`.

The live evidence preview, package handoff, package review packet, and
readiness binding consume the validated sidecar. A complete record can make
admission evidence-ready, but assembly, promotion, QR printing, hosted
persistence, and student use remain separately blocked. This preserves the
closed-local fallback and prevents review metadata from becoming an activation
capability. See ADR 1261.
