# DR-436: AI Prototype Signed Approval Preflight Validator

## Status

Accepted.

## Context

The Codex patch approval decision preview separates evidence review from approval. The next link in that chain is signed approval preflight, which names future identity, scope, evidence, and approval record requirements without capturing a signature.

## Decision

Add a shared `validateAiPrototypeSignedApprovalPreflight` guard in the content model and require the teacher generator route to show its active guard, guard blocks, and guard warnings.

The guard keeps signed approval capture blocked until reviewer identity lanes, scope locks, approval record draft fields, evidence checklist, cannot-approve blockers, next required records, and support-language boundaries are present.

## Consequences

- The UI may preview what a future signed approval record requires.
- No signature is captured.
- No approve button, patch authorization, app file write, generated patch, test execution, Playwright run, route mutation, scoring or reward mutation, audio manifest mutation, package promotion, assignment, or support-language progress trigger is enabled.
- MiniStar Foundation Japanese support remains hiragana-only and support-only while English remains the progress trigger.
