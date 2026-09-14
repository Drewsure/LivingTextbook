# DR-809: Progress Envelope Factory Boundary

Require progress-event envelope creation to fail closed for unsupported event
types and known event types missing from the supplied taxonomy. The factory
must not silently assign a fallback `report-only` effect, because that would
create misleading evidence before stream validation. This protects browser,
Phaser, import, teacher-report, and progression adapters without authorizing
live persistence, report export, progression, or assignment. See ADR 0735.
