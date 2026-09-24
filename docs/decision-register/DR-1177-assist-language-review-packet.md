# DR-1177: Assist-Language Review Packet

## Decision

Use a review-only assist-language packet at teacher intake before any future
student-visible approval or durable launch setting.

## Required boundaries

- Target-language activity remains the only progression and mastery trigger.
- Foundation, Bronze, and Plus Japanese support remains hiragana-only.
- Assist text and audio are reviewed evidence, not live translation.
- No approval, assignment, export, QR activation, package promotion, or hosted
  write is enabled by this slice.

## Reason

The foundation already validates these rules, but reviewers need one concise
packet showing the evidence and the missing pieces. Visibility now prevents
future UI work from implying that a reviewed translation is automatically a
production release.

## Verification

`npm run verify:assist-language-review-readiness`

## Related

- ADR 1177
- `docs/ASSIST_LANGUAGE_STANDARD.md`
- `docs/ASSIST_LANGUAGE_VERIFICATION.md`
