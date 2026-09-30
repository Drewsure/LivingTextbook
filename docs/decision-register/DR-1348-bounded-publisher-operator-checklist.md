# DR-1348: Bounded Publisher Operator Checklist

## Decision

Derive one shared operator checklist from the verified local package runtime.
It binds release, approved asset custody, QR print, route, game, integrity,
privacy, and hosted-persistence evidence to the exact white-label package.

## Boundaries

The checklist guides review, printing, and teacher rehearsal only. Export,
learner records, QR mutation, hosted activation, and student launch remain
blocked.

## Evidence

- `packages/content-model/src/localPilotPackageOperatorChecklist.ts`
- `apps/web/src/server/delivery/localPilotPackageRuntimeReader.ts`
- `apps/web/src/features/deployment/LocalPilotPackageRuntimePanel.tsx`
- ADR 1349
