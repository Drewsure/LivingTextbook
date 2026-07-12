# ADR 0163: Launch Context Session Settings

## Status

Accepted

## Context

The direct launch route respected the teacher assist-language toggle, but the front-door QR/class-code route passed assist-language content directly from the package. That made the support-language rule inconsistent across student entry paths.

## Decision

Resolve sample teacher session settings with both direct launch and front-door contexts, then gate assist-language display from those settings.

## Consequences

- `/launch/[code]` receives teacher session settings.
- `/enter/[tenantId]` receives teacher session settings.
- Front-door students do not receive assist-language content unless the launch/session setting allows it.
- The teacher monitor, launch routes, and front-door routes share one sample settings helper.
- The session-settings verifier now checks that both context paths carry settings.
