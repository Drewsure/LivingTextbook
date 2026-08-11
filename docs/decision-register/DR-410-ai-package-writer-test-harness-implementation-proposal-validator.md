# DR-410: AI Package Writer Test Harness Implementation Proposal Validator

Date: 2026-08-11

## Decision

AI-generated package writer test harness implementation proposals now use a shared content-model validator before any future harness implementation review can be considered.

## Rationale

The platform is close to an executable package writer path, so the foundation must keep implementation proposals scoped, visible, and blocked. A shared validator prevents teacher generator pages, sample data, route checks, and future storage adapters from drifting into implicit approval of harness code, automated writer tests, writer mutation browser runs, route writes, playlist writes, local bundle packaging, assignment activation, or support-language-only pass conditions.

## Rules Preserved

- Test harness implementation proposal status stays `blocked`.
- Scope must cover fixture replay, route smoke, media policy, local companion, assignment shell, rollback guard, support-language boundary, and evidence report work.
- Review gates must cover Codex implementation decision, harness plan storage, rollback, route, media, assignment, and school policy acceptance.
- Blocked actions include harness implementation, automated writer tests, writer mutation browser runs, evidence upload, signed approval capture, app file patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only harness passes.

## Consequences

Teacher generator routes now surface `Harness implementation proposal guard active`, `Harness implementation proposal guard blocks`, and `Harness implementation proposal guard warnings`. `verify:ai-generator` fails if the shared validator, sample guard exports, or visible guard labels are removed.
