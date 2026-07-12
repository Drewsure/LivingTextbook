import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleTeacherUnitReview } from "@/data/sampleTeacherUnitReview";
import { TeacherUnitReviewPanel } from "@/features/teacher/TeacherUnitReviewPanel";

interface TeacherUnitReviewPageProps {
  params: Promise<{ unitKey: string }>;
}

export default async function TeacherUnitReviewPage({ params }: TeacherUnitReviewPageProps) {
  const { unitKey } = await params;
  const review = resolveSampleTeacherUnitReview(unitKey);

  if (!review) {
    notFound();
  }

  return (
    <AppShell tenant={review.tenant}>
      <TeacherUnitReviewPanel review={review} />
    </AppShell>
  );
}
