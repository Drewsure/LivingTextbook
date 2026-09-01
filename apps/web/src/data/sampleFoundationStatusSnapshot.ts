export type FoundationStatusSnapshotTone = "success" | "warning" | "neutral";

export interface FoundationStatusSnapshotItem {
  itemId: string;
  label: string;
  value: string;
  tone: FoundationStatusSnapshotTone;
  detail: string;
}

export interface FoundationStatusSnapshot {
  snapshotId: string;
  label: string;
  summary: string;
  items: FoundationStatusSnapshotItem[];
  controlRoomPath: string;
  blockedActions: string[];
}

export const sampleFoundationStatusSnapshot: FoundationStatusSnapshot = {
  snapshotId: "foundation-status-snapshot-v2026-09-02",
  label: "Foundation status snapshot",
  summary:
    "The build is still in foundation and pilot-readiness work: structure, route contracts, teacher controls, audio-first game paths, evidence packets, and storage boundaries before premium polish or live classroom workflow.",
  controlRoomPath: "/teacher/intake",
  items: [
    {
      itemId: "build-stage",
      label: "Build stage",
      value: "Structure first",
      tone: "success",
      detail: "Clean component, data, route, tenant, audio, and verifier structure comes before premium visual polish.",
    },
    {
      itemId: "route-health",
      label: "Route health",
      value: "85 active routes checked",
      tone: "success",
      detail: "Teacher, student, game, media, print, report, local companion, and QR scaffold routes are verified locally.",
    },
    {
      itemId: "tenant-boundary",
      label: "Tenant boundary",
      value: "Tenant boundary visible",
      tone: "success",
      detail: "MiniStar and sample publisher navigation, media ownership, and workbench availability are intentionally separated.",
    },
    {
      itemId: "outside-prototypes",
      label: "Outside prototypes",
      value: "Z.ai intake not yet",
      tone: "warning",
      detail: "Codex will signal the future intake alert before Z.ai, Phaser, or outside game prototypes are inventoried for integration.",
    },
  ],
  blockedActions: [
    "No live feature activation",
    "No classroom launch",
    "No real learner data",
    "No report export",
    "No Z.ai import before the intake alert",
  ],
};
