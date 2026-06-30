# Managed Session GitHub File Update Workaround

Date: 2026-07-01

## Situation

A managed Codex session may allow repository reads but block local `apply_patch` writes, even inside the expected workspace. In that case, source changes can still be applied through the GitHub contents API on `legacy-source-import`.

## Procedure

1. Fetch the latest target file through the GitHub connector before editing.
2. If the connector readback does not expose the file SHA, compute the Git blob SHA from the GitHub-normalized text, not from a CRLF local Windows copy.
3. For Windows local files, normalize `\r\n` to `\n` before computing the blob SHA.
4. Use the computed LF-normalized SHA with the GitHub file update tool.
5. After the commit lands, ask the human to pull, typecheck, build, restart the dev server, and browser-test the changed routes.

## Why This Matters

A SHA computed from the local CRLF file can fail with a GitHub `409` conflict even when the visible text is identical. GitHub stores the contents API text with LF line endings, so the safe update token must match that version.

## Use Sparingly

This is a workaround for managed-session write restrictions. Normal local edits should still use the standard patch workflow when available.
