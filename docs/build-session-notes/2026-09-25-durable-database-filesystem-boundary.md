# Build Session: Durable Database Filesystem Boundary

## Goal

Close the symlink and junction escape gap in the durable SQLite custody-root
policy.

## Implemented

- Added realpath checks for the configured root, nearest existing database
  ancestor, and existing database file.
- Kept new nested directories supported below an existing root.
- Added focused verification with a junction escape probe where permitted.
- Added standing ADR and decision-register records.

## Boundaries

This is a readiness check only. It does not open learner records, enable writes,
copy data, activate backups, or promote external Phaser source.

## Verification

Run the database-path verifier, full persistence checks, typecheck, and the
production build.
