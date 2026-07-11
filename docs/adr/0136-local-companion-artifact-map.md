# ADR 0136: Local Companion Artifact Map

## Status

Accepted

## Context

The local companion preview shows route, game, media, release gate, preflight, and manifest data. Before building an exporter or installer, the platform needs a visible map of what files and policy artifacts would actually travel inside a closed package.

## Decision

Add artifact-map data to local bundle manifests and render it on `/local/sample-publisher`.

## Consequences

- The closed package path now distinguishes generated files, publisher-provided files, school-policy files, and future-build artifacts.
- A future exporter can consume a structured artifact list rather than inferring package contents from UI.
- The package remains preview-only while media, installer, backup/export, report policy, and release-gate artifacts are blocked.
