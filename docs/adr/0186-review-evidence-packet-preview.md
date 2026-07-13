# ADR 0186: Review Evidence Packet Preview

Date: 2026-07-13

## Status

Accepted

## Context

Reviewer decisions require evidence, but the current foundation has no authenticated reviewer identity, evidence storage, file upload, or approval signature workflow.

## Decision

Add a review evidence packet preview to `/teacher/review`.

The preview lists required evidence while keeping upload, signature capture, approval, publish, and student assignment blocked.

## Consequences

The review workflow becomes easier to explain to partners and future engineers without overclaiming that evidence capture or approval storage is live.
