import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { findSampleTeacherDraftPackage } from "@/data/sampleTeacherDraftPackage";
import { TeacherDraftPackagePreviewPanel } from "@/features/content-intake/TeacherDraftPackagePreviewPanel";
import { TeacherDraftPersistenceAdmissionPanel } from "@/features/content-intake/TeacherDraftPersistenceAdmissionPanel";
import { sampleTeacherDraftPersistencePreflight, sampleTeacherDraftPersistencePreflightErrors } from "@/data/sampleTeacherDraftPersistencePreflight";
import { sampleTeacherDraftOwnerPolicyBinding, sampleTeacherDraftOwnerPolicyBindingErrors } from "@/data/sampleTeacherDraftOwnerPolicyBinding";
import { TeacherDraftOwnerPolicyBindingPanel } from "@/features/content-intake/TeacherDraftOwnerPolicyBindingPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

export default async function TeacherDraftPackagePage({
  params,
}: {
  params: Promise<{ draftId: string }>;
}) {
  const { draftId } = await params;
  const draft = findSampleTeacherDraftPackage(draftId);

  if (!draft) {
    notFound();
  }

  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5">
        <TeacherDraftPersistenceAdmissionPanel preflight={sampleTeacherDraftPersistencePreflight} errors={sampleTeacherDraftPersistencePreflightErrors} />
        <TeacherDraftOwnerPolicyBindingPanel binding={sampleTeacherDraftOwnerPolicyBinding} errors={sampleTeacherDraftOwnerPolicyBindingErrors} />
        <TeacherDraftPackagePreviewPanel draft={draft} />
      </div>
    </AppShell>
  );
}
