# ADR 1385: Local Assembly Requires Canonical Game Evidence

## Status

Accepted for the review-only pilot foundation.

## Decision

The local package writer and its execution preflight must require a durable
reviewed package-evidence status plus the complete canonical game evidence set:
curated activity pathway, canonical game integration, and package game-audio
coverage.

## Why

The assembly preview is not the only safety boundary. A direct writer request,
replayed request, or future delivery adapter must not bypass the reviewed
multimedia/game package contract by supplying only release, QR, bundle, or file
metadata.

## Boundary

The evidence fields are copied into the package review binding for audit and
runtime read-back. They authorize neither release nor student use on their
own. Existing write, release, QR, asset-custody, privacy, and local-package
environment gates remain mandatory.

## Verification

The local package assembler rehearsal rejects incomplete canonical game
evidence and incomplete package evidence, while the approved fixture still
passes assembly, idempotent replay, runtime read-back, and integrity checks.
