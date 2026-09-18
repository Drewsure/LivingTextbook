const baseUrl = process.env.LIVING_TEXTBOOK_RUNTIME_URL?.trim();
const tenantId = process.env.LIVING_TEXTBOOK_RUNTIME_TENANT?.trim() || "sample-publisher";
const otherTenantId = process.env.LIVING_TEXTBOOK_RUNTIME_OTHER_TENANT?.trim() || "other-tenant";
const reviewCode = process.env.LIVING_TEXTBOOK_RUNTIME_REVIEW_CODE ?? "";
const revokedBaseUrl = process.env.LIVING_TEXTBOOK_REVOKED_RUNTIME_URL?.trim();

if (!baseUrl || !reviewCode) {
  console.error("FAIL runtime verifier requires LIVING_TEXTBOOK_RUNTIME_URL and LIVING_TEXTBOOK_RUNTIME_REVIEW_CODE.");
  process.exitCode = 1;
} else {
  const failures = [];

  function expect(condition, message) {
    if (!condition) failures.push(message);
  }

  async function request(path, options = {}) {
    const response = await fetch(new URL(path, `${baseUrl.replace(/\/$/, "")}/`), options);
    let body = {};
    try {
      body = await response.json();
    } catch {
      failures.push(`${path}: response was not JSON`);
    }
    return { response, body };
  }

  try {
    const login = await request("/api/teacher/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId, reviewCode }),
    });
    expect(login.response.status === 200, `teacher sign-in expected 200, received ${login.response.status}`);
    expect(login.body.status === "authenticated", "teacher sign-in did not authenticate");
    const setCookie = login.response.headers.get("set-cookie") ?? "";
    const cookie = setCookie.split(";")[0];
    expect(cookie.startsWith("living-textbook-teacher-session="), "teacher sign-in did not return the expected session cookie");

    const cookieHeaders = { cookie };
    const session = await request("/api/teacher/session", { headers: cookieHeaders });
    expect(session.response.status === 200, `same-tenant session status expected 200, received ${session.response.status}`);
    expect(session.body.status === "authenticated" && session.body.tenantId === tenantId, "same-tenant session status was not tenant-bound");

    const status = await request(`/api/persistence/status?tenantId=${encodeURIComponent(tenantId)}`, { headers: cookieHeaders });
    expect(status.response.status === 200, `same-tenant status expected 200, received ${status.response.status}`);
    expect(status.body.status !== "unauthorized", "same-tenant status remained unauthorized");

    const operations = await request(`/api/persistence/operations?tenantId=${encodeURIComponent(tenantId)}`, { headers: cookieHeaders });
    expect(operations.response.status === 200, `same-tenant operations expected 200, received ${operations.response.status}`);
    expect(operations.body.status !== "unauthorized", "same-tenant operations remained unauthorized");

    const crossTenantStatus = await request(`/api/persistence/status?tenantId=${encodeURIComponent(otherTenantId)}`, { headers: cookieHeaders });
    expect(crossTenantStatus.response.status === 401, `cross-tenant status expected 401, received ${crossTenantStatus.response.status}`);
    expect(!Object.hasOwn(crossTenantStatus.body, "provider"), "cross-tenant status disclosed provider");

    const crossTenantOperations = await request(`/api/persistence/operations?tenantId=${encodeURIComponent(otherTenantId)}`, { headers: cookieHeaders });
    expect(crossTenantOperations.response.status === 401, `cross-tenant operations expected 401, received ${crossTenantOperations.response.status}`);
    expect(!Object.hasOwn(crossTenantOperations.body, "provider"), "cross-tenant operations disclosed provider");

    if (revokedBaseUrl) {
      const revokedSession = await fetch(new URL("/api/teacher/session", `${revokedBaseUrl.replace(/\/$/, "")}/`), { headers: cookieHeaders });
      expect(revokedSession.status === 401, `revoked deployment session expected 401, received ${revokedSession.status}`);
      const revokedStatus = await fetch(new URL(`/api/persistence/status?tenantId=${encodeURIComponent(tenantId)}`, `${revokedBaseUrl.replace(/\/$/, "")}/`), { headers: cookieHeaders });
      expect(revokedStatus.status === 401, `revoked deployment status expected 401, received ${revokedStatus.status}`);
    }
  } catch (error) {
    failures.push(`runtime request failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (failures.length > 0) {
    console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
    process.exitCode = 1;
  } else {
    console.log(`PASS teacher operations runtime authorization for ${tenantId}; cross-tenant reads blocked${revokedBaseUrl ? "; revoked deployment blocked" : ""}.`);
  }
}
