# Production-Shaped Vertical Slice Checks

Run the focused check with:

```text
npm run verify:vertical-slice
```

It confirms that:

- the shared helper binds package and student-session identity;
- recommended flashcard routes use the handoff callback;
- completed canonical game routes use the same handoff boundary;
- source and destination routes are recorded;
- Sentence Builder receives the package identity required by its destination
  gate;
- direct navigation remains blocked by the playable route shell.

This is a route-contract check. It does not authorize hosted learner-data
persistence, source import, Phaser promotion, package activation, or student
assignment.
