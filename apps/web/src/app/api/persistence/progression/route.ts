import { NextResponse } from "next/server";
import {
  createHostedProgressionPersistenceRecord,
  validateHostedProgressionPersistenceRead,
  validateHostedProgressionPersistenceWrite,
  type HostedProgressionPersistenceRecord,
  type HostedProgressionPersistenceWriteRequest,
} from "@living-textbook/content-model";

const globalStore = globalThis as typeof globalThis & {
  __livingTextbookHostedProgressionRehearsal?: Map<string, HostedProgressionPersistenceRecord>;
};
const store = globalStore.__livingTextbookHostedProgressionRehearsal ??= new Map();

export async function POST(request: Request) {
  let body: HostedProgressionPersistenceWriteRequest;
  try {
    body = await request.json() as HostedProgressionPersistenceWriteRequest;
  } catch {
    return NextResponse.json({ status: "rejected", errors: ["Hosted progression request must be valid JSON."] }, { status: 400 });
  }

  const validation = validateHostedProgressionPersistenceWrite(body);
  if (!validation.valid) {
    return NextResponse.json({ status: "blocked", durability: "non-durable-rehearsal", errors: validation.errors }, { status: 423 });
  }

  if (process.env.LIVING_TEXTBOOK_HOSTED_PERSISTENCE_REHEARSAL !== "true") {
    return NextResponse.json({
      status: "blocked",
      durability: "non-durable-rehearsal",
      errors: ["Hosted progression rehearsal writes are disabled by default. Enable the explicit development policy gate before writing."],
    }, { status: 423 });
  }

  const record = createHostedProgressionPersistenceRecord({ request: body, writtenAt: new Date().toISOString() });
  const existing = store.get(record.idempotencyKey);
  if (existing) {
    return NextResponse.json({ status: "accepted", idempotent: true, record: existing });
  }
  store.set(record.idempotencyKey, record);
  return NextResponse.json({ status: "accepted", idempotent: false, record });
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const lookup = {
    tenantId: url.searchParams.get("tenantId") ?? "",
    packageId: url.searchParams.get("packageId") ?? "",
    launchCode: url.searchParams.get("launchCode") ?? "",
    studentSessionId: url.searchParams.get("studentSessionId") ?? "",
  };
  const record = [...store.values()].find((candidate) =>
    candidate.tenantId === lookup.tenantId
      && candidate.packageId === lookup.packageId
      && candidate.launchCode === lookup.launchCode
      && candidate.studentSessionId === lookup.studentSessionId,
  );
  const validation = validateHostedProgressionPersistenceRead(lookup, record);
  if (!validation.valid) {
    return NextResponse.json({ status: "not-found", errors: validation.errors }, { status: 404 });
  }
  return NextResponse.json({ status: "available", durability: record?.durability, record });
}
