# DR-1273: Source Decision Readiness Gate

**Status:** Accepted

**Decision:** Add a distinct source-review-decision check to live package
readiness with `open`, `blocked`, and `passed` states.

**Reason:** Preserve explicit gate order and prevent aggregate readiness from
inferring downstream package or release authorization.

**Boundary:** Readiness metadata only. No assembly, release, QR, persistence,
or student activation is enabled.
