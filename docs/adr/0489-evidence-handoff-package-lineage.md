# ADR-0489: Evidence Handoff Package Lineage

Status: Accepted

## Decision

Add a dedicated unit-package readiness section to the review-only evidence handoff packet. The section carries payload validation, target-language audio coverage, assist-language script policy, and curated activity pathway evidence back to `/teacher/intake`.

## Why

The handoff packet must preserve the evidence chain behind a reviewed unit without becoming a live export, storage, publishing, or assignment workflow. The language and activity constraints are part of the package's safety evidence, not optional notes.

## Guardrails

- Handoff remains preview-only.
- No export, signing, attachment storage, publishing, route creation, playlist creation, or assignment activation is introduced.
- Target-language audio remains the learning requirement.
- Assist-language evidence remains support-only and never unlocks progress, mastery, scoring, rewards, or games.
- Package snapshots, authenticated reviewer identity, signed teacher release, retention policy, and storage remain explicit missing-before-export items.

## Verification

`npm run verify:package-readiness`, typecheck, production build, and active route verification must remain green.
