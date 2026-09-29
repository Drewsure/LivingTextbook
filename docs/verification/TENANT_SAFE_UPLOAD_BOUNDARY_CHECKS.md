# Tenant-Safe Upload Boundary Checks

Status: active scaffold

## Required Coverage

- `/teacher/uploads/sample-publisher` retains the populated reference upload workspace.
- `/teacher/uploads/white-label-review` shows `No publisher files have been admitted yet` and no Sample Publisher/MiniStar review records.
- The generic route exposes PDF/text, Labelled Diagram image, audio/music, and video channel policy.
- The generic route preserves the opt-in quarantine intake and keeps it disabled by default.
- Quarantine, scan, rights, mapping, package, QR, persistence, local delivery, and student use remain separately gated.
