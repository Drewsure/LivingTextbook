# ADR 0385: Target-Language Audio Approval Storage Contract

Date: 2026-08-11

Status: Accepted

## Context

The generator route now shows a target-language audio approval packet before any generated package can be treated as teacher-review complete.

That packet cannot remain UI-only. Future voice generation, uploaded audio approval, speech API usage, package audio-complete markers, route creation, playlist creation, assignment, and progress rules all need a backend-neutral record before workflow buttons exist.

## Decision

Add `target_language_audio_approval` / `target-language-audio-approval` to schema drafts, migration candidates, migration specs, durable records, adapter write intents, validators, and route verification.

The record must preserve cue-level review items, progress boundaries, audio cue manifests, package audio coverage, support-language audio rules, and blocked voice/API/package actions.

The contract blocks audio approval capture, generated voice calls, speech API billing, package audio-complete markers, route registry writes, media playlist writes, assignments, media-only mastery, and support-language progress triggers.

## Consequences

- Audio approval becomes auditable before it becomes actionable.
- Voice and speech API costs remain blocked until tenant/school policy allows them.
- MiniStar can keep English as the progress trigger while Japanese support stays hiragana-only and support-only for early levels.
- Raw learner audio and transcripts remain outside core storage.
- Hosted and local-first implementations can use the same product vocabulary.
