# ADR 1413: Provide A Create-Once Human Evidence Packet Generator

## Status

Accepted for the first-pilot operator experience.

## Context

The human evidence contract requires two identity-bound JSON records outside
the repository. Hand-writing them invites missing fields and accidental
overwrites, while generating a completed approval would be unsafe.

## Decision

Add `create:pilot-human-evidence` to create incomplete, create-once policy and
release templates with the requested tenant, package, and unit identities. The
validator remains the only path that can classify the packet as structurally
proved, and the templates never enable any protected action.

## Consequences

Human operators get a repeatable starting point with fewer schema errors. The
generated packet remains draft evidence until a real reviewer completes it;
no release, QR print, persistence, or student behavior is changed.
