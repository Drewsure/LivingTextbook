# DR-810: Progress Envelope Stream Input Boundary

Require progress-event stream helpers to check `Array.isArray` before using
collection methods. Non-array validator input returns a deterministic error;
non-array warning input returns a report-preview warning. This prevents
malformed external payloads from throwing inside report, persistence, Phaser,
or game adapters while keeping live side effects blocked.
