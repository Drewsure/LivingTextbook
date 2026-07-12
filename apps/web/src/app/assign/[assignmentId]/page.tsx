import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSamplePrivateAssignmentLink } from "@/data/samplePrivateAssignmentLinks";
import { PrivateAssignmentLinkPanel } from "@/features/routes/PrivateAssignmentLinkPanel";

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
      <PrivateAssignmentLinkPanel assignment={assignment} />
    </AppShell>
  );
}
