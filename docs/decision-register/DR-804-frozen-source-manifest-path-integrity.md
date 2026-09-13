# DR-804: Frozen Source Manifest Path Integrity

Require each frozen Phaser source evidence manifest path to be unique and a
normalized repository-relative POSIX path before hashing. Duplicate, absolute,
drive-letter, backslash, empty-segment, dot-segment, and parent-directory paths
fail closed. The checker remains read-only and isolated; this does not
authorize source import, route activation, scoring, persistence, package
promotion, or assignment. See ADR 0730.
