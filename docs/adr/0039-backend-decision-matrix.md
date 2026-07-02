# ADR-0039: Backend Decision Matrix Before Vendor Choice

Date: 2026-07-03

## Status

Accepted

## Context

The platform is moving from static demo data toward a real white-label pilot. The first real backend decision affects cost, teacher reporting, route permanence, content-package review, local/closed deployment, and future AI Tutor boundaries.

## Decision

Introduce a backend decision matrix and keep the first recommendation vendor-neutral. The recommended first pattern is hosted managed database plus rights-managed media storage, with local/closed deployment compatibility preserved through exportable package records and future local bundle manifests.

## Consequences

- A hosted relational-style database pattern is the current first-pilot recommendation.
- Firebase/document-style storage remains a candidate but needs report/export discipline.
- Local SQLite-style deployment remains important but deferred unless closed deployment is mandatory.
- Hybrid hosted registry plus local media bundle remains likely long-term publisher fit.
- No raw audio, transcripts, ungated report exports, or AI Tutor transcript storage enters the core pilot storage plan.

## Verification

Use `docs/verification/BACKEND_DECISION_MATRIX_CHECKS.md` after pulling the connector-side changes locally.
