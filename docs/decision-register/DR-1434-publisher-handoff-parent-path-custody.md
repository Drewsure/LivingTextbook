# DR-1434: Publisher Handoff Parent-Path Custody

Versioned publisher revisions now inspect each existing directory segment under
the external handoff root. Linked parent directories are rejected before any
copy, closing a custody escape that leaf-only checks could miss. Missing
segments remain missing-file evidence; no content is invented and no protected
action is enabled.

See ADR 1434 and `scripts/create-publisher-pilot-intake-revision.mjs`.
