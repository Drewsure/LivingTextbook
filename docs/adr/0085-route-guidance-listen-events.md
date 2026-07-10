# ADR 0085: Route Guidance Listen Events

## Status

Accepted

## Context

Recommended route cards now include separate listen and open controls. Listening should be visible in the local event stream so teacher reports can distinguish guidance support from actual game progress.

## Decision

Add `route_guidance_listened` to the shared progress event type and emit it when a student taps a recommended-route listen control. The event records mode, route status, route href, and explicit non-unlock metadata.

## Consequences

Teacher reports can count route guidance listens. The student progress summary can show route listens separately from English item engagement. The event adds no Star Dust, unlock, or mastery behavior.

