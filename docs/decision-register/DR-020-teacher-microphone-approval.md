# DR-020: Teacher Microphone Approval

Status: Accepted

Decision: Microphone practice must be teacher/school controlled. Local record/replay may be part of the core speaking practice package, but the teacher zone must control whether it is available for a launch. AI transcription, pronunciation scoring, and speech matching remain separate premium capabilities with usage-cost implications.

White-label impact: Strongly positive. Schools and publishers can choose microphone policy according to age, privacy expectations, device access, classroom environment, and package tier.

Cost impact: Positive. Local record/replay has no API cost. AI speech scoring and transcription may create API usage costs and must remain premium, tenant-gated, and teacher/school approved.

Privacy impact: Positive. The core mode keeps raw audio in the browser tab and does not upload, persist, transcribe, or score it.

Component boundary: Positive. Microphone policy enters through tenant settings and teacher approval, while Speak It only renders record/replay controls when approval is active.

Constraints:

- No microphone permission prompt on page load.
- No microphone controls when teacher approval is off.
- No recording-based progress completion.
- No raw audio upload or storage in the core package.
- No transcript or pronunciation score in the core package.
- AI speech matching requires premium entitlement, school/teacher approval, and explicit usage-cost controls.
