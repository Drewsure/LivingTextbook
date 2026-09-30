# DR-1366: Durable-Records Request Draft Generator

The controlled pilot now has a bounded command for creating the durable-
records local package request from approved custody identities. It refuses to
overwrite files, handles no credentials or publisher bytes, and makes no
server call.

The resulting request remains subject to all existing preflight, custody,
release, QR, asset, package, persistence, privacy, and student-safety gates.
