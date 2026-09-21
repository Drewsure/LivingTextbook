import {
  createReviewOnlyTeacherReportPersistenceAdapter,
  createTeacherLaunchReportAggregation,
  createTeacherReportPackageSnapshot,
  type TeacherReportPersistenceRuntimeResult,
  type TeacherReportPersistenceRuntimeRequest,
  type TeacherSessionMonitorContext,
} from "@living-textbook/content-model";
import { samplePersistenceAdapterPlans } from "./samplePersistenceAdapterPlan";
import { sampleDurableRecordContracts } from "./samplePersistencePlan";
import { sampleProgressEventTaxonomyRegistry } from "./sampleProgressEventTaxonomy";

function getHostedReportIntent() {
  const intent = samplePersistenceAdapterPlans
    .find((plan) => plan.planId === "hosted-pilot-adapter")
    ?.writeIntents.find((candidate) => candidate.category === "teacher-report-package");

  if (!intent) {
    throw new Error("Hosted teacher report persistence intent is missing from the sample plan.");
  }

  return intent;
}

function getReportRecord() {
  const record = sampleDurableRecordContracts.find((candidate) => candidate.category === "teacher-report-package");

  if (!record) {
    throw new Error("Teacher report package durable record is missing from the sample plan.");
  }

  return record;
}

export function resolveSampleTeacherReportPersistenceRehearsal(
  context: TeacherSessionMonitorContext,
): TeacherReportPersistenceRuntimeResult {
  const reportPlan = context.reportExportPlan;
  const reportScope = {
    tenantId: context.tenant.id,
    packageId: context.contentPackage.meta.packageId,
    launchCode: context.launchSession.launchCode,
  };
  const snapshot = createTeacherReportPackageSnapshot({
    scope: reportScope,
    deploymentMode: "hosted-managed",
    createdAt: context.launchSession.openedAt,
    report: createTeacherLaunchReportAggregation([], reportScope),
    boundary: context.reportPackageBoundary,
    reportPlan,
    eventAcceptance: context.eventAcceptanceGate,
    eventEnvelope: context.eventEnvelopeGate,
  });
  const request: TeacherReportPersistenceRuntimeRequest = {
    operation: "export",
    reportRequest: {
      tenantId: context.tenant.id,
      launchCode: context.launchSession.launchCode,
      targetLanguage: context.tenant.languageSettings?.targetLanguage ?? "en",
      format: reportPlan.allowedFormats[0] ?? "csv-summary",
      scopes: reportPlan.includedScopes.length > 0 ? reportPlan.includedScopes : ["teacher-summary"],
      reportPlan,
      taxonomy: sampleProgressEventTaxonomyRegistry,
      eventEnvelopes: [],
      learnerIdentityMode: "pseudonymous-slots-only",
      teacherRoleVerified: false,
      policyAccepted: reportPlan.policyAccepted,
      persistenceReady: reportPlan.persistenceReady,
      exportApproved: false,
      releaseApproved: false,
      includesRawAudio: false,
      includesTranscripts: false,
    },
    persistenceIntent: getHostedReportIntent(),
    durableRecord: getReportRecord(),
    snapshot,
  };

  return createReviewOnlyTeacherReportPersistenceAdapter().execute(request);
}
