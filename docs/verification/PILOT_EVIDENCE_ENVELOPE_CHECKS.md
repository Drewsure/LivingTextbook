# Pilot Evidence Envelope Checks

- The teacher evidence panel derives one coherent session packet from the
  validated browser rehearsal record.
- The envelope is bound to tenant, package, launch, unit, student session, and
  target language.
- The workflow remains ordered: front door, Flashcards, Memory Match, Sentence
  Builder, and teacher report.
- Stage summaries are deterministic and report pending, observed, or complete
  without creating new progress mutations.
- A stable idempotency key identifies the same tenant-scoped rehearsal packet.
- Raw learner audio, learner transcripts, support-language progress, durable
  writes, and live classroom status remain excluded.
- The envelope remains a browser-rehearsal summary and cannot authorize
  unlocks, rewards, assignments, exports, or hosted storage.

Run:

```powershell
npm run verify:pilot-rehearsal
```
