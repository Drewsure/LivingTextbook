# ADR 0159: Teacher Assist Language Toggle

## Status

Accepted

## Context

MiniStar English can include reviewed Japanese assist language, but support language should be teacher-controlled. It must never replace target-language listening or unlock progress.

## Decision

Add a local teacher control for assist-language visibility and make the student launch flow respect it.

## Consequences

- `/teacher` shows a support-language visibility control.
- MiniStar assist language is off by default because the tenant setting says `studentAssistEnabledByDefault: false`.
- A teacher can enable reviewed assist language for the current browser preview.
- Student flashcards show assist text only when enabled.
- Target-language English remains the only entry-practice and unlock trigger.
- This is local-state scaffold behavior; future launch sessions need durable teacher settings.
