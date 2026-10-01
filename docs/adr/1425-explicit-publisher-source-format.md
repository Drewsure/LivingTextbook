# ADR 1425: Explicit Publisher Source Format In Intake Kits

## Decision

Allow the publisher pilot intake-kit generator to accept an explicit safe
source path under `source/`, defaulting to `source/unit-1.pdf`. Supported
textbook source formats are PDF, DOCX, TXT, Markdown, and CSV, matching the
canonical source-manifest contract.

## Rationale

Publishers may provide a PDF edition, an editable DOCX manuscript, or a
structured text source. Hard-coding the scaffold to a PDF creates unnecessary
manual edits and makes the white-label handoff less reusable. The canonical
manifest and preflight already validate these formats, so the generator should
declare the operator's chosen source explicitly.

## Safety boundary

The option accepts only relative paths inside `source/` with an approved
extension. It does not upload, parse, extract, promote, assemble, print, or
enable students. Rights, accessibility, checksum, and review gates remain
unchanged.

## Verification

`node scripts/create-publisher-pilot-intake-kit.mjs --self-test`

`node scripts/verify-publisher-pilot-intake-kit.mjs`
