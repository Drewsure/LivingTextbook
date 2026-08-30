# ADR 0460: Student Activity Hub Offer-Map Source

Status: Accepted

Date: 2026-08-31

## Context

The student activity hub originally carried a manually duplicated list of game routes. That worked for the first route scaffold, but it risked drifting away from the reviewed unit game offer map used by teacher/admin readiness surfaces.

## Decision

Student activity hubs should build game route cards from the reviewed unit game offer map when one exists. Support routes such as Training Academy, printable preview, media playlist, and the launch doorway remain explicit support paths.

## Consequences

- Student-visible game navigation inherits reviewed route, audio, reporting, readiness, and availability rules.
- MiniStar and partner tenants use the same pathway source pattern.
- Future game modes should enter the student hub through the unit game offer map, not by hand-editing one-off student navigation lists.
- Incomplete packages may still use the fallback route list until a reviewed offer map exists.

## Still Blocked

- No unrestricted switch-template panel.
- No support-language-only progress.
- No media-only mastery.
- No direct student route from an unreviewed offer.
