# ADR 0004: Permanent QR And Local Companion Mode

Status: Accepted

Date: 2026-06-28

## Context

A potential textbook partner may need a closed local companion application for games and a multimedia platform. Printed textbooks may include long-lived QR codes that open unit-specific activities.

Printed QR codes create a permanence requirement. Once a textbook is printed, the QR payload should remain useful for years.

The partner may also need teacher reporting, which can require a front-door flow where students enter an entry code and, when required, a user code before starting games or media.

## Decision

The platform must support permanent QR identifiers and local/closed companion deployment as first-class white-label requirements.

The build standard is hybrid:

1. Stable QR registry.
2. Optional tiny hosted redirect when external QR permanence is required.
3. Local app/content-package fallback for closed or offline deployments.
4. Front-door entry-code/user-code route when teacher reporting or controlled access is required.

QR codes should resolve stable content identifiers, not fragile file paths or temporary routes.

## White-Label Impact

Strongly positive.

This expands the platform from a MiniStar-first school product into a saleable textbook companion platform for publishers, curriculum owners, and schools.

## Cost Impact

Mixed but acceptable.

The stable QR/content package model adds architecture work, but it avoids expensive rework later and prevents bad promises around printed QR permanence.

The optional hosted redirect should stay tiny and boring. It is not the whole platform; it is a stable pointer layer.

## Required Direction

- Add a content package model for tenant/book/unit/activity assets.
- Add multimedia asset catalog support for audio and video.
- Add permanent QR id schema.
- Add a front-door access model for entry code/user code flows.
- Support local/closed app packaging strategy.
- Keep optional hosted redirect as the recommended path for truly long-lived printed QR codes.

## Constraints

- Do not point printed QR codes directly at local files, temporary localhost ports, or version-specific assets.
- Do not hard-code partner textbook assumptions into MiniStar or platform primitives.
- Do not promise pure offline eternal QR behavior unless the installation/deep-link constraints are explicit.
- Do not introduce a hosted dependency for partners who require fully closed local mode without documenting the tradeoff.
- Do not merge front-door access, teacher reporting, and student identity into the QR code itself.

## Consequences

The platform can credibly support textbook partners, but we must design route permanence, content packaging, multimedia catalogs, front-door access, and teacher reporting before making partner delivery commitments.
