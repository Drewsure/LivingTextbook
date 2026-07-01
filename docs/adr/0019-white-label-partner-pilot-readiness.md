# ADR 0019: White-Label Partner Pilot Readiness Surface

Status: Accepted

Date: 2026-07-01

## Context

The platform needs to support MiniStar as the flagship tenant and also become saleable as a white-label Living Textbook product for other curriculum owners. A colleague has asked whether the platform can support games and multimedia for an external textbook series. That requires a practical pilot promise without overstating commercial readiness.

## Decision

Add a white-label pilot readiness surface to the foundation dashboard and maintain a partner pilot timeline document.

The product promise is:

- internal proof-of-concept: now to 2 weeks,
- partner-facing pilot: roughly 8-12 weeks with tight scope,
- commercial product candidate: after pilot feedback, likely 4-6 months for persistence, admin, import, packaging, and broader verification.

## Consequences

Positive:

- Partner conversations now have a disciplined timeframe.
- The dashboard shows what is ready, in progress, or decision-blocked.
- MiniStar remains useful without pretending the platform is MiniStar-only.
- The team can avoid promising all games, AI Tutor, full offline packaging, or automated import before foundations are built.

Tradeoffs:

- The readiness panel is currently sample/static data.
- Real readiness still depends on a second tenant config, partner content package, persistence, and deployment choices.

## Verification

- `/` shows the white-label pilot readiness panel.
- The panel includes the 8-12 week pilot window.
- The panel distinguishes ready, in-progress, and needs-decision items.
- `docs/PARTNER_PILOT_TIMELINE.md` records the partner-facing language and first pilot scope.
