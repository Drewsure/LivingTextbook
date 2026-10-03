# Build Session: Teacher Answer-Key Source Lane

Received the MiniStar Foundation Unit 1 Teacher PDF and stored it outside the
repository at `D:\PublisherPilotInput\teacher\answers\unit-1-answers.pdf`.

The student PDF remains at `D:\PublisherPilotInput\source\unit-1.pdf`.
Separate SHA-256 checksums were captured. The teacher file is declared only in
the external publisher intake brief under `teacher/answers/`; it is never added
to the student source command or student-facing payload.

Implemented the first contract slice: intake briefs, source manifests, source
preflight, and submission review manifests now recognize `teacher-answer-key`
with an explicit `teacherOnly: true` boundary. The student source starter does
not place teacher-only files in its student command.

Remaining gate: verify final student-bundle omission and tenant-scoped teacher
answer review access before any answer content can be promoted.

The next hardening slice now makes that gate explicit: local student bundle
validation and assembly reject teacher-answer-key kinds, teacher-only markers,
and `teacher/answers/` paths. A tenant-scoped teacher review API exists as a
metadata-only, provider-blocked boundary with `contentIncluded: false`; it does
not read or expose the external Teacher PDF.

The review contract now also validates provider records against the exact
tenant, package, version, and asset identity requested by the teacher, while
requiring the answer source checksum to remain present.

The teacher persistence workbench now exposes this boundary through a
review-only Answer-key status card. It reuses the existing teacher session
event, checks the exact scope, and displays only provider/status/checksum
metadata. It never renders answer text or downloads the external PDF.

The external human package-review evidence now has a checksum-binding lane for
declared teacher answer files. When the intake brief declares
`teacherAnswerFiles`, the validator requires one record per file, hashes the
file in the external publisher folder, and rejects checksum drift, student
facing flags, or answer-bearing fields. The repository never copies the PDF.
