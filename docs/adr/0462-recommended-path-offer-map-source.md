# ADR 0462: Recommended Path Offer-Map Source

Status: Accepted

Date: 2026-08-31

## Context

The launch and flashcard recommended path card used the launch session's recommended mode list. That list remains useful, but teacher-reviewed unit game offer maps now carry richer readiness, availability, audio, reporting, and route rules.

## Decision

Recommended game path cards should prefer the reviewed unit game offer map when a content package id is available, then fall back to launch-session recommendations.

## Consequences

- Student launch and flashcard routes now show which reviewed map sourced the recommendations.
- Recommended paths exclude hidden, blocked, teacher-only, premium, and not-ready offers.
- Launch-session recommendations remain the fallback for packages without reviewed offer maps.
- Teacher-reviewed game availability remains aligned across launch, flashcards, activity hub, and completion cards.

## Still Blocked

- No route publishing.
- No premium or teacher-only auto-unlock.
- No support-language-only progress.
- No unrestricted switch-template behavior.
