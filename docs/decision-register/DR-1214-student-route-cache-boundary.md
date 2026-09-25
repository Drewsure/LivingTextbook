# DR-1214: Student Route Cache Boundary

Offline-ready local bundle cache policies now reject `/api`, `/admin`, and
`/teacher` route prefixes. Student routes must be explicitly allowlisted, while
service-worker registration, cache mutation, offline learner data, and local
activation remain blocked. See ADR 1214.
