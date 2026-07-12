# DR-177: Teacher Private Library Route

## Decision

Add a teacher-facing private library route for the sample publisher tenant.

## Rationale

A private tenant library is the lowest-risk way to support resource reuse while avoiding public-community moderation, copyright, privacy, and quality-control obligations in v1.

## Implications

- `/teacher/library/sample-publisher` is an active scaffold route.
- The route shows teacher private drafts, tenant-approved packages, planned school sharing, and public community blocking.
- Library records must preserve source lineage and must not copy student data, report exports, recordings, or identities.
- Public community sharing remains blocked.

## Next

Connect library records to authentication, teacher ownership, copy/edit lineage, package versioning, and persistence after those gates are accepted.
