# DR-409: AI Package Writer Test Harness Plan Validator

Date: 2026-08-11

## Decision

AI-generated package writer test harness plans now use a shared content-model validator before future harness implementation work can be considered.

## Rationale

The harness plan names future dry-run phases and environment adapters. That planning is necessary, but it must not create runnable tests, mutation browser checks, app patches, route writes, playlist writes, local bundle packaging, or assignment workflows. A shared guard keeps the harness plan complete and blocked.

## Rules Preserved

- Harness plan status stays blocked in the foundation.
- Required phases cover fixture replay, route smoke, media policy, local/assignment, and rollback guard checks.
- Required adapters cover static fixture, browser smoke, and local dry-run checks.
- Test harness implementation, automated writer tests, writer mutation browser runs, evidence upload or signed approval capture, app file patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only harness passes remain blocked.
- Support-language boundaries remain explicit and cannot become harness pass evidence.

## Consequences

The generator pages show `Test harness plan guard active`, `Test harness plan guard blocks`, and `Test harness plan guard warnings`. `verify:ai-generator` fails if the shared test harness plan validator or visible guard labels disappear.
