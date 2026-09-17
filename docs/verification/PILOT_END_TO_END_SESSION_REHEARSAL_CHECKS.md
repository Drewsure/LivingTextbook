# Pilot End-to-End Session Rehearsal Checks

- The rehearsal fixture includes Front Door, Flashcards, Memory Match, Sentence
  Builder, audio support, and Teacher Report stages.
- The route set is tenant-neutral and includes the sample publisher front door,
  partner launch, Memory Match, Sentence Builder, and teacher session report.
- The dry-run surface is labeled teacher-only, evidence-only, and no-live-
  workflow.
- Front Door establishes a validated student session and gates the first
  progression write behind target-language Flashcard completion.
- Flashcards save a validated route handoff and append local session evidence.
- Memory Match and Sentence Builder require validated handoffs and append
  cumulative evidence through the shared game shell.
- Teacher reporting validates tenant, package, launch, and student-session
  identity before showing local activity detail.
- Hosted progression rehearsal writes are disabled by default.
- Durable persistence requires explicit write, school-policy, retention, and
  release gates, and server operations exclude raw learner audio and
  transcripts.
- Verification must remain deterministic and idempotent across route retries.

Run:

```powershell
npm run verify:pilot-rehearsal
npm run verify:canonical-games
```
