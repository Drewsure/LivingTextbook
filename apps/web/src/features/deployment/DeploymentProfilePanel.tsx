import { Card, StatusPill } from "@living-textbook/ui";
import type { DeploymentReadinessStatus, TenantDeploymentProfile } from "@/data/sampleDeploymentProfiles";

interface DeploymentProfilePanelProps {
  profiles: TenantDeploymentProfile[];
}

const statusTone: Record<DeploymentReadinessStatus, "neutral" | "success" | "warning"> = {
  "ready-for-demo": "success",
  "needs-decision": "warning",
  future: "neutral",
};

export function DeploymentProfilePanel({ profiles }: DeploymentProfilePanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Deployment profiles</p>
          <h2 className="mt-1 text-lg font-bold">Hosted, local, and packaged paths</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
            A white-label product can support hosted and closed deployments, but each path has different costs, route behavior, media handling, update rules, and reporting responsibilities.
          </p>
        </div>
        <StatusPill label={`${profiles.length} profiles`} tone="success" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {profiles.map((profile) => (
          <article key={profile.profileId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{profile.channel}</p>
                <h3 className="mt-1 text-base font-bold">{profile.label}</h3>
              </div>
              <StatusPill label={profile.recommendedForPilot ? "Pilot pick" : "Later"} tone={profile.recommendedForPilot ? "success" : "neutral"} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{profile.summary}</p>
            <div className="mt-4 grid gap-3">
              {profile.requirements.map((requirement) => (
                <section key={requirement.requirementId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h4 className="text-sm font-bold">{requirement.label}</h4>
                    <StatusPill label={requirement.status} tone={statusTone[requirement.status]} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{requirement.note}</p>
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
