import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiGeneratorAudioCoveragePlan,
  AiGeneratorAudioCoverageStatus,
  AiGeneratorAudioCueKind,
} from "@/data/sampleAiGeneratorAudioCoveragePlan";

interface AiGeneratorAudioCoveragePlanPanelProps {
  plans: AiGeneratorAudioCoveragePlan[];
}

const statusTone: Record<AiGeneratorAudioCoverageStatus, "neutral" | "warning"> = {
  "required-not-approved": "warning",
  planned: "neutral",
  "support-only": "neutral",
  blocked: "warning",
};

const cueOrder: AiGeneratorAudioCueKind[] = [
  "term",
  "sentence",
  "instruction",
  "feedback",
  "control",
  "support-language",
  "background-media",
];

export function AiGeneratorAudioCoveragePlanPanel({ plans }: AiGeneratorAudioCoveragePlanPanelProps) {
  const requiredCueCount = plans.reduce(
    (total, plan) => total + plan.cues.filter((cue) => cue.status === "required-not-approved").length,
    0,
  );
  const blockedActionCount = plans.reduce((total, plan) => total + plan.blockedActions.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI audio coverage planner</p>
          <h2 className="mt-1 text-lg font-bold">Target-language audio map</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Generated game drafts must list every learner-facing text cue before voice generation, imported media binding,
            verifier submission, or student route creation can be considered.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Audio-first generation gate" tone="warning" />
          <StatusPill label={`${requiredCueCount} cue(s) need review`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {plans.map((plan) => (
          <article key={plan.planId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{plan.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{plan.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
              </div>
              <StatusPill label={`${blockedActionCount} blocked action(s)`} tone="warning" />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <AudioPolicyCard title="Target language" value={plan.targetLanguage} />
              <AudioPolicyCard title="Assist language boundary" value={plan.assistLanguagePolicy} />
              <AudioPolicyCard title="Learning audio priority" value={plan.learningAudioPriorityRule} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <AudioList title="Required audio records" items={plan.requiredRecords} />
              <AudioList title="Blocked audio actions" items={plan.blockedActions} tone="warning" />
            </div>

            <div className="mt-4 grid gap-3">
              {cueOrder.map((kind) => {
                const cues = plan.cues.filter((cue) => cue.kind === kind);

                if (cues.length === 0) {
                  return null;
                }

                return (
                  <section key={kind} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-[var(--tenant-text)]">{cues[0]?.label}</h4>
                      <StatusPill label={`${cues.length} cue(s)`} tone="neutral" />
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {cues.map((cue) => (
                        <AudioCueCard key={cue.cueId} cue={cue} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function AudioPolicyCard({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function AudioList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function AudioCueCard({ cue }: { cue: AiGeneratorAudioCoveragePlan["cues"][number] }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{cue.modeScope}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{cue.text}</h5>
        </div>
        <StatusPill label={cue.status} tone={statusTone[cue.status]} />
      </div>
      <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <div>
          <dt className="font-semibold text-[var(--tenant-text)]">Language</dt>
          <dd>{cue.language}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[var(--tenant-text)]">Progress policy</dt>
          <dd>{cue.progressPolicy}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[var(--tenant-text)]">Review note</dt>
          <dd>{cue.reviewNote}</dd>
        </div>
      </dl>
    </article>
  );
}
