# Teacher Report Package Boundary Checks

Run after teacher session monitor, report export, event taxonomy, persistence, or policy changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1` loads.
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1` loads.
- Both pages show `Report package boundary`.
- Learning evidence events are counted separately from support-only events.
- Support-only signals include media, background audio, support language, and route guidance without implying progression credit.
- Excluded sensitive fields name raw learner audio, transcripts, open-ended AI Tutor chat, unreviewed notes, and private identifiers.
- Required export gates include accepted policy, persisted events, access control, retention, and report format approval.
- Live export is not shown as ready while policy and persistence are blocked.
