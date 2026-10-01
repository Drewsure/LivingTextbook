# ADR 1384: Assembly Preview Requires Reviewed Game Evidence

## Status

Accepted for the review-only pilot foundation.

## Decision

The publisher delivery assembly request preview must include two explicit
inputs before a writer can ever be considered: complete reviewed package
evidence and complete canonical game evidence. These inputs are separate from
the review packet, source preflight, delivery manifest, QR, bundle, and
operator inputs.

## Why

The first saleable pilot promises a reviewed multimedia/game package. A local
assembly preview that checks only file and release metadata could otherwise
look ready while the package evidence or canonical game integration remained
incomplete.

## Boundary

The preview remains blocked, review-only, side-effect-free, and unable to
invoke a writer, create a QR artifact, activate persistence, or expose
students.

## Verification

The assembly-preview verifier covers all eleven required inputs, including the
new package and canonical-game evidence inputs.
