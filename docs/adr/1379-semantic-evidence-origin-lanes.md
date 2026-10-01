# ADR 1379: Enforce Semantic Evidence Origins by Lane

## Status

Accepted for the review-only pilot foundation.

## Decision

Package evidence validation will enforce lane-specific custody origins. The
game lane is `platform-derived`; content, audio, video, image, font,
accessibility, and rights lanes are `publisher-asset`.

## Why

Origin labels are useful only when their meaning is constrained. Without this
rule, a tampered or mistaken record could make a publisher upload look like a
canonical game record, or make platform-derived audio appear to be licensed
publisher media.

## Boundary

This is a validation and release-lineage rule. It does not make evidence
complete, authorize package assembly, promote assets, print QR codes, activate
persistence, or open student use.

## Verification

The package-evidence behavior verifier covers valid origins, unsafe origins,
publisher-owned game evidence, and platform-derived audio evidence.
