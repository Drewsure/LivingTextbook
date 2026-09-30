# DR-1365: Deliberate Local Package Operator Command

The controlled pilot now has a documented `scripts/run-local-package-operator.mjs`
command. It defaults to read-only preflight and requires both the tenant-scoped
pilot delivery token and an explicit assembly confirmation before sending a
write request.

The command reuses existing custody and release gates and prints only bounded
status metadata. It does not create a new approval, persistence, QR, asset, or
student-use shortcut.
