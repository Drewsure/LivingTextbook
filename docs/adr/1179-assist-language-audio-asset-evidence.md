# ADR 1179: Assist-Language Audio Asset Evidence

## Status

Accepted for review-only foundation scaffolding; asset admission remains gated.

## Decision

Add a teacher-facing evidence packet that enumerates every reviewed
assist-language term, sentence, and instruction gloss. Each row reports the
cue binding, media-asset binding, status, and blockers. The packet reuses the
tenant/package/unit scope of the content package and remains provider-neutral.

## Rationale

Coverage alone can show that text is missing audio, but it does not show where
the future asset must bind. A row-level evidence packet gives teachers and
publishers a practical handoff list without creating an upload or approval
shortcut.

## Consequences

- Missing Japanese support audio is visible per term, sentence, and
  instruction.
- Future recorded, partner-provided, or approved TTS assets have a clear
  binding target.
- Rights, checksums, delivery references, accessibility evidence, and release
  approval remain separate gates.
- The packet cannot upload, download, promote, assign, bill speech services,
  or expose student-facing audio.

## Evidence

- `apps/web/src/data/sampleAssistLanguageAudioEvidence.ts`
- `apps/web/src/features/teacher/TeacherAssistLanguageAudioEvidencePanel.tsx`
- `scripts/verify-assist-language-audio-evidence.mjs`
