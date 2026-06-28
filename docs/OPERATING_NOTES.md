# Living Textbook Operating Notes

This document records repeatable procedures, environment constraints, and workarounds that future Codex sessions, engineers, or outside AI agents may need to recall.

These notes are not product standards. Product standards live in `docs/PRINCIPLES_AND_STANDARDS.md`. This file is the operational memory for how work actually gets done when tooling, branches, local permissions, or connectors behave in a consistent way.

## OW-001: GitHub Connector File Updates When Local Repo Access Is Blocked

Status: Active

Observed behavior: The local checkout may allow reading the repository root but block nested reads inside `LivingTextbook`, even after explicit read permission is requested. This prevents normal local patching and local build verification in that session.

Procedure:

1. Confirm the intended branch before editing. Current planning/build work has been on `legacy-source-import`.
2. Fetch target files through the GitHub connector using repository `Drewsure/LivingTextbook` and ref `legacy-source-import`.
3. Update or create files through the GitHub connector on the same branch.
4. Read back changed files through the connector after every meaningful update.
5. State clearly in the final response that local build/typecheck was not run if the local checkout remained inaccessible.
6. Do not assume the local checkout mirrors the remote working branch until it has been explicitly synchronized and verified.

Why this matters: It prevents accidental work on `main`, avoids destructive local workarounds, and preserves a reliable audit trail on the remote branch.

## OW-002: Branch Comparison May Fail Between `main` And `legacy-source-import`

Status: Active

Observed behavior: GitHub compare between `main` and `legacy-source-import` may report no common ancestor.

Procedure:

1. Do not use branch comparison as the only verification method.
2. Verify by reading back changed files directly from the target branch.
3. Mention this branch-state limitation when summarizing verification.
4. Avoid merge or reset operations until branch history is intentionally normalized.

## OW-003: Standards Must Be Updated When A Repeated Rule Appears

Status: Active

Procedure:

1. If a product/build principle affects future decisions, update `docs/PRINCIPLES_AND_STANDARDS.md`.
2. If a repeatable technical workaround or environment behavior appears, update this file.
3. If a major architecture decision is accepted, update `docs/DECISION_REGISTER.md` and add an ADR when useful.
4. Do not leave durable process knowledge only in chat history.

## OW-004: GitHub Connector Stale SHA Conflict

Status: Active

Observed behavior: Updating a file through the GitHub connector can fail with a 409 conflict if the file SHA is stale. This can happen after a recent create/update or when multiple related edits happen close together.

Procedure:

1. Stop updating that path immediately.
2. Refetch the exact file from `legacy-source-import`.
3. Use the fresh `sha` from the refetch.
4. Reapply the intended update against the fresh content.
5. Read back the changed file after the update succeeds.

Why this matters: It prevents accidental overwrites and keeps connector-based edits safe when local checkout verification is unavailable.

## OW-005: Local Checkout May Not Track Remote Connector Branch

Status: Active

Observed behavior: The local `D:\LIVING TEXTBOOOK PROJECT\LivingTextbook` checkout can be present but still not match the active GitHub connector branch. In the current observed state, local `git status --short --branch` reported `main`, and `git remote -v` returned no configured remotes.

Procedure:

1. Do not run build or typecheck as proof of `legacy-source-import` unless the local checkout has first been synchronized to that branch.
2. Check local branch and remotes before claiming local verification.
3. If no remote is configured, either use GitHub connector readback only or intentionally configure/sync the repo in a separate setup step.
4. Clearly distinguish connector readback verification from local build, typecheck, or browser verification.
5. Avoid local edits on `main` while connector work is happening on `legacy-source-import` unless the task explicitly calls for local branch repair.

Why this matters: It prevents false confidence, avoids testing stale files, and keeps future work from splitting between an unsynced local checkout and the remote branch.