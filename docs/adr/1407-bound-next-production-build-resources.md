# ADR 1407: Bound Next Production Build Resources

## Status

Accepted for the web foundation.

## Context

The pilot must be buildable on a developer workstation and on modest
white-label tenant infrastructure. The current machine has accumulated stale
Node processes, and an unbounded Next build can amplify that pressure.

## Decision

Set `experimental.cpus` to `2` and enable
`experimental.memoryBasedWorkersCount` in `apps/web/next.config.ts`.

## Consequences

Clean machines should use fewer, more predictable build workers with lower
peak resource pressure. Builds may take longer on high-end machines, which is
an acceptable trade for reliable, cost-conscious deployment. The setting does
not substitute for a successful production build or authorize broad process
termination.
