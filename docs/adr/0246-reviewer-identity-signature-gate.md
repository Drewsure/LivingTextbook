# 0246 Reviewer Identity And Signature Gate

Status: accepted
Date: 2026-07-16

## Context

Evidence packet assembly now shows whether upload, Labelled Diagram, media, and release-control evidence can move toward a release. The next risk is implying that a reviewer can approve the packet before authenticated identity, signature policy, approval intent, audit retention, and revocation rules exist.

## Decision

Add a reviewer identity and signature gate to `/teacher/evidence/sample-publisher`.

The gate keeps reviewer identity, approval intent, signature policy, audit retention, and minimum approval record fields visible while signed approval capture remains blocked.

## Consequences

- Approval becomes a policy-gated foundation concept, not a loose button.
- White-label tenants can choose whether approval capture is part of their package later.
- Typed signatures, external signature attachments, signed PDF packets, audit writes, evidence downloads, release-state mutation, and student assignments from approval remain blocked.
- Future local deployments must name backup and restore ownership before accepting signatures.
