# DR-1229: Quarantine Review Decision Record

Date: 2026-09-29  
Status: Accepted

The local publisher pilot now has an explicit, tenant-authorized teacher review
decision checkpoint for a quarantined source. The operator must enable the
review-decision flag before one immutable metadata record can be written beside
the quarantine record. The reviewer records the outcome, reviewed fields, note,
and unresolved blockers using a server-owned timestamp.

The record is not release approval and does not mutate the intake record. Raw
payloads, filesystem paths, learner data, evidence attachments, package writes,
promotion, routes, playlists, games, assignments, QR aliases, and student use
remain blocked. See ADR 1229.
