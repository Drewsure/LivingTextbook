export const PERSISTENCE_JSON_BODY_LIMIT_BYTES = 128 * 1024;
export const SESSION_JSON_BODY_LIMIT_BYTES = 8 * 1024;

type JsonBodyFailure = {
  ok: false;
  status: 400 | 413 | 415;
  errors: string[];
};

type JsonBodySuccess<T> = {
  ok: true;
  value: T;
};

export type JsonBodyResult<T> = JsonBodyFailure | JsonBodySuccess<T>;

export type MutationOriginResult =
  | { valid: true }
  | { valid: false; status: 403; errors: string[] };

export function validateSameOriginMutation(request: Request): MutationOriginResult {
  const origin = request.headers.get("origin")?.trim();
  if (!origin) {
    return { valid: false, status: 403, errors: ["Browser mutations require an origin-bound request."] };
  }

  try {
    const requestOrigin = new URL(request.url).origin;
    if (origin !== requestOrigin) {
      return { valid: false, status: 403, errors: ["Cross-origin mutations are not permitted."] };
    }
  } catch {
    return { valid: false, status: 403, errors: ["The mutation origin could not be verified."] };
  }

  return { valid: true };
}

export async function readJsonRequestBody<T>(
  request: Request,
  maxBytes: number,
  label: string,
): Promise<JsonBodyResult<T>> {
  const mediaType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (mediaType !== "application/json") {
    return { ok: false, status: 415, errors: [`${label} must use the application/json content type.`] };
  }

  const declaredLength = request.headers.get("content-length");
  if (declaredLength && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > maxBytes)) {
    return { ok: false, status: 413, errors: [`${label} exceeds the ${maxBytes}-byte request limit.`] };
  }

  let source: string;
  try {
    source = await request.text();
  } catch {
    return { ok: false, status: 400, errors: [`${label} could not be read.`] };
  }

  const byteLength = new TextEncoder().encode(source).byteLength;
  if (byteLength > maxBytes) {
    return { ok: false, status: 413, errors: [`${label} exceeds the ${maxBytes}-byte request limit.`] };
  }

  try {
    return { ok: true, value: JSON.parse(source) as T };
  } catch {
    return { ok: false, status: 400, errors: [`${label} must be valid JSON.`] };
  }
}
