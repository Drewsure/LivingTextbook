# ADR 1279: Hosted Manifest Fail-Closed Boundary

## Status

Accepted for foundation hardening.

## Decision

`createPilotDeliveryManifest` must add the hosted persistence packet requirement
before calculating readiness. Hosted and hybrid manifests without a
package-scoped packet identifier are blocked. Closed-local manifests remain
packet-free and can become ready when their own gates pass.

## Why

The manifest is the last shared decision object before delivery review. If its
readiness calculation runs before a mode-specific requirement is added, the
object can report `ready-for-manual-release` while still lacking the identity
needed to explain hosted persistence. That would make the teacher-facing
review surface more permissive than the delivery contract.

## Boundaries

The packet identifier is only an identity requirement. It does not approve a
provider, record opt-in, store credentials, create learner records, enable
hosted writes, or activate student routes. Those decisions remain separate
gates.

## Verification

`scripts/verify-pilot-delivery-manifest-behavior.mjs` verifies the missing
packet, closed-local, and hosted-ready cases. The foundation composition runs
the same behavior check with Node's TypeScript stripping support.
