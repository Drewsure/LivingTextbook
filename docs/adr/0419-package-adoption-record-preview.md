# ADR 0419: Package Adoption Record Preview

Status: Accepted

## Context

Package adoption readiness explains approvals and blockers, but future implementation also needs a durable record shape. Without a preview of minimum accepted-record fields, premium toggles could be designed before school policy, budget, retention, rollback, and release-control evidence are structurally understood.

## Decision

Add future package adoption record previews to `/teacher/entitlements`. The previews show minimum fields, required evidence, acceptance scopes, blocked writes, and rollback hooks for premium AI authoring, premium Voice Tutor, and enterprise storage/local companion adoption.

## Consequences

- Premium package activation remains blocked until accepted adoption records exist.
- AI generation, Voice Tutor, speech scoring, storage, report export, and local companion activation all have named minimum record fields before implementation.
- The preview is not an acceptance workflow and stores no accepted terms.
- The entitlement verifier now checks adoption record previews.
