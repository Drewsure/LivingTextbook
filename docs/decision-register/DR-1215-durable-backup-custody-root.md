# DR-1215: Durable Backup Custody Root

Durable SQLite backup and restore now require an explicit
`LIVING_TEXTBOOK_PERSISTENCE_BACKUP_ROOT`; source and destination artifacts must
remain below that root. Missing, root-level, outside, and traversal paths fail
closed. Encryption, permissions, retention, external custody, and operation
activation remain separate deployment gates. See ADR 1215.
