# DR-411: AI Package Writer Harness Implementation Decision Validator

Date: 2026-08-11

## Decision

AI-generated package writer harness implementation decision previews now use a shared content-model validator before any future decision capture, harness approval, or harness implementation work can be reviewed.

## Rationale

The word `decision` is a high-risk surface. A visible option such as `Approve dry-run harness scope only` must never become implied permission to create harness code, run writer tests, mutate routes, write playlists, package local bundles, activate assignments, or accept support-language-only implementation decisions. The shared guard keeps sample data, UI, route verification, and future persistence adapters aligned.

## Rules Preserved

- Decision status stays `blocked`.
- Decision state stays `No decision recorded`.
- Required evidence must include the implementation proposal, route and playlist guards, local companion checks, assignment shell checks, rollback guard, and backend storage readiness.
- File scope rules must remain dry-run only and cannot approve package writer implementation, package JSON, routes, playlists, mutation browser tests, release-control bypasses, signed approval bypasses, or school-policy bypasses.
- Decision options must include return for more evidence, reject harness scope, and approve dry-run harness scope only.
- Blocked actions include harness approval, harness code, automated writer tests, writer mutation browser runs, evidence upload, signed approval capture, app patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only implementation decisions.

## Consequences

Teacher generator routes now surface `Harness decision guard active`, `Harness decision guard blocks`, and `Harness decision guard warnings`. `verify:ai-generator` fails if the shared validator, sample guard exports, or visible guard labels are removed.
