export type PilotReadinessStatus = "ready" | "in-progress" | "blocked";

export interface PilotReadinessItem {
  id: string;
  label: string;
  status: PilotReadinessStatus;
  timeframe: string;
  proof: string;
  nextStep: string;
}

export interface WhiteLabelPilotReadiness {
  headline: string;
  recommendedPromise: string;
  internalPocWindow: string;
  colleaguePilotWindow: string;
  commercialWindow: string;
  items: PilotReadinessItem[];
}

export const whiteLabelPilotReadiness: WhiteLabelPilotReadiness = {
  headline: "White-label pilot readiness",
  recommendedPromise: "A testable white-label Living Textbook pilot is realistic in 8-12 weeks if scope stays tight.",
  internalPocWindow: "Now-2 weeks",
  colleaguePilotWindow: "8-12 weeks",
  commercialWindow: "4-6 months after pilot feedback",
  items: [
    {
      id: "tenant-shell",
      label: "Tenant-branded shell",
      status: "ready",
      timeframe: "Foundation ready",
      proof: "MiniStar runs through TenantConfig and CSS variables.",
      nextStep: "Add a second sample publisher tenant before external demo.",
    },
    {
      id: "qr-entry",
      label: "QR/front-door entry",
      status: "ready",
      timeframe: "Foundation ready",
      proof: "/launch/demo-unit-1 and /enter/ministar prove the two entry styles.",
      nextStep: "Add permanent printed-QR registry storage after content-package intake is stable.",
    },
    {
      id: "games",
      label: "Core games",
      status: "in-progress",
      timeframe: "2-5 weeks",
      proof: "Flashcards, Memory Match, Training Academy, and Speak It are active scaffolds.",
      nextStep: "Promote 2-4 reusable parent-engine modes to pilot quality.",
    },
    {
      id: "multimedia",
      label: "Audio/video companion layer",
      status: "in-progress",
      timeframe: "2-5 weeks",
      proof: "Sample package includes media assets, playlist concept, and background media events.",
      nextStep: "Add rights-managed asset paths and local/offline bundle resolution.",
    },
    {
      id: "teacher-reporting",
      label: "Teacher progress view",
      status: "in-progress",
      timeframe: "3-6 weeks",
      proof: "Local event summaries already count game, media, and recovery events.",
      nextStep: "Choose the first persistence/report export model.",
    },
    {
      id: "pdf-intake",
      label: "PDF/textbook unit intake",
      status: "blocked",
      timeframe: "4-8 weeks",
      proof: "Requirements are documented, but no reviewed import workflow is built yet.",
      nextStep: "Create a draft-import pipeline with human review before student assignment.",
    },
    {
      id: "closed-local",
      label: "Closed/local deployment",
      status: "blocked",
      timeframe: "6-10 weeks",
      proof: "Hybrid QR/local companion strategy exists, but packaging is not implemented.",
      nextStep: "Decide first pilot deployment target: hosted PWA, local classroom server, or packaged app.",
    },
  ],
};
