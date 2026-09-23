# Session Cookie Shape Checks

Foundation-ready signed sessions must:

- reject cookie values larger than the approved 8 KiB bound;
- require exactly one payload and one signature segment;
- validate bounded string types for tenant, package, launch, and session IDs;
- preserve HMAC, time-window, tenant, and authorization checks; and
- reject malformed cookies without exposing records or changing state.

Static coverage lives in the persistence and teacher-operations verifiers.
Run `npm run verify:persistence-runtime` and the full foundation gate after
changing signed session parsing.
