# DR-1364: Explicit Machine-Bound Manifest Review Request Preview

The deployment workbench now exposes the exact metadata required to record a
reviewed local bundle manifest and validates it through the shared
content-model. The actual custody write remains behind the dedicated pilot
delivery API-token boundary.

The preview is review-only and metadata-only. It makes no endpoint call and
does not enable manifest storage, package assembly, asset promotion, QR
printing, hosted persistence, learner records, or student use.
