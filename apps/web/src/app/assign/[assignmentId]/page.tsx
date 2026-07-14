import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSamplePrivateAssignmentLink } from "@/data/samplePrivateAssignmentLinks";
import { PrivateAssignmentLinkPanel } from "@/features/routes/PrivateAssignmentLinkPanel";
import { LaunchContextSafetyCard } from "@/features/student/components/LaunchContextSafetyCard";

interface PrivateAssignmentPageProps {
  params: Promise<{ assignmentId: string }>;
}

export default async function PrivateAssignmentPage({ params }: PrivateAssignmentPageProps) {
  const { assignmentId } = await params;
  const assignment = resolveSamplePrivateAssignmentLink(assignmentId);

  if (!assignment) {
    notFound();
  }

  return (
    <AppShell tenant={assignment.tenant}>
      <div className="grid gap-5">
        <LaunchContextSafetyCard
          title="Controlled assignment practice"
          accessLabel="Private assignment preview"
          reportLabel="Teacher-visible sample report only"
        />
        <PrivateAssignmentLinkPanel assignment={assignment} />
      </div>
    </AppShell>
  );
}
