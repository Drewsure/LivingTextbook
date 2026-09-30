# ADR 1349: Bounded Publisher Operator Checklist

## Status

Accepted

## Context

The local package runtime already verifies release, QR, asset custody, route,
game, and integrity records. A publisher needs a usable handoff surface, but
separate links and readiness labels invite inconsistent interpretation.

## Decision

Derive one shared `LocalPilotPackageOperatorChecklist` from the verified local
runtime records. It carries the exact tenant, package, version, release, and
source checksum identity and reports eight required checks: release lineage,
approved asset custody, QR print artifact, route/fallback map, game route map,
integrity ledger, privacy boundary, and hosted-persistence policy.

The checklist may guide an operator to review the receipt, print the approved
QR sheet, and rehearse teacher/student routes. It remains metadata-only and
cannot export raw payloads, create learner records, mutate QR aliases, activate
hosted persistence, or authorize student launch.

## Consequences

- Publisher handoff readiness has one canonical, white-label surface.
- The UI cannot drift from the runtime's verified package identities.
- The checklist is useful for the first pilot without prematurely adding an
  archive, installer, billing, or hosted activation workflow.

## Verification

The runtime-reader, local-package assembler, content-model boundary, foundation
composition, typecheck, and production-build checks must remain green.
