# ADR 1211: One AI Tutor Plan Per Unit

**Status:** Accepted  
**Date:** 2026-09-25

## Context

Content packages may optionally carry AI Tutor plans. Audio, assist-language,
and multimedia plans already use one plan per unit so the package has one
unambiguous source of truth. Duplicate tutor plans could otherwise produce
conflicting level, mode, source, or audio rules.

## Decision

`validateContentPackage` rejects duplicate AI Tutor plans for the same unit.
The plan remains optional, and disabled baseline packages remain valid.

## Consequences

- A unit cannot receive conflicting tutor configuration from one package.
- Tenant and unit-level entitlement decisions remain deterministic.
- This does not activate AI Tutor or allow model calls, speech, billing,
  persistence, or student assignment.

## Verification

The content-model runtime harness includes a duplicate-plan rejection case and
the entitlement contract verifier checks the invariant marker.
