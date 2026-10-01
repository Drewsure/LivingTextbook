# DR-1372: Publisher Manifest MIME Alignment

**Decision:** Generated publisher manifests use the MIME types consumed by the
source preflight, while extension checks remain an input-safety concern for the
starter command.

**Why:** A saleable intake workflow must prove that the operator's generated
manifest can pass the same inventory check used for a real publisher folder.

**Boundary:** Type compatibility is not rights, accessibility, review,
promotion, release, QR, persistence, or student-use authorization.

**Verification:** The helper self-test generates temporary PDF, image, audio,
video, and transcript files, creates the manifest, and runs the actual source
preflight successfully.
