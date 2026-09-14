# DR-850: Teacher Session Provider Boundaries

Teacher session reporting must consume roster and curated offer data from the
launch-context provider. Reusable teacher cards and monitors must not resolve
sample fixtures by launch code or package id. This preserves white-label
tenant substitution and keeps preview-only missing-plan behavior explicit.
See ADR 0773.
