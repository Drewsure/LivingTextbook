# DR-557: Assist-Language Script Policy

Status: Accepted

Decision: Add `scriptPolicy` and optional `levelBand` fields to assist-language plans, and enforce Japanese student-facing script rules in the shared content-package validator.

Rationale:

- Foundation, Bronze, and Plus Japanese support must remain hiragana-only.
- Silver and later Japanese support may use kanji and katakana only under an explicit reviewed policy.
- Package validation is the reliable enforcement point for generated, imported, and future uploaded content.
- The rule remains white-label aware: non-Japanese tenants may use their own policy, and Japanese-as-target-language remains a separate product lane.

Guardrails:

- Student-visible Japanese plans without a script policy are invalid.
- Hiragana-only plans reject katakana and kanji in vocabulary, sentence, and instruction glosses.
- Mixed-script plans cannot be draft or rejected when offered to students.
- Support language remains comprehension support and never becomes a progression trigger.
- This is review-time validation only; no upload, translation, persistence, or package activation is introduced.

Evidence:

- `packages/content-model/src/index.ts`
- `apps/web/src/data/sampleMultimediaPackage.ts`
- `docs/ASSIST_LANGUAGE_STANDARD.md`
- `docs/ASSIST_LANGUAGE_VERIFICATION.md`
- `docs/adr/0486-assist-language-script-policy.md`
