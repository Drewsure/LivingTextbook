export type RouteGraduationStatus = "pass" | "blocked" | "manual-review";

export interface RouteGraduationLane {
  laneId: string;
  label: string;
  status: RouteGraduationStatus;
  routeState: string;
  purpose: string;
  requiredEvidence: string[];
  blockedActions: string[];
}

export interface RouteGraduationGate {
  gateId: string;
  label: string;
  summary: string;
  standingRule: string;
  lanes: RouteGraduationLane[];
  hardRequirements: string[];
  blockedActions: string[];
}

export const sampleRouteGraduationGate: RouteGraduationGate = {
  gateId: "route-graduation-gate-v2026-09-02",
  label: "Route graduation gate",
  summary:
    "Active local routes prove component and data shape only. A scaffold route cannot become pilot-ready, assignment-ready, or production QR-backed until tenant, audio, reporting, storage, policy, rollback, and local fallback evidence all line up.",
  standingRule:
    "Scaffold is not production: no scaffold route becomes pilot-ready from a link, a visible panel, a generated package, or a local preview alone.",
  lanes: [
    {
      laneId: "scaffold-route-state",
      label: "Scaffold route",
      status: "pass",
      routeState: "Local review",
      purpose: "Prove the page renders, uses tenant styling, follows route helpers, and remains review-only.",
      requiredEvidence: ["Route helper contract", "Tenant navigation boundary", "Active route verification", "Review-only copy"],
      blockedActions: ["No route graduation action", "No production QR mutation", "No live learner data"],
    },
    {
      laneId: "student-ready-route-state",
      label: "Student-ready route",
      status: "manual-review",
      routeState: "Future gated release",
      purpose: "Permit controlled student use only after reviewed content, target-language audio, standard progress events, and teacher controls are present.",
      requiredEvidence: [
        "Target-language audio coverage",
        "Standard progress events",
        "Teacher report boundary",
        "Private assignment gate",
      ],
      blockedActions: ["No support-language-only progress", "No media-only progress", "No raw learner audio storage"],
    },
    {
      laneId: "pilot-ready-route-state",
      label: "Pilot-ready route",
      status: "blocked",
      routeState: "School approval required",
      purpose: "Allow a route into a real classroom pilot only after policy, persistence, reporting, and rollback gates close.",
      requiredEvidence: [
        "School policy acceptance",
        "Backend storage selection",
        "Class roster identity boundary",
        "Report export policy",
        "Rollback plan",
      ],
      blockedActions: ["No live classroom launch", "No real learner data", "No report export"],
    },
    {
      laneId: "production-qr-route-state",
      label: "Production QR route",
      status: "blocked",
      routeState: "Printed textbook permanence",
      purpose: "Bind a stable QR alias to reviewed hosted/local targets without relying on temporary localhost or raw file paths.",
      requiredEvidence: ["QR alias and rollback plan", "Local companion fallback", "Media rights proof", "Versioned package manifest"],
      blockedActions: ["No direct localhost target", "No direct media file target", "No unreviewed package swap"],
    },
  ],
  hardRequirements: [
    "Route helper contract",
    "Tenant navigation boundary",
    "Target-language audio coverage",
    "Standard progress events",
    "Teacher report boundary",
    "Private assignment gate",
    "School policy acceptance",
    "Backend storage selection",
    "QR alias and rollback plan",
    "Local companion fallback",
  ],
  blockedActions: [
    "No route graduation action",
    "No production QR mutation",
    "No live classroom launch",
    "No live learner data",
    "No report export",
    "No support-language-only progress",
    "No direct media file target",
  ],
};
