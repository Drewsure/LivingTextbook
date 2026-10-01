# ADR 1371: Bounded Publisher Source Manifest Template

## Status

Accepted for the first publisher intake workflow.

## Context

The source preflight already accepts a safe publisher folder with a
`publisher-source-manifest.json`. A new publisher should not need to handcraft
that JSON, but a convenience tool must not be mistaken for an upload or review
operation.

## Decision

Add `scripts/create-publisher-source-manifest.mjs`. It accepts explicit
tenant/package/version/unit/source inputs and optional media declarations,
validates relative paths and extensions, creates only the manifest, refuses
overwrites, and prints the next preflight step. Publisher files remain outside
the repository and are never read by the template command.

## Consequences

- The colleague can start a correctly shaped PDF/multimedia intake folder with
  one repeatable command.
- Missing files, rights, checksums, accessibility, and review decisions still
  fail or block at the existing preflight and later gates.
- The manifest generator does not add a second intake path or weaken custody.

## Verification

- `node scripts/create-publisher-source-manifest.mjs --self-test`
- `node --check scripts/create-publisher-source-manifest.mjs`
- `npm run verify:publisher-source-preflight`

