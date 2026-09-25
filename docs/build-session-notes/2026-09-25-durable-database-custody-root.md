# Build Session: Durable Database Custody Root

## Goal

Bind the first durable SQLite database to an explicit reviewed data custody
root before any hosted or closed-local deployment can report durable readiness.

## Implemented

- Added a shared policy for nested `.sqlite` database paths.
- Added the policy to the SQLite deployment gate.
- Kept process-memory rehearsal behavior unchanged.
- Withheld SQLite health diagnostics while the durable deployment gate is
  blocked, preventing a status route from opening an unapproved database path.
- Added focused path verification and the `LIVING_TEXTBOOK_PERSISTENCE_DATA_ROOT`
  environment contract.

## Boundaries

This is foundation hardening only. It does not enable durable writes, choose a
cloud provider, encrypt data, migrate records, activate backups, or promote any
external Phaser source.

## Verification

Run the durable database path verifier, durable operations checks, the web
typecheck, and the production webpack build. The full foundation gate remains
the release-level check.
