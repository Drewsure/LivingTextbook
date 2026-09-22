import { AppShell } from "@/components/layout/AppShell";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import { sampleWhiteLabelReleaseReadiness, sampleWhiteLabelReleaseReadinessErrors } from "@/data/sampleWhiteLabelReleaseReadiness";
import { WhiteLabelReleaseReadinessPanel } from "@/features/release/WhiteLabelReleaseReadinessPanel";

export default function TeacherReleaseReadinessPage() {
  return (
    <AppShell tenant={samplePublisherTenant}>
      <WhiteLabelReleaseReadinessPanel
        readiness={sampleWhiteLabelReleaseReadiness}
        errors={sampleWhiteLabelReleaseReadinessErrors}
      />
    </AppShell>
  );
}
