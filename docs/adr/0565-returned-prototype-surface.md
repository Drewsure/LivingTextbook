# ADR-0565: Returned Prototype Surface

Status: Accepted  
Date: 2026-09-11

## Decision

Require every returned prototype manifest to declare `dom-reference`, `phaser`,
or `hybrid`, and compare that value with the original intake queue and return
checklist.

## Why

Rendering surface changes the evidence required for accessibility, event
replay, audio presentation, touch performance, and wrapper design. It must be
known before a future Z.ai or Phaser package reaches integration review.

## Guardrails

- Unsupported values and cross-record drift block review.
- The field does not authorize direct routes, import, scoring changes, or
  student assignment.

## Verification

The manifest contract is
`packages/content-model/src/aiPrototypeReturnedPackageManifest.ts`.
Alignment is in
`packages/content-model/src/aiPrototypeReturnedPackageAlignment.ts`.
