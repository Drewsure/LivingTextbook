# ADR 0437: AI Draft Repair Evidence Packet

Status: Accepted

## Context

AI-generated draft payloads already pass through a shared validator and a correction queue. The queue lists schema, audio, progress, verifier, release-lock, and general repair items, but it does not yet show the evidence packet needed before verifier submission.

## Decision

Add an evidence-only AI draft repair evidence packet to tenant generator routes.

The packet links the draft preview and correction queue to schema validation, target-language audio, media-rights, and verifier-submission evidence. It keeps target-language progress as the only progress trigger and keeps support-language and media-only progress blocked.

## Consequences

- Reviewers see what must be proven before verifier submission.
- Auto-fix and live regeneration remain blocked.
- Media, audio, and support-language policies stay visible before package work.
- MiniStar Foundation Japanese support remains hiragana-only and support-only.

## Non-Goals

This does not create auto-fix, live AI regeneration, verifier submission, package assembly, route writes, playlist writes, assignment, student-ready markers, or support-language progress.
