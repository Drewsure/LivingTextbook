# ADR 0730: Frozen Source Manifest Path Integrity

## Status

Accepted

## Context

The frozen Phaser reproducibility checker hashes source files listed in the
review packet. It already prevented absolute paths from escaping the isolated
snapshot, but duplicate or non-normalized entries could make the manifest
ambiguous and reduce the value of its evidence record.

## Decision

Before resolving or hashing a manifest entry, require a unique normalized
repository-relative POSIX path. Reject absolute paths, drive-letter paths,
backslashes, empty segments, `.` segments, and `..` traversal. Keep the checker
read-only and path-contained.

## Consequences

The frozen source identity check is portable and unambiguous across local and
CI environments. A malformed manifest fails closed without modifying the
snapshot or application. The check remains evidence-only and does not permit
source import, route activation, package promotion, scoring, persistence, or
assignment.

## Verification

Run `npm run verify:phaser-source-evidence-contract` and
`npm run verify:phaser-source-evidence`.
