# DR-805: Canonical Game Event Payload Hardening

Treat canonical game event evidence as untrusted JSON. Non-array inputs and
null or malformed event entries must fail closed with actionable validation
errors rather than throwing. Valid event ordering, identity, audio, replay,
scoring, mastery, completion, and support-language boundaries remain enforced.
This does not authorize live progression, persistence, reporting, or student
assignment. See ADR 0731.
