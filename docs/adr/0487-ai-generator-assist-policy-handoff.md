# ADR 0487: AI Generator Assist-Policy Handoff

Status: Accepted

## Decision

Carry `assistLanguageScriptPolicy` and `assistLanguageLevelBand` from AI game-generator request previews into draft-generation evidence. The generator must preserve the package language contract instead of representing assist language only as free-form descriptive text.

## Rationale

- A generator request is an early point where language policy can be lost or weakened.
- Structured fields make the MiniStar hiragana-only rule visible to teachers and verifiers.
- White-label tenants can remain tenant-defined while retaining the same review boundary.
- Generated output remains draft-only and cannot publish, assign, or unlock progression.

## Guardrails

- The fields are review metadata, not a live model-call permission or translation service.
- Target-language progress remains the only progression trigger.
- The generator remains no-live-model-call and no-direct-publish in the foundation build.
- `npm run verify:ai-generator`, package readiness, typecheck, build, and route verification protect the handoff.

This decision is recorded in `docs/DECISION_REGISTER.md` DR-558.
