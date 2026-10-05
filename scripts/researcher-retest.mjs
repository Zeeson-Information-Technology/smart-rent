const baseUrl = process.env.SMARTRENT_BASE_URL;
const password = process.env.SMARTRENT_DEMO_PASSWORD;

if (!baseUrl || !password) {
  throw new Error(
    "Set SMARTRENT_BASE_URL and SMARTRENT_DEMO_PASSWORD before running this script.",
  );
}

const environment = baseUrl.includes("localhost") ? "LOCAL" : "VERCEL";
let failures = 0;

const landlord = await login("landlord@smartrent.demo");
const tenant = await login("tenant@smartrent.demo");
const admin = await login("admin@smartrent.demo");
const landlordSession = await json("/api/auth/session", landlord);
const tenantSession = await json("/api/auth/session", tenant);
const adminSession = await json("/api/auth/session", admin);

check(
  landlordSession.user?.role === "landlord",
  "AUTH-LANDLORD",
  landlordSession.user?.name,
);
check(
  tenantSession.user?.role === "tenant",
  "AUTH-TENANT",
  tenantSession.user?.name,
);
check(
  adminSession.user?.role === "admin",
  "AUTH-ADMIN",
  adminSession.user?.name,
);

const loginPage = await fetch(`${baseUrl}/login`).then((response) =>
  response.text(),
);
check(
  loginPage.includes(
    "Sign in securely to access your SmartRent property and tenancy workspace.",
  ),
  "COPY-LOGIN",
);

const landlordTenancies =
  (await json("/api/tenancies", landlord)).tenancies ?? [];
const tenantTenancies = (await json("/api/tenancies", tenant)).tenancies ?? [];
const tenantUser = tenantSession.user;
const jointTenancy = tenantTenancies.find((tenancy) =>
  tenancy.additionalTenants?.some(
    (member) =>
      member.tenantId === tenantUser.id ||
      member.email?.toLowerCase() === tenantUser.email.toLowerCase(),
  ),
);

check(
  Boolean(jointTenancy),
  "1.2-JOINT-TENANCY-ACCESS",
  jointTenancy?.property?.propertyName,
);

let qaInventoryId;
if (jointTenancy) {
  const formData = new FormData();
  formData.set("name", `QA researcher retest ${Date.now()}`);
  formData.set("category", "Appliance");
  formData.set("condition", "good");
  formData.set("quantity", "1");
  formData.set("notes", "Temporary automated QA record; safe to delete.");
  formData.set(
    "image",
    new File(
      [
        Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
          "base64",
        ),
      ],
      "qa-inventory.png",
      { type: "image/png" },
    ),
  );
  const created = await fetch(
    `${baseUrl}/api/properties/${jointTenancy.propertyId}/inventory`,
    {
      method: "POST",
      headers: { Cookie: cookieHeader(landlord) },
      body: formData,
    },
  );
  const createdData = await created.json();
  qaInventoryId = createdData.item?.id;
  check(created.status === 201, "1.1-INVENTORY-ITEM", `HTTP ${created.status}`);
  check(Boolean(createdData.item?.imageUrl), "1.1-INVENTORY-IMAGE");

  let items =
    (await json(`/api/properties/${jointTenancy.propertyId}/inventory`, tenant))
      .items ?? [];
  check(
    items.some((item) => item.id === qaInventoryId),
    "1.2-TENANT-INVENTORY-VIEW",
    `${items.length} item(s)`,
  );

  const acknowledgement = await fetch(
    `${baseUrl}/api/inventory/${qaInventoryId}/acknowledgement`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader(tenant),
      },
      body: JSON.stringify({
        tenancyId: jointTenancy.id,
        status: "confirmed",
        note: "Automated QA condition confirmation.",
      }),
    },
  );
  check(
    acknowledgement.ok,
    "1.2-TENANT-CONFIRM-CONDITION",
    `HTTP ${acknowledgement.status}`,
  );

  items =
    (await json(`/api/properties/${jointTenancy.propertyId}/inventory`, tenant))
      .items ?? [];
  const acknowledgements = items.flatMap((item) => item.acknowledgements ?? []);
  check(
    acknowledgements.some(
      (entry) =>
        entry.tenantId === tenantUser.id && entry.status === "confirmed",
    ),
    "1.2-CONFIRMATION-PERSISTENCE",
    `${acknowledgements.length} response(s)`,
  );

  const landlordItems =
    (
      await json(
        `/api/properties/${jointTenancy.propertyId}/inventory`,
        landlord,
      )
    ).items ?? [];
  check(
    landlordItems
      .find((item) => item.id === qaInventoryId)
      ?.acknowledgements?.some((entry) => entry.tenantId === tenantUser.id),
    "1.2-LANDLORD-SEES-CONFIRMATION",
  );
}

info(
  "1.3-INDEPENDENT-RESPONSES",
  "requires credentials for the researcher's second joint-tenant account; previously passed with screenshot evidence",
);

if (qaInventoryId) {
  const deleted = await fetch(`${baseUrl}/api/inventory/${qaInventoryId}`, {
    method: "DELETE",
    headers: { Cookie: cookieHeader(landlord) },
  });
  check(deleted.ok, "1.1-QA-INVENTORY-CLEANUP", `HTTP ${deleted.status}`);
}

const issues = (await json("/api/issues", tenant)).issues ?? [];
check(
  issues.length > 0 && issues.every((issue) => Boolean(issue.reportedByName)),
  "ATTR-ISSUE-REPORTER",
  issues[0]?.reportedByName,
);

const disputes = (await json("/api/disputes", tenant)).disputes ?? [];
check(
  disputes.length > 0,
  "2.1-DISPUTE-VISIBILITY",
  `${disputes.length} dispute(s)`,
);
check(
  disputes.length > 0 &&
    disputes.every((dispute) => Boolean(dispute.raisedByName)),
  "ATTR-DISPUTE-RAISER",
  disputes[0]?.raisedByName,
);
check(
  disputes.length > 0 &&
    disputes.every((dispute) => Boolean(dispute.primaryTenantName)),
  "ATTR-PRIMARY-TENANT",
  disputes[0]?.primaryTenantName,
);

if (disputes[0]) {
  const dispute = disputes[0];
  const tenantDetail = await request(`/api/disputes/${dispute.id}`, tenant);
  check(
    tenantDetail.response.ok,
    "2.2-TENANT-DISPUTE-DETAIL",
    tenantDetail.data.dispute?.disputeReference,
  );

  const denied = await fetch(`${baseUrl}/api/disputes/${dispute.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader(tenant),
    },
    body: JSON.stringify({ status: dispute.status, resolutionNotes: "" }),
  });
  check(denied.status === 403, "2.2-TENANT-READ-ONLY", `HTTP ${denied.status}`);

  const landlordDetail = await request(`/api/disputes/${dispute.id}`, landlord);
  check(
    landlordDetail.response.ok,
    "2.4-LANDLORD-DISPUTE-ACCESS",
    `HTTP ${landlordDetail.response.status}`,
  );

  const issueEvidence =
    (await json(`/api/evidence/issue/${dispute.issueId}`, tenant)).evidence ??
    [];
  const disputeEvidence =
    (await json(`/api/evidence/dispute/${dispute.id}`, tenant)).evidence ?? [];
  check(
    issueEvidence.length > 0,
    "2.2-ISSUE-EVIDENCE-DATA",
    `${issueEvidence.length} file(s)`,
  );
  check(
    Array.isArray(disputeEvidence),
    "2.2-DISPUTE-EVIDENCE-ENDPOINT",
    `${disputeEvidence.length} file(s)`,
  );

  const evidenceForm = new FormData();
  evidenceForm.set("disputeId", dispute.id);
  evidenceForm.set(
    "file",
    new File(
      [
        Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
          "base64",
        ),
      ],
      "qa-dispute-evidence.png",
      { type: "image/png" },
    ),
  );
  const uploaded = await fetch(`${baseUrl}/api/evidence/upload`, {
    method: "POST",
    headers: { Cookie: cookieHeader(tenant) },
    body: evidenceForm,
  });
  const uploadedData = await uploaded.json();
  const evidenceId = uploadedData.evidence?.id;
  check(
    uploaded.status === 201,
    "2.2-DISPUTE-EVIDENCE-UPLOAD",
    `HTTP ${uploaded.status}`,
  );

  const populatedEvidence =
    (await json(`/api/evidence/dispute/${dispute.id}`, tenant)).evidence ?? [];
  const uploadedEvidence = populatedEvidence.find(
    (evidence) => evidence.id === evidenceId,
  );
  check(
    Boolean(uploadedEvidence?.fileUrl) && uploadedEvidence.fileType === "image",
    "2.2-POPULATED-EVIDENCE-DATA",
    uploadedEvidence?.fileName,
  );

  if (evidenceId) {
    const deletedEvidence = await fetch(
      `${baseUrl}/api/evidence/${evidenceId}`,
      {
        method: "DELETE",
        headers: { Cookie: cookieHeader(tenant) },
      },
    );
    check(
      deletedEvidence.ok,
      "2.2-DISPUTE-EVIDENCE-CLEANUP",
      `HTTP ${deletedEvidence.status}`,
    );

    const notifications =
      (await json("/api/notifications", landlord)).notifications ?? [];
    const testNotifications = notifications.filter(
      (notification) => notification.relatedEntityId === evidenceId,
    );
    for (const notification of testNotifications) {
      await fetch(`${baseUrl}/api/notifications/${notification.id}`, {
        method: "DELETE",
        headers: { Cookie: cookieHeader(landlord) },
      });
    }
  }
}

const deposits = landlordTenancies.filter(
  (tenancy) => Number(tenancy.depositAmount) > 0,
);
check(
  deposits.length > 0,
  "3.1-LANDLORD-DEPOSIT",
  deposits[0] ? `GBP ${deposits[0].depositAmount}` : "none",
);

const tenantDeposit = tenantTenancies.find(
  (tenancy) => Number(tenancy.depositAmount) > 0,
);
check(
  Boolean(tenantDeposit),
  "3.2-TENANT-DEPOSIT",
  tenantDeposit ? `GBP ${tenantDeposit.depositAmount}` : "none",
);

const dashboardResults = await Promise.all([
  request("/api/dashboard/summary", landlord),
  request("/api/dashboard/summary", tenant),
  request("/api/dashboard/summary", admin),
]);
check(
  dashboardResults.every((result) => result.response.ok),
  "DASHBOARD-ROLES",
  dashboardResults.map((result) => result.data.role).join(", "),
);

if (failures > 0) {
  console.error(
    `\n${environment} researcher retest failed: ${failures} check(s).`,
  );
  process.exitCode = 1;
} else {
  console.log(`\n${environment} researcher retest passed.`);
}

async function login(email) {
  const cookieJar = new Map();
  const csrfResponse = await fetch(`${baseUrl}/api/auth/csrf`);
  updateCookies(cookieJar, csrfResponse);
  const { csrfToken } = await csrfResponse.json();
  const response = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: "POST",
    redirect: "manual",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookieHeader(cookieJar),
    },
    body: new URLSearchParams({
      callbackUrl: `${baseUrl}/dashboard`,
      csrfToken,
      email,
      json: "true",
      password,
    }),
  });
  updateCookies(cookieJar, response);
  return cookieJar;
}

async function json(path, cookieJar) {
  const result = await request(path, cookieJar);
  if (!result.response.ok) {
    throw new Error(`${path} returned ${result.response.status}`);
  }
  return result.data;
}

async function request(path, cookieJar) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { Cookie: cookieHeader(cookieJar) },
  });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { data, response };
}

function updateCookies(cookieJar, response) {
  for (const value of response.headers.getSetCookie?.() ?? []) {
    const [pair] = value.split(";");
    const separator = pair.indexOf("=");
    if (separator > 0) {
      cookieJar.set(pair.slice(0, separator), pair.slice(separator + 1));
    }
  }
}

function cookieHeader(cookieJar) {
  return [...cookieJar].map(([name, value]) => `${name}=${value}`).join("; ");
}

function check(condition, id, detail = "") {
  const suffix = detail ? ` - ${detail}` : "";
  if (condition) {
    console.log(`PASS [${environment}] ${id}${suffix}`);
    return;
  }
  failures += 1;
  console.error(`FAIL [${environment}] ${id}${suffix}`);
}

function info(id, detail) {
  console.log(`SKIP [${environment}] ${id} - ${detail}`);
}
