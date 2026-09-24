# DR-1183: Assist-Language Audio Reviewer Gate Binding

Decision: bind reconciled assist-language audio evidence to the existing
reviewer identity/signature gate shape while preserving tenant isolation.

The binding exposes reviewer lanes, gate status, unresolved requirements, and
scope drift. It explicitly represents tenants without a configured gate and
does not borrow another tenant's identity state. Approval capture, ledger
writes, signature upload, release mutation, catalog admission, media
activation, assignment, and progression remain blocked.

Verification: `npm run verify:assist-language-audio-catalog-reviewer-gate-binding`.
