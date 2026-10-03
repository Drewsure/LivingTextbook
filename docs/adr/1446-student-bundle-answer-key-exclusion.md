# ADR 1446: Student Bundle Answer-Key Exclusion

## Decision

Student bundles must reject teacher answer-key paths and teacher-only asset
markers at the shared local-bundle manifest boundary. Teacher answer material
may be referenced by a separate teacher-review contract, but the first review
adapter returns metadata only and remains blocked until an approved provider is
configured.

## Contract

The local bundle validator and assembler call the shared
`validateStudentBundleTeacherAnswerExclusion` guard. A manifest containing a
`teacher-answer-key` kind, `teacherOnly: true`, or a path under
`teacher/answers/` is invalid for student delivery.

The teacher answer-key review API requires the exact tenant-scoped teacher
authorization boundary and returns `contentIncluded: false` and
`studentFacing: false`. Any future provider record must match the requested
tenant, package, version, and asset identity and must carry its own checksum.
The current adapter does not synthesize a record, read the external PDF, or
expose answer content.

## Status

Boundary implementation and static verification are complete. Runtime answer
provider configuration, teacher UI rendering of answer content, and any
promotion remain separate future gates.
