# ADR 0778: Persistence And Pilot Policy Public Boundary

## Status

Accepted

## Decision

Persistence record categories, durable-record readiness contracts, and
pilot-policy requirements are owned by the neutral content-model package and
consumed through its public package root. Internal module paths remain
implementation details.

## Why

The platform must support replaceable white-label storage and policy
providers. Shared contract ownership lets web, AI-service, local, and future
deployment adapters use the same vocabulary without coupling to a particular
file layout or sample tenant.

## Non-goals

This does not create database connections or live writes, enable assignment,
remove policy or privacy review, or promote frozen external game source.

## Verification

- Web typecheck passes with root imports.
- Persistence and pilot-policy runtime checks remain green.
- The active foundation suite remains the release gate.
