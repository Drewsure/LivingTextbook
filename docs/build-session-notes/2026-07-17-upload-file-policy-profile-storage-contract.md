# 2026-07-17: Upload File Policy Profile Storage Contract

## Added

- Backend-neutral `upload_file_policy_profile` schema contract.
- Migration candidate `m052-upload-file-policy-profile-records`.
- Migration spec `spec-upload-file-policy-profile`.
- Hosted and local adapter write intents.
- Durable record and persistence boundary.
- Upload, backend, and active route verification hooks.
- MIME-type visibility in the teacher upload file policy panel.

## Rule Preserved

Upload policy profiles are front gates, not upload actions. They preserve accepted extensions, MIME rules, maximums, required checks, scan/file policy packets, and blocked shortcuts before live upload controls exist, while blocking uploads without policy, unsafe MIME types, oversize files, unchecked scans, and student-facing uploaded file use.
