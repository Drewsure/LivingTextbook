import { AppShell } from "@/components/layout/AppShell";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import { sampleWhiteLabelReleaseReadiness, sampleWhiteLabelReleaseReadinessErrors } from "@/data/sampleWhiteLabelReleaseReadiness";
import { WhiteLabelReleaseReadinessPanel, type WhiteLabelReleaseReviewLink } from "@/features/release/WhiteLabelReleaseReadinessPanel";

const reviewLinks: WhiteLabelReleaseReviewLink[] = [
  { href: "/teacher/game-readiness", label: "Game readiness", detail: "Canonical engines and isolated Z.ai evidence" },
  { href: "/teacher/persistence", label: "Persistence", detail: "Provider, policy, and durable-write gates" },
  { href: `/teacher/pilot/requirements/${encodeURIComponent(samplePublisherTenant.id)}`, label: "Partner requirements", detail: "Publisher evidence and school decisions" },
  { href: "/teacher/intake", label: "Content intake", detail: "Sources, media, routes, and release records" },
];

export default function TeacherReleaseReadinessPage() {
  return (
    <AppShell tenant={samplePublisherTenant}>
      <WhiteLabelReleaseReadinessPanel
        readiness={sampleWhiteLabelReleaseReadiness}
        errors={sampleWhiteLabelReleaseReadinessErrors}
        reviewLinks={reviewLinks}
      />
    </AppShell>
  );
}
