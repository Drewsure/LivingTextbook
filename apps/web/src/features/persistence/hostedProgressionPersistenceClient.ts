export interface HostedProgressionReadRequest {
  tenantId: string;
  packageId: string;
  launchCode: string;
  studentSessionId: string;
  accessMode?: "student-continuity" | "teacher-review-probe";
}

import type { HostedProgressionPersistenceRecord, ProgressEventStreamPersistenceRecord } from "@living-textbook/content-model";

export interface HostedProgressionReadResult {
  status: "available" | "not-found" | "unauthorized" | "blocked" | "unavailable" | "error";
  provider?: "process-memory" | "sqlite";
  durability?: "non-durable-rehearsal" | "durable-managed";
  record?: HostedProgressionPersistenceRecord;
  errors: string[];
}

export async function readHostedProgressionContinuity(
  request: HostedProgressionReadRequest,
): Promise<HostedProgressionReadResult> {
  const query = new URLSearchParams({
    tenantId: request.tenantId,
    packageId: request.packageId,
    launchCode: request.launchCode,
    studentSessionId: request.studentSessionId,
    accessMode: request.accessMode ?? "student-continuity",
  });
  try {
    const response = await fetch(`/api/persistence/progression?${query.toString()}`, { method: "GET", credentials: "same-origin", cache: "no-store" });
    const body = await readJson(response);
    if (response.status === 401 || body.status === "unauthorized") {
      return { status: "unauthorized", provider: body.provider, durability: body.durability, record: undefined, errors: body.errors ?? ["Hosted progression read authorization is required."] };
    }
    if (response.status === 423 || body.status === "blocked") {
      return { status: "blocked", provider: body.provider, durability: body.durability, record: undefined, errors: body.errors ?? ["Hosted progression is blocked by deployment policy."] };
    }
    if (response.status === 503 || body.status === "unavailable") {
      return { status: "unavailable", provider: body.provider, durability: body.durability, record: undefined, errors: body.errors ?? ["Hosted progression is temporarily unavailable."] };
    }
    if (response.status === 404 || body.status === "not-found") {
      return { status: "not-found", provider: body.provider, durability: body.durability, record: body.record, errors: body.errors ?? ["No hosted progression record was found."] };
    }
    if (!response.ok) return { status: "error", provider: body.provider, durability: body.durability, record: undefined, errors: body.errors ?? [`Hosted progression read failed with HTTP ${response.status}.`] };
    return { status: "available", provider: body.provider, durability: body.durability, record: body.record, errors: body.errors ?? [] };
  } catch {
    return { status: "error", errors: ["The hosted progression adapter could not be reached."] };
  }
}

export async function writeHostedProgressionContinuity(request: {
  expectedTenantId: string;
  expectedPackageId: string;
  expectedLaunchCode: string;
  expectedStudentSessionId: string;
  envelope: unknown;
}) {
  try {
    const response = await fetch("/api/persistence/progression", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...request, requestedMode: "durable-managed" }),
    });
    const body = await readJson(response);
    const status = body.status ?? (response.ok ? "accepted" : response.status === 401 ? "unauthorized" : response.status === 409 ? "conflict" : response.status === 423 ? "blocked" : response.status === 503 ? "unavailable" : "error");
    return { status, idempotent: body.idempotent === true, errors: body.errors ?? [] };
  } catch {
    return { status: "unavailable", idempotent: false, errors: ["The hosted progression adapter could not be reached."] };
  }
}

export interface HostedProgressEventReviewRequest {
  tenantId: string;
  packageId: string;
  launchCode: string;
}

export interface HostedProgressEventReviewResult {
  status: "available" | "unauthorized" | "blocked" | "unavailable" | "error";
  provider?: "process-memory" | "sqlite";
  durability?: "non-durable-rehearsal" | "durable-managed";
  records: ProgressEventStreamPersistenceRecord[];
  errors: string[];
}

export async function readHostedProgressEventStreams(
  request: HostedProgressEventReviewRequest,
): Promise<HostedProgressEventReviewResult> {
  const query = new URLSearchParams({
    tenantId: request.tenantId,
    packageId: request.packageId,
    launchCode: request.launchCode,
    accessMode: "teacher-review-probe",
  });
  try {
    const response = await fetch(`/api/persistence/events?${query.toString()}`, { method: "GET", credentials: "same-origin", cache: "no-store" });
    const body = await readEventJson(response);
    const records = Array.isArray(body.records) ? body.records : [];
    if (response.status === 401 || body.status === "unauthorized") {
      return { status: "unauthorized", provider: body.provider, durability: body.durability, records: [], errors: body.errors ?? ["Teacher review authorization is required."] };
    }
    if (response.status === 423 || body.status === "blocked") {
      return { status: "blocked", provider: body.provider, durability: body.durability, records: [], errors: body.errors ?? ["Event review is blocked by deployment policy."] };
    }
    if (response.status === 503 || body.status === "unavailable") {
      return { status: "unavailable", provider: body.provider, durability: body.durability, records: [], errors: body.errors ?? ["Event review storage is temporarily unavailable."] };
    }
    if (!response.ok) return { status: "error", provider: body.provider, durability: body.durability, records: [], errors: body.errors ?? [`Event review failed with HTTP ${response.status}.`] };
    return { status: "available", provider: body.provider, durability: body.durability, records, errors: body.errors ?? [] };
  } catch {
    return { status: "error", records: [], errors: ["The hosted event review endpoint could not be reached."] };
  }
}

type HostedProgressionResponse = {
  status?: string;
  provider?: "process-memory" | "sqlite";
  durability?: "non-durable-rehearsal" | "durable-managed";
  record?: HostedProgressionPersistenceRecord;
  errors?: string[];
  idempotent?: boolean;
};

type HostedProgressEventResponse = {
  status?: string;
  provider?: "process-memory" | "sqlite";
  durability?: "non-durable-rehearsal" | "durable-managed";
  records?: ProgressEventStreamPersistenceRecord[];
  errors?: string[];
};

async function readJson(response: Response): Promise<HostedProgressionResponse> {
  try {
    return await response.json() as HostedProgressionResponse;
  } catch {
    return { errors: [`Hosted progression returned an invalid response (HTTP ${response.status}).`] };
  }
}

async function readEventJson(response: Response): Promise<HostedProgressEventResponse> {
  try {
    return await response.json() as HostedProgressEventResponse;
  } catch {
    return { errors: [`Hosted event review returned an invalid response (HTTP ${response.status}).`] };
  }
}
