# Persistence Readiness Route Checks

Use this route check before backend selection, upload storage, learner progress storage, report export, local companion activation, or package writer persistence work.

Route:

```text
http://127.0.0.1:3000/teacher/persistence
```

Expected visible boundaries:

- `Persistence readiness workbench`
- `Backend and local storage without vendor lock-in`
- `No backend vendor selection`
- `No live storage writes`
- `Hosted/local parity`
- `No raw microphone audio`
- `no transcript storage in the core tier`
- Existing backend decision, schema, migration, boundary, and adapter-readiness panels remain visible.

This route is review-only. It does not choose Supabase, Firebase, local SQLite, object storage, or any other vendor.

