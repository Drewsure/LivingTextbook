# ADR 1238: Canonical Publisher Package Index

## Decision

Promote the publisher package index into the shared content model and expose
it on the evidence handoff route. The same contract is used to preview a
review-only package and to validate the metadata written for an approved
manual release.

## Boundaries

The index binds tenant, package, version, manifest, receipt, checksum, content
path, curated game routes, media kinds, QR aliases, local fallback paths, and
hosted-persistence status. It contains no publisher payload bytes, learner
records, route mutations, or activation authority.

## Verification

The shared validator must reject malformed identity, checksum, route, media,
mode, persistence, or side-effect fields. The delivery writer must additionally
require the index to be `manual-release-approved` and match the manifest,
receipt, and handoff record during read-back.
