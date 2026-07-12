# DR-163: Launch Context Session Settings

## Decision

Pass teacher session settings through direct launch and front-door contexts, and gate assist-language display from those settings.

## Rationale

White-label classroom behavior must be consistent regardless of whether a student arrives through a teacher launch route, textbook QR route, or front-door code. Support language cannot be a loose package field that appears without session approval.

## Accepted Direction

- Add a shared sample teacher-session settings resolver.
- Use it in teacher monitor, direct launch, and front-door contexts.
- Keep MiniStar Japanese assist hidden by default unless a scaffold or future persisted setting enables it.
- Keep English target-language engagement as the progression trigger.

## Follow-Up

Replace sample settings with persisted launch-session settings before live classroom pilots.
