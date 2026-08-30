# DR-530: Unit Game Offer Reporting Requirements

Status: Accepted

Decision: Every unit game offer must declare a `reportingRequirement` and the teacher-facing offer-map panel must display it before game availability is treated as reviewed.

Reasoning:

- Teacher reporting is part of the core product promise, not a later cosmetic add-on.
- White-label tenants need to know what every activity contributes to reports before they offer it year after year.
- Speech and media-heavy games need explicit privacy limits before they become student-facing.

Rules:

- Target-language game events may contribute to mastery and progress.
- Support-language text/audio/listens remain report-only.
- Media-only and background-media-only events never trigger mastery.
- Speak It and future Voice Tutor offers must block raw audio and transcript storage unless an adult-approved premium policy explicitly allows a reviewed alternative.

Verification:

- `npm run verify:package-readiness`
- `npm run verify:routes`
- `npm run verify:review-keys`
