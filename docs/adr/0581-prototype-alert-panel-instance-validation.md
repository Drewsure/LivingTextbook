# ADR 0581: Prototype Alert Panel Instance Validation

Status: Accepted

## Decision

The reusable prototype-intake alert panel must validate the alert instance it receives. When a readiness signal is available, it must also validate the alert against that signal. It must not read validation state from a MiniStar-specific sample as a global shortcut.

## Context

The platform is white-label. A panel used by a tenant-specific prototype review route cannot safely display MiniStar’s validation result for another tenant or future package. Shared presentation must remain coupled to the data instance and its readiness source.

## Consequences

- Tenant-specific prototype review cannot inherit a false “valid” state from the flagship sample.
- The global game-readiness page and tenant prototype page use the same contract path.
- The panel remains review-only; validation does not authorize import, route creation, or student use.

## Verification

Prototype-review verification, web typecheck, runtime behavior, full foundation verification, production build, and active route checks remain required.
