# ADR 0727: Phaser Review Source-Path Boundary

## Status

Accepted

## Context

Phaser candidate contract reviews identify source files for evidence and human
inspection. These references must remain portable and must not point to a
developer machine, an absolute filesystem location, or a parent of the review
package. The previous check rejected parent traversal but still allowed paths
such as `C:\\outside\\candidate.ts`.

## Decision

Require every `sourceFiles` path in a contract-review record to be:

- non-empty;
- repository-relative;
- written with forward slashes;
- free of drive-letter or other colon prefixes;
- free of leading slashes; and
- free of `..` path segments.

The validator also continues to require uniqueness. Invalid references fail
closed before review alignment can be accepted.

## Consequences

Evidence packets remain portable between Windows, CI, and later review tools.
The review-only boundary is stronger because metadata cannot escape the
isolated source package through an absolute or platform-specific path. Existing
candidate packages using machine-local paths must be corrected in their
evidence packet; this decision does not permit source import or route
activation.

## Verification

Run `npm run verify:runtime-behavior` and
`npm run verify:phaser-candidate-reviews`. The runtime harness includes a
Windows absolute-path rejection case.
