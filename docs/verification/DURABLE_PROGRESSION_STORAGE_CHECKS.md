# Durable Progression Storage Checks

These checks prove the first real persistence slice without using learner
records. Use a temporary SQLite path and a throwaway coded identity.

## Required evidence

- `npm run verify:durable-persistence` passes.
- `npm run verify:persistence-provider-conformance` passes.
- `npm run verify:progress-event-persistence` passes.
- SQLite mode starts only with `LIVING_TEXTBOOK_PERSISTENCE_PROVIDER=sqlite`.
- A durable write requires the explicit write gate, school/tenant policy,
  retention-policy acceptance, release approval, and a server-only bearer token.
- The first write returns `accepted` and `idempotent: false`.
- Repeating the same continuity id returns `accepted` and `idempotent: true`.
- Reading the same identity after a server restart returns `available` with
  `provider: sqlite` and `durability: durable-managed`.
- A read without the server token returns `401` when a record exists.
- A different tenant identity cannot read the record.
- SQLite files and WAL sidecars are ignored by source control, including nested
  data-custody directories.
- Durable SQLite readiness requires `LIVING_TEXTBOOK_PERSISTENCE_DATA_ROOT` and
  keeps `LIVING_TEXTBOOK_PROGRESSION_DB_PATH` below that root as a nested
  `.sqlite` file.
- The configured data root must exist, and existing database filesystem paths
  must not resolve through a symlink or junction outside that root.
- Durable readiness also requires the explicit encryption-at-rest policy gate;
  the flag is not itself proof that encryption has been implemented.
- Durable readiness also requires the explicit secret-rotation policy gate;
  the flag is not itself proof that rotation has been automated.

## Production gates still open

- authenticated teacher/student session exchange;
- encryption-at-rest and secret rotation;
- backup, restore, deletion, retention, and incident recovery evidence;
- multi-instance hosted deployment behavior;
- hosted cloud provider operations decision;
- end-to-end student event submission through the authenticated server boundary.

This checklist proves the durable adapter boundary; it does not authorize
anonymous browser writes or claim that the hosted cloud pilot is ready.

The mandatory `npm run verify:persistence-runtime` gate executes the provider
conformance and event-stream checks as well as the request-boundary checks.
