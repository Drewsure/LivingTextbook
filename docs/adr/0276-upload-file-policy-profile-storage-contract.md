# ADR 0276: Upload File Policy Profile Storage Contract

Date: 2026-07-17

Status: accepted

## Context

The teacher upload workspace already shows upload file policy profiles for PDF/text, image, audio/music, video, and local-bundle channels. Before any live file picker, drag-and-drop upload, checksum capture, MIME validation, malware scan, media transcode, object storage write, local upload folder, or upload promotion exists, the platform needs a durable policy record that all upload controls must obey.

## Decision

Add `upload_file_policy_profile` / `upload-file-policy-profile` as a backend-neutral storage contract.

The contract preserves accepted extensions, accepted MIME types, file size and duration maximums, required checks, `scan_and_file_policy_packet`, blocked shortcuts, policy revision, and student-facing upload blocks.

## Consequences

- Live upload controls must consult an accepted file policy profile before intake writes.
- Extension checks are not enough; MIME rules, checksum requirements, scan status, rights proof, caption/transcript policy, and target mapping remain part of the foundation.
- Hosted and closed/local deployments share the same policy vocabulary.
- File policy profiles cannot upload files, scan files, transcode media, create target records, create routes, or assign students by themselves.
- Uploaded files remain blocked from student-facing use until intake, review, target mapping, audio coverage, release, and school policy gates pass.
