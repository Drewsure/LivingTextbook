# DR-888: Persistence Operations Evidence Ledger

Closed-pilot backup, restore, and retention deletion now have server-side
metadata receipts. The receipts use a one-way scope digest and preserve
checksum, timing, schema, retention, and deletion-count evidence without
storing raw student-session identifiers or learner payloads. The teacher
surface is read-only. See ADR 0816.
