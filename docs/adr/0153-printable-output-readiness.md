# ADR 0153: Printable Output Readiness

## Status

Accepted

## Context

Competitor products often offer printable versions of interactive activities. This is useful for classrooms, homework, textbook partners, and low-device settings. Living Textbook should support printables, but only through reviewed package data and explicit export gates.

## Decision

Add a printable output readiness plan, teacher/admin panel, and verifier.

## Consequences

- `/teacher/intake` shows planned vocabulary, sentence, and teacher answer-key printables.
- Word Search and Crossword remain blocked until puzzle-specific rules exist.
- PDF export is explicitly blocked until renderer, QR/audio, version/rights, and teacher export policy gates are closed.
- `npm run verify:printables` is included in `npm run verify:foundation`.
- Printable output becomes part of the foundation architecture without rushing the actual PDF engine.
