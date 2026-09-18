# DR-943: Local Media Manifest Reconciliation

## Decision

Use a provider-neutral, tenant-scoped reconciliation record before any future
local package provider can evaluate media copying or activation.

## Required Invariants

- Manifest and binding identity must match across tenant, bundle, package, and
  package version.
- The media artifact must exist at a safe path and every asset must remain
  inside its declared media root.
- Evidence gaps produce `needs-evidence`; identity or path drift produces
  `mismatch`.
- The result remains review-only, has no side effect, and blocks media copy,
  package writes, activation, student promotion, and QR mutation.

## Evidence

The contract, sample workbench panel, and runtime verifier are recorded in the
ADR and source files named by this decision.
