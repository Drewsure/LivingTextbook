# DR-1086: Signed Session Cookie Shape Hardening

Decision: Bound, canonicalize, and structurally validate signed student and
teacher session cookies before any claim is used.

Rationale: Signature validity alone does not bound parser work or guarantee
that decoded identity fields have the expected shape.

Scope: Current signed session cookies and all future session-bearing cookies.

Verification: Persistence read authorization and teacher operations verifiers
cover the cookie bounds, exact segmentation, bounded claim strings, and time
checks; full foundation verification remains required.
