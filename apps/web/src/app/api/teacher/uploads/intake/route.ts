import { NextResponse } from "next/server";
import {
  getUploadQuarantineChannelMimeTypes,
  type UploadQuarantineChannel,
} from "@living-textbook/content-model";
import { hasTeacherOperationsReadAuthorization } from "@/server/persistence/teacherOperationsAuthorization";
import { validateSameOriginMutation } from "@/server/persistence/requestBoundary";
import { writeQuarantineUpload } from "@/server/uploads/quarantineUploadStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_ENABLED_ENV = "LIVING_TEXTBOOOK_REVIEW_UPLOADS_ENABLED";

export function GET() {
  return json({
    status: uploadsEnabled() ? "review-only-quarantine-intake" : "disabled-review-only-quarantine-intake",
    enabled: uploadsEnabled(),
    storageMode: "quarantine-only",
    scanStatus: "pending",
    rightsStatus: "unknown",
    sourceReviewStatus: "unreviewed",
    promotionAllowed: false,
    studentFacingUseAllowed: false,
    learnerMediaIncluded: false,
    privacy: "This endpoint exposes no raw media, learner records, download URL, database path, or student-facing route.",
    enablement: `Explicit server setting ${UPLOAD_ENABLED_ENV}=true is required; the default remains disabled.`,
  });
}

export async function POST(request: Request) {
  if (!uploadsEnabled()) {
    return json({ status: "blocked", errors: [`Quarantine upload intake is disabled until ${UPLOAD_ENABLED_ENV}=true is explicitly configured.`] }, 423);
  }

  const mediaType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (mediaType !== "multipart/form-data") {
    return json({ status: "rejected", errors: ["Quarantine upload intake requires multipart/form-data."] }, 415);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ status: "rejected", errors: ["The multipart upload could not be read."] }, 400);
  }

  const tenantId = readFormText(formData, "tenantId", 160);
  const channelId = readFormText(formData, "channelId", 80) as UploadQuarantineChannel;
  const unitKey = readOptionalFormText(formData, "unitKey", 240);
  const file = formData.get("file");
  if (!tenantId || !isChannel(channelId) || !file || typeof file === "string") {
    return json({ status: "rejected", errors: ["tenantId, a supported channelId, and one file are required."] }, 400);
  }
  if (!file.name.trim()) return json({ status: "rejected", errors: ["The uploaded file must have a name."] }, 400);
  if (!Number.isSafeInteger(file.size) || file.size <= 0) return json({ status: "rejected", errors: ["The uploaded file must be non-empty."] }, 400);
  if (file.size > 256 * 1024 * 1024) return json({ status: "rejected", errors: ["The uploaded file exceeds the 256 MiB quarantine limit."] }, 413);
  if (!getUploadQuarantineChannelMimeTypes(channelId).includes(file.type)) {
    return json({ status: "rejected", errors: ["The file MIME type is not allowed for the selected upload channel."] }, 415);
  }

  const origin = validateSameOriginMutation(request);
  const tokenAuthorized = hasConfiguredUploadToken(request);
  if (!tokenAuthorized && !origin.valid) return json({ status: "unauthorized", errors: origin.errors }, origin.status);
  if (!tokenAuthorized && !hasTeacherOperationsReadAuthorization(request, tenantId)) {
    return json({ status: "unauthorized", errors: ["Tenant-scoped teacher or service authorization is required for quarantine intake."] }, 401);
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = await writeQuarantineUpload({
      tenantId,
      channelId,
      unitKey,
      fileName: file.name,
      mimeType: file.type,
      bytes,
    });
    return json({
      status: "accepted-quarantine",
      quarantineId: result.quarantineId,
      record: result.record,
      promotionAllowed: false,
      studentFacingUseAllowed: false,
      nextGate: result.record.nextGate,
    }, 201);
  } catch (error) {
    return json({ status: "blocked", errors: [error instanceof Error ? error.message : "The quarantine write failed."] }, 500);
  }
}

function uploadsEnabled(): boolean {
  return process.env[UPLOAD_ENABLED_ENV] === "true";
}

function hasConfiguredUploadToken(request: Request): boolean {
  const configuredToken = process.env.LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN?.trim();
  return Boolean(configuredToken && request.headers.get("authorization") === `Bearer ${configuredToken}`);
}

function readFormText(formData: FormData, name: string, maxLength: number): string {
  const value = formData.get(name);
  return typeof value === "string" && value.trim().length <= maxLength ? value.trim() : "";
}

function readOptionalFormText(formData: FormData, name: string, maxLength: number): string | undefined {
  const value = formData.get(name);
  if (value === null || value === "") return undefined;
  const text = readFormText(formData, name, maxLength);
  return text || undefined;
}

function isChannel(value: string): value is UploadQuarantineChannel {
  return ["source-pdf-text-upload", "labelled-diagram-image-upload", "audio-music-upload", "video-upload"].includes(value);
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
