# ADR 1280: Release Receipt Manifest Validation

## Status

Accepted for foundation hardening.

## Decision

The release receipt factory validates the complete delivery manifest before it
can report `manual-release-approved`. Approval also requires the manifest's
status and delivery permission to agree with the approved state.

## Why

Receipt fields include reviewer, rollback, release, and QR decisions, but those
fields cannot repair an invalid or contradictory delivery manifest. Binding the
factory to the manifest validator prevents an unsafe caller from manufacturing
an approved receipt from mismatched flags.

## Boundaries

This is a metadata integrity check. It does not write a receipt, assemble a
package, print QR codes, select hosted persistence, or activate students.

## Verification

`scripts/verify-pilot-delivery-manifest-behavior.mjs` covers valid closed-local
and hosted manifests plus a forged contradictory manifest. Foundation
composition, typecheck, and production build remain required.
