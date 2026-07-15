# ADR 0240: Evidence Packet Handoff Preview Route

## Status

Accepted.

## Context

The platform now has evidence packet flows and a tenant evidence packet review index. The next risk is that future export, approval, or partner handoff work could be added before the packet shape, recipient responsibilities, and blocked live actions are clear.

## Decision

Add `/teacher/evidence/sample-publisher/handoff` as a review-only evidence packet handoff preview route. It shows upload intake, Labelled Diagram, and media evidence sections; names recipient duties for publisher, school, and platform roles; and keeps export, signature, publish, promotion, route creation, playlist creation, and assignment blocked.

## Consequences

- Partner-facing evidence discussions can happen from a concrete route without enabling live evidence workflows.
- The handoff preview gives future storage/export work a stable packet shape.
- Active route and upload-channel verification now guard the route.
- This route does not export files, capture signatures, approve, publish, promote uploads, create routes, create playlists, or assign students.
