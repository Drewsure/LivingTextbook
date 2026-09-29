# DR-1235: Pilot Delivery Manifest

## Decision

Create a side-effect-free, tenant/package-scoped pilot delivery manifest that
joins all release-critical evidence before a manual package writer can run.

## Required lanes

Source review, package readiness, multimedia rights, game audio, QR registry,
QR print authorization, local bundle, hosted persistence, teacher policy, and
release approval.

## Current state

The sample publisher manifest is intentionally blocked. It proves the gate
composition and identifies the remaining evidence without claiming that a
saleable package already exists.

## Guardrails

No package write, raw media exposure, QR mutation, persistence activation, or
student-facing activation may result from manifest creation.
