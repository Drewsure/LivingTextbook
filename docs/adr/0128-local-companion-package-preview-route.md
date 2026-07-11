# ADR 0128: Local Companion Package Preview Route

## Status

Accepted

## Context

Local bundle manifests and local deployment preflight were visible on `/teacher/intake`, but publisher conversations benefit from a focused route that shows the closed companion package shape.

## Decision

Add `/local/sample-publisher` as a read-only local companion package preview route.

## Consequences

- The closed/local deployment requirement becomes easier to explain to a textbook partner.
- The route remains clearly planning-only and not offline-ready.
- Active route verification expands to 27 checked routes.
