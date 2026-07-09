# ADR 0055: QR Print Readiness Gate

Date: 2026-07-09

Status: accepted

## Context

The route registry and edition QR alias scaffolds define stable routes, but they do not clearly state whether a QR can be printed.

## Decision

Add a QR print readiness gate.

## Implications

The platform now distinguishes:

- temporary demo QR,
- draft alias,
- print-ready QR,
- blocked QR.

This protects white-label textbook partners from publishing fragile links.
