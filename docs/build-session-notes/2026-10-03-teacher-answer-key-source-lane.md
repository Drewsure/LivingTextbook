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
