# DR-1359: Durable-Records Local Package Request

Local package preflight and assembly now accept a bounded durable-records draft
as well as the full integration request. The server derives the exact approved
delivery metadata, receipt, package index, and QR registry from the supplied
tenant/package/version custody identity before applying the shared review,
lineage, asset, bundle, print, and write-gate checks. Placeholder or wildcard
custody reads are forbidden. See ADR 1359.
