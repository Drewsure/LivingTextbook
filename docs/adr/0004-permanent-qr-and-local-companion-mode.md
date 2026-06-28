# ADR 0004: Permanent QR And Local Companion Mode

Status: Accepted

Date: 2026-06-28

## Context

A potential textbook partner may need a closed local companion application for games and a music/audio platform. Printed textbooks may include long-lived QR codes that open unit-specific activities.

Printed QR codes create a permanence requirement. Once a textbook is printed, the QR payload should remain useful for years.

## Decision

The platform must support permanent QR identifiers and local/closed companion deployment as first-class white-label requirements.

QR codes should resolve stable content identifiers, not fragile file paths or temporary routes.

## White-Label Impact

Strongly positive.

This expands the platform from a MiniStar-first school product into a saleable textbook companion platform for publishers, curriculum owners, and schools.

## Cost Impact

Mixed but acceptable.

The stable QR/content package model adds architecture work, but it avoids expensive rework later and prevents bad promises around printed QR permanence.

## Required Direction

- Add a content package model for tenant/book/unit/activity assets.
- Add media/audio asset catalog support.
- Add permanent QR id schema.
- Support local/closed app packaging strategy.
- Keep optional hosted redirect as the recommended path for truly long-lived printed QR codes.

## Constraints

- Do not point printed QR codes directly at local files, temporary localhost ports, or version-specific assets.
- Do not hard-code partner textbook assumptions into MiniStar or platform primitives.
- Do not promise pure offline eternal QR behavior unless the installation/deep-link constraints are explicit.
- Do not introduce a hosted dependency for partners who require fully closed local mode without documenting the tradeoff.

## Consequences

The platform can credibly support textbook partners, but we must design route permanence, content packaging, and media catalogs before making partner delivery commitments.
