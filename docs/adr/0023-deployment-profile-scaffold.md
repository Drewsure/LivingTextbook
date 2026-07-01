# ADR 0023: Deployment Profile Scaffold

Date: 2026-07-01  
Status: Accepted

## Context

Living Textbook must be a saleable white-label platform, not only a MiniStar classroom app. A potential textbook partner may need a closed or local companion application with permanent textbook QR codes, multimedia packages, games, and teacher-visible progress reports. At the same time, the fastest credible pilot is usually a hosted PWA because it reduces installer, update, deep-link, and offline sync risk.

## Decision

Add a deployment profile scaffold to the teacher/admin intake area. The scaffold models three deployment paths from the start:

1. Hosted PWA pilot
2. Local classroom server
3. Packaged local app

The hosted PWA path is marked as the recommended first pilot. Local classroom and packaged local app paths remain first-class requirements, but they are marked as later because they require additional decisions around local routing, media bundles, updates, sync, access control, and QR/deep-link behavior.

## Consequences

- White-label demos can explain the practical deployment strategy without pretending all delivery paths are equally ready.
- The colleague/publisher use case stays inside the core product strategy instead of becoming a later bolt-on.
- Local/closed deployments must still define content package manifests, media rights handling, installer/update strategy, and teacher report export/sync before production.
- The route contract for `/teacher/intake` now includes `TenantDeploymentProfile[]`.

## Guardrails

- Do not present local/packaged deployment as production-ready until persistence, offline media packaging, sync/export, and update strategy exist.
- Do not make hosted PWA assumptions that prevent local/closed deployments later.
- Do not assign raw PDFs, AI drafts, or unreviewed extracted content directly to students.
- Do not activate paid AI Tutor or speech recognition features as default deployment requirements.
