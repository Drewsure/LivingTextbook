# DR-801: Phaser Review Source-Path Boundary

Require every source-file reference in a Phaser contract-review record to be a
unique repository-relative POSIX path. Absolute paths, Windows drive paths,
backslashes, and parent-directory traversal fail closed. This keeps evidence
portable and prevents review metadata from escaping the isolated candidate
boundary. The change does not authorize source import, route activation,
scoring, persistence, package promotion, or assignment. See ADR 0727.
