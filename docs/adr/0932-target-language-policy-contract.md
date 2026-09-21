# ADR 0932: Explicit Target-Language Policy Contract

## Decision

The shared content model now carries an optional `targetLanguagePolicy` beside
tenant language settings. The policy makes the progression role, script policy,
segmentation policy, target-language audio requirement, and support-language
progress boundary explicit.

The first reference fixture is `sampleJapaneseTenant`. It proves that a
white-label Japanese school can configure Japanese as the learner target and
English as support without treating MiniStar's Japanese assist configuration as
Japanese curriculum readiness.

## Constraints

- The target language alone may drive mastery and progression.
- Target-language audio is required for learner-facing target content.
- Japanese target content must use Japanese-aware or tenant-defined
  segmentation; English whitespace splitting is not accepted.
- Japanese script policy must be hiragana-first, reviewed mixed script, or
  tenant-defined.
- The Japanese target-language pilot remains blocked by the existing furigana,
  curriculum-review, audio, and segmentation gates.
- This contract does not enable storage writes, route activation, AI calls,
  speech scoring, or student assignment.

## Evidence

- `packages/content-model/src/targetLanguagePolicy.ts`
- `apps/web/src/features/tenant/sampleJapaneseTenant.ts`
- `scripts/verify-target-language-policy.mjs`
- `docs/TARGET_LANGUAGE_EXPANSION_CONTRACT.md`
