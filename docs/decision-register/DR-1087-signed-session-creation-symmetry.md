# DR-1087: Signed Session Creation Symmetry

Decision: Shared student and teacher session creators must enforce the same
claim shape, time-order, and encoded-size rules as their readers.

Rationale: TypeScript types do not protect runtime callers. A shared creator
must reject malformed claims before signing them.

Scope: Current student and teacher signed-session creators and future session
cookie creators.

Verification: Cookie-shape verifiers check creator guards, reader guards,
timestamp ordering, and size bounds; the full foundation gate remains required.
