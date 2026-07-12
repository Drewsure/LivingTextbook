# ADR 0169: Private Assignment Link Route

Date: 2026-07-12

## Status

Accepted

## Context

Competitive products emphasize sharing and assignments. Living Textbook needs that teacher convenience, but public activity pages, community sharing, and iframe embeds create privacy, rights, moderation, and tenant-isolation risk.

## Decision

Add `/assign/[assignmentId]` as an active private assignment-link scaffold.

The route is student-facing and focused: it summarizes one reviewed assignment, shows the correct target launch/front-door path, lists curated audio-covered modes, and states private-first sharing boundaries. It does not expose teacher/admin controls, public sharing, public community discovery, or iframe embed behavior.

## Consequences

The platform now has a practical first share path while keeping v1 safe for young learners and white-label tenants. Public links and embeds remain blocked until the gates in the share/embed contract are accepted.
