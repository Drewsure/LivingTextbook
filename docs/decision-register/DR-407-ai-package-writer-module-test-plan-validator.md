# DR-407: AI Package Writer Module Test Plan Validator

Date: 2026-08-11

## Decision

AI-generated package writer module test plans now use a shared content-model validator before future writer test harness work can be considered.

## Rationale

The module test plan names the suites, fixtures, assertions, and evidence needed before package writer tests can exist. Without a shared guard, a planning panel could drift into implied test execution or app-file mutation. The validator keeps the plan review-only, structurally complete, and blocked.

## Rules Preserved

- Module test plan status stays blocked in the foundation.
- Required suites cover content package, route registry, media playlist, local companion, assignment shell, and release rollback guard modules.
- Required evidence includes reviewed JSON fixture replay, tap-to-speak audio coverage, rollback drill replay, and support-language boundary proof.
- Automated writer test execution, Playwright writer mutation runs, app file patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only test passes remain blocked.
- Support-language boundaries remain explicit and cannot count as target-language test evidence.

## Consequences

The generator pages show `Module test plan guard active`, `Module test plan guard blocks`, and `Module test plan guard warnings`. `verify:ai-generator` fails if the shared module test-plan validator or visible guard labels disappear.
