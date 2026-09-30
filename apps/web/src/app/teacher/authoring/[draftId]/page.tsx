import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { findSampleTeacherDraftPackage } from "@/data/sampleTeacherDraftPackage";
import { TeacherDraftPackagePreviewPanel } from "@/features/content-intake/TeacherDraftPackagePreviewPanel";
import { TeacherDraftPersistenceAdmissionPanel } from "@/features/content-intake/TeacherDraftPersistenceAdmissionPanel";
import { sampleTeacherDraftPersistencePreflight, sampleTeacherDraftPersistencePreflightErrors } from "@/data/sampleTeacherDraftPersistencePreflight";
import { sampleTeacherDraftOwnerPolicyBinding, sampleTeacherDraftOwnerPolicyBindingErrors } from "@/data/sampleTeacherDraftOwnerPolicyBinding";
import { TeacherDraftOwnerPolicyBindingPanel } from "@/features/content-intake/TeacherDraftOwnerPolicyBindingPanel";
import { sampleTeacherDraftAcceptanceReadiness, sampleTeacherDraftAcceptanceReadinessErrors } from "@/data/sampleTeacherDraftAcceptanceReadiness";
import { TeacherDraftAcceptanceReadinessPanel } from "@/features/content-intake/TeacherDraftAcceptanceReadinessPanel";
import { resolveTenantConfig } from "@/features/tenant/tenantResolver";

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

  const tenant = resolveTenantConfig(draft.tenantId);

  if (!tenant) {
    notFound();
  }

  return (
    <AppShell tenant={tenant}>
      <div className="grid gap-5">
        <TeacherDraftPersistenceAdmissionPanel preflight={sampleTeacherDraftPersistencePreflight} errors={sampleTeacherDraftPersistencePreflightErrors} />
        <TeacherDraftOwnerPolicyBindingPanel binding={sampleTeacherDraftOwnerPolicyBinding} errors={sampleTeacherDraftOwnerPolicyBindingErrors} />
        <TeacherDraftAcceptanceReadinessPanel readiness={sampleTeacherDraftAcceptanceReadiness} errors={sampleTeacherDraftAcceptanceReadinessErrors} />
        <TeacherDraftPackagePreviewPanel draft={draft} />
      </div>
    </AppShell>
  );
}
