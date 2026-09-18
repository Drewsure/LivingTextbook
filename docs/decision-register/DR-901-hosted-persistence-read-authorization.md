# DR-901: Hosted Persistence Read Authorization

Every hosted progression read now declares an explicit access purpose. Learner
continuity reads require the matching signed student session or server-only
persistence token. Teacher review probes require the expiring teacher session
for the requested tenant.

Missing, unknown, or mismatched access purpose fails closed before either the
process-memory rehearsal store or the durable provider is queried. Unauthorized
responses do not reveal whether a record exists.

This does not enable durable writes, classroom launch, report export, or any
other live workflow.
