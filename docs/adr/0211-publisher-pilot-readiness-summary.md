# ADR 0211: Publisher Pilot Readiness Summary

Date: 2026-07-14

## Status

Accepted

## Context

The foundation now has several release-control panels. They are useful for engineering and policy review, but a publisher or school owner needs a fast non-technical answer: what is demo-ready, what blocks pilot use, and what evidence is still missing.

## Decision

Add a `Publisher pilot readiness summary` to `/teacher/intake`.

The summary must be derived from `samplePackagePublishGate`. It may group information into demo-ready evidence, pilot blockers, missing evidence, and still-forbidden promises, but it must not become a second source of truth or a publish action.

## Consequences

- Partner conversations become clearer without weakening release control.
- Future agents can extend publish gate data and get the summary for free.
- The phrase `No publish action` remains visible so a controlled demo cannot be mistaken for real pilot approval.
