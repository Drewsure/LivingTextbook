import { AppShell } from "@/components/layout/AppShell";
import { sampleTeacherDraftReviewQueue } from "@/data/sampleTeacherDraftReviewQueue";
import { TeacherDraftReviewQueuePanel } from "@/features/content-intake/TeacherDraftReviewQueuePanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default function TeacherDraftReviewQueuePage() {
  return (
    <AppShell tenant={samplePublisherTenant}>
      <TeacherDraftReviewQueuePanel queue={sampleTeacherDraftReviewQueue} />
    </AppShell>
  );
}
