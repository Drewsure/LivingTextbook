# DR-136: Local Companion Artifact Map

## Decision

Add a local companion artifact map to local bundle manifests and `/local/sample-publisher`.

## Reason

A closed local companion product needs more than a manifest snapshot. The team must know which files are generated, which are publisher-provided, which require school policy, and which are future installer/exporter work before packaging begins.

## Standard

- `/local/sample-publisher` shows `Package artifact map`.
- Local bundle manifests include artifact id, label, kind, path, status, required-for stage, source, blocker, and next step.
- Generated manifest snapshots include artifact metadata.
- Artifacts may be preview-ready while closed handoff and offline-ready artifacts remain blocked.
- No exporter or installer should be built until blocked artifacts have explicit owners and acceptance rules.
