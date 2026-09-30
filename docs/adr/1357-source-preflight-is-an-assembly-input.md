# ADR 1357: Source Preflight Is an Assembly Input

## Status

Accepted

## Context

The publisher delivery assembly preview enumerated the manifest, release,
QR, package-index, bundle, review-packet, and operator inputs. The durable
source preflight sidecar was already required by upstream review and release
lineage, but it was not named in the assembly request preview itself.

## Decision

Treat the matching publisher source preflight evidence as an explicit eighth
assembly input. The readiness route marks it present only when tenant,
quarantine, package, and source checksum identity all match. The assembly
preflight also reports the missing sidecar as a blocker.

The preview remains blocked and read-only. This is an evidence-contract change,
not a writer invocation or a package activation change.

## Consequences

- Operators see the complete source-to-package chain before a local writer can
  be considered.
- A stale packet or delivery manifest cannot conceal missing source inventory
  reconciliation.
- The pilot handoff now names eight writer inputs instead of treating source
  provenance as an implied upstream condition.

## Protected boundaries

The preview cannot copy files, generate QR output, activate hosted persistence,
create learner records, or start students. All release and writer gates remain
explicit and independently controlled.

## Verification

- `npm run verify:publisher-delivery-assembly-request-preview`
- `npm run typecheck --workspace @living-textbook/web`
