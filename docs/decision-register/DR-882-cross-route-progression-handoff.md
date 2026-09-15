# DR-882: Cross-route progression handoff

**Decision:** Student routes use a validated, tenant-scoped continuity envelope stored in session-scoped browser storage during rehearsal. The destination path must match exactly; progression is never encoded into the URL.

**Reason:** This proves real route transitions without allowing stale, cross-tenant, support-language, or media-only state to unlock games.

**Guardrail:** Direct activity routes remain locked without an accepted handoff. The handoff contains a progression snapshot and cursor, not raw audio or transcripts.

**Follow-up:** Replace the browser rehearsal store with an approved hosted provider only after persistence, identity, retention, and school-policy gates pass.
