import { Card, StatusPill } from "@living-textbook/ui";

interface AiGeneratorSection {
  href: string;
  label: string;
  summary: string;
  status: "review-only" | "blocked";
}

interface AiGeneratorSectionHeaderProps {
  eyebrow: string;
  title: string;
  summary: string;
  status: AiGeneratorSection["status"];
}

const sections: AiGeneratorSection[] = [
  {
    href: "#generator-request",
    label: "Request setup",
    summary: "Prompt, cost, request, audio, gamification, rewards, and engine binding.",
    status: "review-only",
  },
  {
    href: "#prototype-review",
    label: "Prototype review",
    summary: "External build brief, return review, wrapper, fixture, event, audio, mobile, and scoring evidence.",
    status: "review-only",
  },
  {
    href: "#integration-gates",
    label: "Integration gates",
    summary: "Codex decision, all-evidence readiness, and patch proposal preview.",
    status: "blocked",
  },
  {
    href: "#package-review",
    label: "Package review",
    summary: "Verifier packet, mode pathway, manifest, promotion, publish readiness, and release candidate.",
    status: "blocked",
  },
  {
    href: "#draft-repair",
    label: "Draft repair",
    summary: "Draft JSON preview and correction queue before any live generation or assignment.",
    status: "blocked",
  },
];

const statusLabel: Record<AiGeneratorSection["status"], string> = {
  "review-only": "Review only",
  blocked: "Blocked",
};

export function AiGeneratorSectionNav() {
  return (
    <Card className="space-y-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Generator route map</p>
          <h2 className="mt-1 text-lg font-bold">AI generator review sections</h2>
          <p className="mt-2 max-w-3xl text-sm text-[var(--tenant-muted)]">
            Use this map to review the generator from request setup through prototype evidence, integration gates,
            package review, and draft repair without enabling live AI generation or student assignment.
          </p>
        </div>
        <StatusPill label="No live generation" tone="warning" />
      </div>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
        {sections.map((section) => (
          <a
            key={section.href}
            href={section.href}
            className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3 text-sm transition hover:border-[var(--tenant-primary)] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--tenant-primary)]"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold text-[var(--tenant-text)]">{section.label}</span>
              <StatusPill label={statusLabel[section.status]} tone={section.status === "blocked" ? "warning" : "neutral"} />
            </div>
            <p className="mt-2 text-xs text-[var(--tenant-muted)]">{section.summary}</p>
          </a>
        ))}
      </div>
    </Card>
  );
}

export function AiGeneratorSectionHeader({
  eyebrow,
  title,
  summary,
  status,
}: AiGeneratorSectionHeaderProps) {
  return (
    <div className="border-b border-[var(--tenant-border)] pb-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-bold text-[var(--tenant-text)]">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm text-[var(--tenant-muted)]">{summary}</p>
        </div>
        <StatusPill label={statusLabel[status]} tone={status === "blocked" ? "warning" : "neutral"} />
      </div>
    </div>
  );
}
