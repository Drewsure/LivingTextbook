# Persistence Read Query Checks

Foundation-ready persistence reads must:

- use `readBoundedQueryParam` for tenant-scoped identity values;
- use `readBoundedQueryLimit` for operation-history lists;
- return `400` for oversized or invalid query values before auth/storage work;
- preserve student continuity and teacher review authorization; and
- return no learner, tenant, path, or report data on rejected queries.

Static coverage lives in `scripts/verify-persistence-read-authorization.mjs`.
Run `npm run verify:persistence-runtime` and the full foundation gate after
changing persistence GET routes.
