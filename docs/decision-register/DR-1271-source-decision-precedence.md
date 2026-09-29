# DR-1271: Source Decision Precedence

**Status:** Accepted

**Decision:** Require `accepted-for-package-review` before capturing an
immutable package-review packet.

**Reason:** Prevent a blocked create-only packet from being captured before the
source review checkpoint and then becoming impossible to advance.

**Boundary:** Sequencing guard only. It does not authorize assembly, release,
QR printing, hosted persistence, or student-facing use.
