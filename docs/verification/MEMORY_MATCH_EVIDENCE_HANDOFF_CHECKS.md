# Memory Match Evidence Handoff Checks

The focused verifier is:

```text
node scripts/verify-memory-match-evidence-handoff.mjs
```

The check must confirm:

- the packet is marked `ready-for-human-handoff` and `integration-blocked`;
- frozen repository, snapshot, and commit provenance are present;
- all nine required return artifacts are named;
- the acceptance checks cover fixture, events, audio, scoring, mobile/accessibility,
  wrapper ownership, checksum, and limitations;
- blocked actions include source import, route replacement, scene-owned state,
  package activation, reward mutation, and assignment;
- the teacher panel is review-only and has no live dispatch control;
- the packet and panel do not take ownership of runtime state or introduce the
  frozen Phaser scene into the canonical route.

This is an evidence-readiness check, not an integration approval. After Z.ai
returns the package, Codex must review the artifacts, rerun the focused and
full foundation checks, and record a new decision before promotion is
considered.
