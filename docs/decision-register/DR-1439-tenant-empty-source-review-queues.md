# DR-1439: Tenant-Empty Source Review Queues

Generic white-label source-review workspaces now receive an explicit empty
tenant queue and no sample extraction packets or previews. MiniStar and the
sample publisher remain the only reference tenants allowed to display the
maintained fixtures. The route-level gate prevents sample data from becoming a
white-label default and keeps source intake review-only.

See ADR 1439 and `apps/web/src/data/sampleSourceReviewQueue.ts`.
