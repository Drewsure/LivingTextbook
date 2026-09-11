# ADR-0558: Backend Contract Alignment

Status: Accepted  
Date: 2026-09-11

## Decision

Cross-check the vendor-neutral schema draft, migration candidates, and
migration specifications as one backend contract before choosing a provider or
writing migrations.

## Rules

- Every migration candidate target must resolve to a schema entity.
- Every migration specification must resolve to a migration candidate.
- Each specification must have a primary key, tenant scope, and unique field
  names.
- The gate remains read-only and vendor-neutral.

## Consequences

The teacher intake and persistence workbenches show a dedicated alignment
status. The foundation verifier compiles and exercises the same sample data,
so drift cannot hide behind source-only marker checks. This does not authorize
backend selection, live writes, migrations, or Z.ai/Phaser integration.
