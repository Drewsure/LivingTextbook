# ADR 1277: Closed-Local Release Lineage

## Status

Accepted for foundation hardening.

## Decision

The local-package delivery route must reconcile the requested manifest and
quarantine identity through the shared live release-lineage validator before
calling the local package assembler.

## Why

Closed-local delivery is a real package-writing path. It must not be weaker than
hosted/release metadata paths or allow a durable packet to stand in for complete
multimedia, game, rights, and source-review evidence.

## Boundaries

The route remains blocked unless its dedicated delivery token, local write gate,
explicit roots, approved manifest, release receipt, and package index also pass.
Lineage success does not itself activate students or hosted persistence.

## Verification

The local package assembler verifier requires the shared lineage call and the
blocked response marker; foundation composition must remain green.
