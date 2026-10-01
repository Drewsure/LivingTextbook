# ADR 1423: Derive External Package Review Evidence From Canonical Records

## Decision

Provide a create-once bridge from the canonical publisher source preflight and
tenant-scoped package evidence review to the external
`package-review-evidence.json` record used by the saleability audit.

## Rationale

The review service already owns the lane references and source checksum. An
operator should not manually retype those identities into the human evidence
packet, because transcription could bind release evidence to the wrong source
or package.

## Safety boundary

The bridge requires a complete source preflight, a complete package evidence
review, an explicit final package checksum, and curated game pathway IDs. It
writes one metadata-only record outside the repository with create-once
semantics. It does not copy files, assemble, print, activate persistence, or
enable students.

## Verification

`node scripts/create-pilot-package-review-evidence-from-record.mjs --self-test`

`node scripts/verify-pilot-package-review-evidence.mjs --self-test`
