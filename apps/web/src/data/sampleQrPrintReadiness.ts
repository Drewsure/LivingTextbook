export type QrPrintReadinessStatus = "print-ready" | "draft-only" | "blocked";
export type QrPrintGateStatus = "pass" | "warning" | "blocked";

export interface QrPrintGate {
  gateId: string;
  label: string;
  status: QrPrintGateStatus;
  owner: "platform" | "tenant" | "publisher" | "persistence" | "deployment";
  note: string;
}

export interface QrPrintReadinessRecord {
  recordId: string;
  printedQrId: string;
  aliasId: string;
  label: string;
  status: QrPrintReadinessStatus;
  printDecision: string;
  gates: QrPrintGate[];
}

export const sampleQrPrintReadinessRecords: QrPrintReadinessRecord[] = [
  {
    recordId: "print-readiness-sample-publisher-2026",
    printedQrId: "qr-sample-publisher-starter-l1-u1-hello",
    aliasId: "sample-publisher-hello-friends-2026-current",
    label: "Sample Publisher 2026 Unit 1 front-door QR",
    status: "draft-only",
    printDecision:
      "Do not print in a production textbook yet. The alias shape is correct, but persistence, media rights, and pilot release approval are still open.",
    gates: [
      {
        gateId: "alias-shape",
        label: "Stable alias shape",
        status: "pass",
        owner: "platform",
        note: "The QR points to an alias concept rather than a raw media file or temporary localhost path.",
      },
      {
        gateId: "alias-persistence",
        label: "Alias persistence",
        status: "blocked",
        owner: "persistence",
        note: "The alias is still sample data and must become a durable route record before printing.",
      },
      {
        gateId: "media-rights",
        label: "Media rights",
        status: "blocked",
        owner: "tenant",
        note: "Partner audio/video rights and files are not production-ready.",
      },
      {
        gateId: "fallback-message",
        label: "Fallback message",
        status: "warning",
        owner: "publisher",
        note: "Legacy/retired edition messaging is planned but not implemented as a production route.",
      },
    ],
  },
  {
    recordId: "print-readiness-ministar-demo",
    printedQrId: "qr-ministar-l1-u1-demo",
    aliasId: "front-door-ministar-l1-u1",
    label: "MiniStar Unit 1 demo QR",
    status: "draft-only",
    printDecision:
      "Usable for internal demo cards or temporary classroom material, but not for long-lived printed books until route alias persistence is selected.",
    gates: [
      {
        gateId: "launch-route",
        label: "Launch route",
        status: "pass",
        owner: "platform",
        note: "The demo launch and front-door routes are available.",
      },
      {
        gateId: "source-package",
        label: "Reviewed sample package",
        status: "pass",
        owner: "publisher",
        note: "The sample package is reviewed enough for demo use.",
      },
      {
        gateId: "alias-persistence",
        label: "Alias persistence",
        status: "blocked",
        owner: "persistence",
        note: "Long-lived printed QR codes need durable alias records.",
      },
      {
        gateId: "local-fallback",
        label: "Local fallback",
        status: "warning",
        owner: "deployment",
        note: "Hybrid/local fallback remains planned, not production-ready.",
      },
    ],
  },
  {
    recordId: "print-readiness-direct-file-blocked",
    printedQrId: "qr-blocked-direct-media-file",
    aliasId: "blocked-direct-file-example",
    label: "Blocked direct media-file QR",
    status: "blocked",
    printDecision:
      "Never print this form. Printed QR codes must not target raw local files, unversioned folders, or unreviewed media paths.",
    gates: [
      {
        gateId: "target-path",
        label: "Target path",
        status: "blocked",
        owner: "platform",
        note: "The target is a direct file path and violates the permanence rule.",
      },
      {
        gateId: "manifest",
        label: "Media manifest",
        status: "blocked",
        owner: "tenant",
        note: "No reviewed media manifest or rights record exists.",
      },
    ],
  },
];

export function countQrPrintGates(
  record: QrPrintReadinessRecord,
  status: QrPrintGateStatus,
): number {
  return record.gates.filter((gate) => gate.status === status).length;
}
