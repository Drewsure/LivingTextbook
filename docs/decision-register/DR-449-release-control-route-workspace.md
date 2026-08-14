# DR-449: Release-Control Route Workspace

## Status

Accepted.

## Context

The release candidate, package publish gate, and approval ledger are central to partner pilot conversations, but they were embedded inside the long teacher intake page. That made release readiness harder to show without scrolling through unrelated foundation gates.

## Decision

Add `/teacher/release-control/sample-publisher` as a focused teacher/admin release-control workspace.

The route joins the pilot release candidate, publish gate, and approval ledger panels while explicitly blocking publish buttons, release-state mutation, assignment activation, local bundle release, student-ready markers, and support-language-only releases.

## Consequences

- Partner release-readiness conversations have a direct route.
- The route remains review-only and cannot launch or publish anything.
- Active route verification grows to 61 checked routes.
