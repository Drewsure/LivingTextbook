# ADR 0461: Game Completion Offer-Map Next Path

Status: Accepted

Date: 2026-08-31

## Context

The shared game completion card suggested the next activity from the launch session's recommended mode list. That is a safe fallback, but the reviewed unit game offer map now carries richer availability and readiness rules.

## Decision

The shared game completion card should prefer the reviewed unit game offer map when choosing the next student activity, then fall back to launch-session recommendations when no offer map exists.

## Consequences

- Completion routing stays aligned with teacher-reviewed game availability.
- Hidden, blocked, premium, teacher-only, or not-ready offers are not suggested as the next student activity.
- Active game routes now show whether the next suggestion came from the reviewed offer map or the launch session fallback.

## Still Blocked

- No live scoring mutation.
- No route publishing from completion cards.
- No teacher-only or premium offer auto-unlock.
- No unrestricted switch-template behavior.
