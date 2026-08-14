# Build Session: AI Prototype Patch Authorization Release Lock Validator

## Summary

Added a shared validation guard for patch authorization release lock previews.

## Changes

- Added `packages/content-model/src/aiPrototypePatchAuthorizationReleaseLock.ts`.
- Exported the guard from the content model package.
- Wired sample patch authorization release locks to the shared validator.
- Added visible guard blocks and warnings to the teacher generator release-lock panel.
- Updated generator and active route verification to require the guard labels.
- Recorded the decision as DR-437.

## Boundaries

- No patch authorization is recorded.
- No release-control acceptance is captured.
- No app file write, patch generation, test execution, Playwright run, route mutation, scoring or reward mutation, audio manifest mutation, package promotion, assignment, or support-language progress trigger is enabled.
