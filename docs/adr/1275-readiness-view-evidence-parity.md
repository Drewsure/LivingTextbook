# ADR 1275: Readiness View Evidence Parity

## Status

Accepted for foundation hardening.

## Decision

The combined publisher package-readiness binding must apply the same package-evidence lineage blocker as the standalone package-assembly preflight. The reviewed multimedia/game evidence sidecar is required before assembly can be considered ready in any view.

## Why

Different readiness surfaces must not report contradictory states for one quarantine record. A packet can be structurally valid while its content, game, audio, video, image, font, accessibility, or rights evidence remains incomplete. Keeping the evidence blocker in the binding makes the dashboard, handoff, and preflight contract agree.

## Boundaries

This is still a review-only gate. It does not write package files, approve release, authorize QR printing, enable persistence, promote a package, or permit student-facing use.

## Verification

The live review-decision binding verifier requires the evidence-lineage blocker, and the full foundation composition must remain green.
