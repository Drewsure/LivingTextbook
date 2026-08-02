# DR-353: AI Prototype Patch Harness Implementation Proposal Storage Contract

## Decision

Preserve AI prototype patch harness implementation proposals as durable backend-neutral records before any future harness implementation can be considered.

## Rationale

The implementation proposal is the bridge between a reviewed harness plan and future runnable harness work. It must be auditable for hosted and closed local deployments, but it must not itself create code, run tests, invoke Playwright, write app files, mutate routes, change scoring, update rewards, alter audio manifests, promote packages, assign students, or trigger support-language progress.

## Required Contract

- `ai_prototype_patch_harness_implementation_proposal` schema entity.
- `m079-ai-prototype-patch-harness-implementation-proposal-records` migration candidate.
- `spec-ai-prototype-patch-harness-implementation-proposal` migration spec.
- `ai-prototype-patch-harness-implementation-proposal-record` durable record.
- Hosted and local adapter write intents.
- Verifier coverage for schema, migrations, adapter plans, durable records, and route visibility.

## Blocked Actions

- Harness implementation.
- Test execution.
- Playwright run.
- App file write or app patch generation.
- Route registry write or student-facing route.
- Scoring, Star Dust, reward, or audio manifest mutation.
- Package promotion or assignment.
- Support-language progress trigger.
