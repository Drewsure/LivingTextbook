# ADR 1287: Package-Owned White-Label Tenant Configuration

Date: 2026-09-30
Status: Accepted

## Decision

An approved closed-local bundle carries its tenant configuration, including
display identity, curriculum/reward labels, avatar family, language defaults,
and AppShell brand colors. The configuration must match the bundle tenant id and
must pass safe-value validation before local runtime routes expose it.

Local package pages may use the known MiniStar and sample-publisher registry for
demo compatibility, but they must prefer the package-owned configuration. An
unknown tenant may receive only a safe generic review/error shell until an
approved package configuration is available.

## Rationale

White-label delivery cannot require an application-code edit for every new
publisher. Keeping branding in the reviewed package preserves tenant isolation,
version identity, and local reproducibility while allowing the same route and
game contracts to serve another publisher.

## Boundaries

- This is package configuration, not a tenant activation or billing decision.
- Color values are restricted before being applied as inline CSS variables.
- Student records, hosted persistence, QR mutation, and release approval remain
  separately gated.
- Frozen Z.ai/Phaser source remains isolated.
