# ADR 0780: Content-Model Package Export Map

## Status

Accepted

## Decision

`@living-textbook/content-model` exposes a single package-root export whose
types and default target are `./src/index.ts`. Internal module paths are not
part of the consumer API.

## Why

The package root is the stable contract for white-label applications,
AI-service adapters, and future deployment targets. A root-only export map
keeps internal file organization replaceable and makes accidental subpath
coupling fail early.

## Verification

- The public-boundary verifier checks the manifest and app source.
- AI-service and web typechecks pass.
- The production webpack build passes.

## Non-goals

This does not enable live AI calls, uploads, persistence, assignments, or
Phaser source promotion.
