# DR-1269: Live Review Decision Binding

**Status:** Accepted

**Decision:** Show the validated quarantine review-decision sidecar in the live
package readiness response and teacher handoff panel.

**Reason:** A saleable pilot needs an auditable source-review checkpoint tied to
the real publisher submission, while keeping release and package activation
under separate human-controlled gates.

**Boundary:** Read-only metadata binding. No decision write, package assembly,
promotion, QR printing, hosted persistence, or student-facing use is enabled.
