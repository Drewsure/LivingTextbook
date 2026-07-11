# DR-141: Teacher Report Event Acceptance Summary

## Decision

Show the teacher session event acceptance gate inside teacher report package previews.

## Reason

Reports are where schools and publishers will look for proof that the platform is safe to pilot. If the report package can be previewed without showing event acceptance status, a future build could accidentally treat demo events as export-ready evidence.

## Standard

- Report package previews include `Event acceptance summary`.
- The summary shows gate status, blocked item count, warning count, evidence, and next steps.
- Report package previews remain blocked for export until event acceptance, report policy, persistence, retention, access, and sensitive-data rules pass.
- The summary does not enable live event storage or report export by itself.
