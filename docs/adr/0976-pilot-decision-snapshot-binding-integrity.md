# ADR 0976: Pilot Decision Snapshot Binding Integrity

Status: Accepted

## Context

The pilot review decision is the source record for provider-neutral snapshot
rehearsal. If the source validator accepts duplicate or malformed evidence
bindings, snapshot validation can preserve an incomplete decision packet.

## Decision

The canonical pilot review decision validator rejects blank, non-string, and
duplicate evidence bindings. Snapshot validation delegates to that validator,
so the same rule applies before a decision is accepted for rehearsal storage.

## Consequences

- Source decisions and release-readiness records cannot disagree about binding
  integrity.
- Provider-neutral snapshot rehearsal receives stronger evidence.
- No durable write, pilot launch, report export, promotion, or student access is
  enabled by this validation.

## Verification

The pilot review decision snapshot runtime test covers duplicate and blank
binding rejection.
