# Class Roster Readiness Verifier Checks

Run when learner identity, roster slots, front-door codes, teacher reports, microphone practice, AI Tutor speech records, backend schema, local deployment, or report export claims change.

```powershell
npm run verify:class-roster
```

Expected result:

- The verifier passes three roster plans: MiniStar demo, sample publisher front door, and closed local classroom.
- Roster plans include teacher-issued-code, progress-summary, display-name, raw-audio, and transcript boundaries.
- Sample roster slots use coded learner slots only.
- Sample roster slots do not store real names, family contact, raw audio, or transcripts.
- Front-door copy explains learner codes are reporting slots, not production accounts.
- Teacher session routes keep a visible roster identity card.
- Backend schema and migration specs preserve coded learner identity while excluding raw learner audio and transcripts.

Regression guard:

Do not make a roster pilot-ready unless policy, persistence, report export, retention, and data-removal rules have been accepted. Microphone practice, speech matching, and AI Tutor features must not silently add raw recordings or transcripts to the core roster.
