# 0247 Reviewer Identity And Signature Storage Contract

Status: accepted
Date: 2026-07-16

## Context

The reviewer identity and signature gate is visible on the teacher evidence route, but a visible gate is not enough for a white-label platform. Hosted and local deployments need a backend-neutral record contract before any signed approval capture, approve button, signature attachment, signed PDF packet, evidence download, or approval-based assignment can exist.

## Decision

Add `reviewer_identity_signature_gate` as a backend-neutral durable record category.

The record preserves reviewer identity requirements, approval intent requirements, signature policy requirements, audit retention requirements, revocation policy, and release-control binding. Hosted and local adapter plans must both include write intents that preserve this gate while blocking approval capture, signature attachment upload, and approval-driven assignment.

## Consequences

- Future backend work can implement hosted or local approval policy without inventing a new shape.
- Approval remains optional and policy-gated per white-label tenant.
- Approval cannot bypass missing rights, scan, audio, accessibility, storage, launch, or release-control evidence.
- No live authentication, signing, approval capture, storage write, PDF generation, or assignment workflow is enabled by this slice.
