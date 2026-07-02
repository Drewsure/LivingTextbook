export type BackendDecisionStatus = "recommended-first" | "candidate" | "defer" | "avoid-for-now";
export type BackendCostPosture = "lowest" | "controlled" | "higher";
export type BackendDeploymentFit = "hosted-first" | "local-first" | "hybrid";

export interface BackendDecisionOption {
  optionId: string;
  label: string;
  status: BackendDecisionStatus;
  deploymentFit: BackendDeploymentFit;
  costPosture: BackendCostPosture;
  whiteLabelFit: string;
  bestFor: string[];
  risks: string[];
  requiredBeforePilot: string[];
  notAllowedYet: string[];
}

export interface BackendDecisionMatrix {
  matrixId: string;
  label: string;
  currentRecommendation: string;
  decisionRule: string;
  options: BackendDecisionOption[];
}

export const sampleBackendDecisionMatrix: BackendDecisionMatrix = {
  matrixId: "first-pilot-backend-matrix",
  label: "First pilot backend decision matrix",
  currentRecommendation:
    "Use a hosted managed database pattern for the first real pilot, keep media in rights-managed object storage, and keep local/closed deployment compatible through exportable package records.",
  decisionRule:
    "Choose the lowest-cost option that supports stable QR routes, reviewed content packages, teacher launch sessions, coded learner progress, and report policy without locking future local deployments out.",
  options: [
    {
      optionId: "static-source-controlled-demo",
      label: "Static source-controlled demo data",
      status: "defer",
      deploymentFit: "hosted-first",
      costPosture: "lowest",
      whiteLabelFit: "Good for proofs and sales walkthroughs, weak for partner self-maintenance.",
      bestFor: ["Internal demos", "UI verification", "Schema iteration", "No student data"],
      risks: [
        "Cannot support durable teacher reports.",
        "Cannot support partner-managed content updates.",
        "Can be mistaken for production readiness if not labelled carefully.",
      ],
      requiredBeforePilot: [
        "Promote route registry, reviewed content packages, launch sessions, and event streams out of static files.",
      ],
      notAllowedYet: ["Real student progress storage", "Production report export", "Printed textbook QR permanence"],
    },
    {
      optionId: "hosted-postgres-style",
      label: "Hosted relational database pattern",
      status: "recommended-first",
      deploymentFit: "hosted-first",
      costPosture: "controlled",
      whiteLabelFit: "Strong fit for tenants, schools, route registries, content packages, launch sessions, and report queries.",
      bestFor: [
        "First hosted PWA pilot",
        "Teacher launch sessions",
        "Progress event stream",
        "Report export",
        "Tenant package records",
      ],
      risks: [
        "Needs privacy, role, retention, and export policy before real student data.",
        "Monthly service costs need usage limits.",
        "Local/closed deployment needs an export or sync story later.",
      ],
      requiredBeforePilot: [
        "Define tenant, route registry, content package, launch session, progress event, roster slot, and report policy records.",
        "Confirm role access for platform admin, tenant admin, teacher, and student devices.",
        "Keep raw audio and transcripts out of the core schema.",
      ],
      notAllowedYet: ["Open-ended AI Tutor transcripts", "Raw learner audio storage", "Ungated report exports"],
    },
    {
      optionId: "hosted-document-style",
      label: "Hosted document database pattern",
      status: "candidate",
      deploymentFit: "hosted-first",
      costPosture: "controlled",
      whiteLabelFit: "Useful for quick app state and realtime sync, but needs discipline around report queries and schema drift.",
      bestFor: ["Realtime classroom state", "Simple tenant settings", "Fast prototype persistence"],
      risks: [
        "Report queries and exports may become more complex than relational records.",
        "Schema drift can weaken the verifier layer if content packages are too loose.",
        "Vendor rules can become difficult to audit across white-label tenants.",
      ],
      requiredBeforePilot: [
        "Prove report export shape before choosing document storage for event streams.",
        "Define strict typed records despite flexible document storage.",
      ],
      notAllowedYet: ["Unstructured content-package writes", "Unreviewed AI-generated unit records"],
    },
    {
      optionId: "local-sqlite-package",
      label: "Local SQLite-style classroom package",
      status: "defer",
      deploymentFit: "local-first",
      costPosture: "higher",
      whiteLabelFit: "Strong for closed textbook companions, but heavier for installation, backup, updates, and support.",
      bestFor: ["Closed local companion apps", "Offline media packages", "Schools with no hosted services"],
      risks: [
        "Installer and device support costs arrive early.",
        "Backup, restore, export, and yearly update procedures must be designed.",
        "Printed QR routes need deep-link and local fallback rules.",
      ],
      requiredBeforePilot: [
        "Define local backup and restore.",
        "Define teacher export flow.",
        "Define media bundle update procedure.",
        "Define hosted redirect fallback if printed QR codes are used.",
      ],
      notAllowedYet: ["Unbacked local-only progress records", "Manual file copying as a production update path"],
    },
    {
      optionId: "hybrid-hosted-registry-local-media",
      label: "Hybrid hosted registry plus local media bundle",
      status: "candidate",
      deploymentFit: "hybrid",
      costPosture: "controlled",
      whiteLabelFit: "Likely long-term fit for textbook publishers: stable hosted QR registry with optional local/offline media packages.",
      bestFor: [
        "Printed textbook QR permanence",
        "Publisher-managed audio/video assets",
        "Hosted reports with local media fallback",
      ],
      risks: [
        "Two deployment paths must stay in sync.",
        "Rights-managed media needs clear hosted and local bundle manifests.",
        "Support burden rises if local bundles are updated outside the platform.",
      ],
      requiredBeforePilot: [
        "Define route registry ownership.",
        "Define media manifest versioning.",
        "Define local bundle integrity checks.",
      ],
      notAllowedYet: ["Unversioned local media folders", "QR targets that point directly to local files"],
    },
  ],
};
