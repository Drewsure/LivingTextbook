# ADR 0879: Persistence Operator-State Clarity

## Status

Accepted for foundation hardening.

## Context

The hosted progression client now preserves the difference between a blocked
deployment policy, unauthorized review, a missing coded record, provider
unavailability, and an invalid response. The teacher workbench must not erase
that distinction when presenting the result.

## Decision

Expose each adapter state with its own status label and explanatory message.
“No record” is reserved for a valid, authorized lookup that found no record;
policy blocks, provider outages, and malformed responses remain operational
states with actionable meaning.

## Consequences

Teachers and support staff can diagnose pilot configuration without confusing a
deployment problem with learner absence. This adds no learner-data access and no
write capability.
