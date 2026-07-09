# DR-055: QR Print Readiness Gate

Date: 2026-07-09

Status: accepted

## Decision

Add a QR print readiness gate to the teacher/admin intake scaffold.

## Rationale

QR codes printed in textbooks must remain stable across editions, package updates, local/hosted deployments, and media changes. Demo aliases and raw file paths must never be mistaken for print-ready targets.

## Consequences

- Printed QR readiness is visible before production publishing.
- Draft and blocked QR examples remain explicit.
- Local file targets are prohibited.
- Alias persistence and media rights are hard gates before print.
