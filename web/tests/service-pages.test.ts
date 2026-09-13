import { beforeEach, describe, expect, it, vi } from "vitest";

// revalidatePath needs Next's request store, which does not exist under Vitest.
// The service's contract is "a mutation revalidates the right paths", so the
// calls are recorded and asserted rather than executed.
const revalidatePath = vi.fn();
vi.mock("next/cache", () => ({
  revalidatePath: (path: string, type?: string) => revalidatePath(path, type),
}));

const { createService, updateService, deleteService, listAll } = await import(
  "@/lib/services/service"
);
const { getServices, getService, getServiceSlugs, getSolutionsMenu } = await import(
  "@/lib/services"
);
const { db } = await import("@/lib/db/client");
const { servicePages, users } = await import("@/lib/db/schema");
const { eq } = await import("drizzle-orm");

async function seedUser() {
  const [user] = await db()
    .insert(users)
    .values({
      email: "editor@novapulse.co.in",
      name: "Editor",
      passwordHash: "not-a-real-hash",
      role: "admin",
    })
    .returning();
  return user;
}

function draft(overrides: Record<string, unknown> = {}) {
  return {
    slug: "hrms-payroll",
    name: "HRMS & Payroll",
    title: "HRMS & Payroll Software",
    eyebrow: "Flagship platform",
    tagline: "Attendance, shifts and payroll in one place.",
    description: "Run attendance, shifts and statutory payroll from a single system.",
    menuBlurb: "Attendance, Shifts & Payroll",
    icon: "FaIdCardClip",
    illustration: "PayrollFlow",
    demoService: "HRMS & Payroll",
    problems: [{ title: "Month-end drags", body: "Three days of spreadsheet reconciliation." }],
    capabilities: [
      { icon: "FaFileInvoice", title: "Statutory payroll", body: "PF, ESI and TDS calculated." },
    ],
    stats: [{ value: 6, label: "stages from punch to payslip" }],
    process: [{ title: "Discovery", body: "We map your current attendance and payroll flow." }],
    faqs: [{ question: "Multiple sites?", answer: "Yes, each with its own shifts." }],
    related: [],
    sortOrder: 0,
    status: "draft" as const,
    ...overrides,
  };
}

describe("service pages", () => {
  let userId: string;

  beforeEach(async () => {
    revalidatePath.mockClear();
    userId = (await seedUser()).id;
  });

  it("rejects a duplicate slug with a field error, not a crash", async () => {
    await createService(draft(), userId);
    const second = await createService(draft({ name: "Payroll again" }), userId);

    expect(second.ok).toBe(false);
    if (second.ok) return;
    expect(second.error.kind).toBe("validation");
    if (second.error.kind !== "validation") return;
    expect(second.error.fieldErrors.slug?.[0]).toMatch(/already exists/i);
  });

  it("refuses an icon that is not in the registry", async () => {
    const result = await createService(draft({ icon: "FaNotAnIcon" }), userId);

    expect(result.ok).toBe(false);
    if (result.ok || result.error.kind !== "validation") return;
    expect(result.error.fieldErrors.icon).toBeDefined();
  });

  it("refuses an illustration that has no component", async () => {
    const result = await createService(draft({ illustration: "RocketShip" }), userId);

    expect(result.ok).toBe(false);
    if (result.ok || result.error.kind !== "validation") return;
    expect(result.error.fieldErrors.illustration).toBeDefined();
  });

  it("refuses a demo service the public form does not offer", async () => {
    const result = await createService(draft({ demoService: "Time Travel" }), userId);

    expect(result.ok).toBe(false);
    if (result.ok || result.error.kind !== "validation") return;
    expect(result.error.fieldErrors.demoService).toBeDefined();
  });

  it("refuses a related slug that does not exist", async () => {
    const result = await createService(draft({ related: ["ghost-service"] }), userId);

    expect(result.ok).toBe(false);
    if (result.ok || result.error.kind !== "validation") return;
    expect(result.error.fieldErrors.related?.[0]).toMatch(/ghost-service/);
  });

  it("accepts a related slug once that service exists", async () => {
    await createService(draft({ slug: "workplace-security", name: "Workplace Security" }), userId);
    const result = await createService(draft({ related: ["workplace-security"] }), userId);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.related).toEqual(["workplace-security"]);
  });

  it("refuses a service that lists itself as related", async () => {
    const result = await createService(draft({ related: ["hrms-payroll"] }), userId);

    expect(result.ok).toBe(false);
    if (result.ok || result.error.kind !== "validation") return;
    expect(result.error.fieldErrors.related?.[0]).toMatch(/itself/i);
  });

  it("refuses to publish a service with no capabilities", async () => {
    const result = await createService(
      draft({ capabilities: [], status: "published" }),
      userId,
    );

    expect(result.ok).toBe(false);
    if (result.ok || result.error.kind !== "validation") return;
    expect(result.error.fieldErrors.capabilities).toBeDefined();
  });

  it("allows a draft with no capabilities", async () => {
    const result = await createService(draft({ capabilities: [] }), userId);
    expect(result.ok).toBe(true);
  });

  it("refuses a javascript: hero image", async () => {
    const result = await createService(
      draft({ imageSrc: "javascript:alert(1)", imageAlt: "Nothing" }),
      userId,
    );

    expect(result.ok).toBe(false);
    if (result.ok || result.error.kind !== "validation") return;
    expect(result.error.fieldErrors.imageSrc).toBeDefined();
  });

  it("requires alt text when there is a hero image", async () => {
    const result = await createService(draft({ imageSrc: "/images/payroll.webp" }), userId);

    expect(result.ok).toBe(false);
    if (result.ok || result.error.kind !== "validation") return;
    expect(result.error.fieldErrors.imageAlt).toBeDefined();
  });

  it("normalises a messy slug", async () => {
    const result = await createService(draft({ slug: "  HRMS & Payroll!! " }), userId);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.slug).toBe("hrms-payroll");
  });

  it("refuses a slug that would collide with a real route", async () => {
    const result = await createService(draft({ slug: "new" }), userId);

    expect(result.ok).toBe(false);
    if (result.ok || result.error.kind !== "validation") return;
    expect(result.error.fieldErrors.slug?.[0]).toMatch(/reserved/i);
  });

  it("drops rows the author added but left blank", async () => {
    const result = await createService(
      draft({ problems: [{ title: "Real", body: "A real problem worth describing." }, { title: "", body: "" }] }),
      userId,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.problems).toHaveLength(1);
  });

  it("keeps a draft out of the site but visible in admin", async () => {
    await createService(draft(), userId);

    expect(await getServices()).toEqual([]);
    expect(await getService("hrms-payroll")).toBeNull();
    expect(await getServiceSlugs()).toEqual([]);
    expect(await getSolutionsMenu()).toEqual([]);
    expect(await listAll()).toHaveLength(1);
  });

  it("does not revalidate anything for a draft", async () => {
    await createService(draft(), userId);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("revalidates the whole layout on publish, because the menu is on every page", async () => {
    await createService(draft({ status: "published" }), userId);

    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(revalidatePath).toHaveBeenCalledWith("/sitemap.xml", undefined);
  });

  it("revalidates when a live page is unpublished", async () => {
    const created = await createService(draft({ status: "published" }), userId);
    if (!created.ok) throw new Error("setup failed");
    revalidatePath.mockClear();

    await updateService(created.data.id, draft({ status: "draft" }), userId);

    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(await getServices()).toEqual([]);
  });

  it("surfaces a published service on the site and in the menu", async () => {
    await createService(draft({ status: "published" }), userId);

    const services = await getServices();
    expect(services).toHaveLength(1);
    expect(services[0].name).toBe("HRMS & Payroll");

    const menu = await getSolutionsMenu();
    expect(menu[0]).toEqual({
      href: "/services/hrms-payroll",
      icon: "FaIdCardClip",
      title: "HRMS & Payroll",
      blurb: "Attendance, Shifts & Payroll",
    });
  });

  it("orders the site list and the menu by sort order", async () => {
    await createService(
      draft({ slug: "b2b-lead-generation", name: "B2B Lead Generation", sortOrder: 4, status: "published" }),
      userId,
    );
    await createService(draft({ sortOrder: 0, status: "published" }), userId);

    expect((await getServices()).map((s) => s.slug)).toEqual([
      "hrms-payroll",
      "b2b-lead-generation",
    ]);
  });

  it("maps a stored row back to the shape the pages render", async () => {
    await createService(
      draft({ status: "published", imageSrc: "/images/payroll.webp", imageAlt: "A payslip" }),
      userId,
    );

    const service = await getService("hrms-payroll");
    expect(service).not.toBeNull();
    expect(service?.image).toEqual({ src: "/images/payroll.webp", alt: "A payslip" });
    expect(service?.stats[0]).toEqual({ value: 6, label: "stages from punch to payslip" });
    expect(service?.capabilities[0].icon).toBe("FaFileInvoice");
  });

  it("falls back to the static page when a stored row fails validation", async () => {
    const created = await createService(draft({ status: "published" }), userId);
    if (!created.ok) throw new Error("setup failed");

    // Simulates a hand-run UPDATE: Postgres accepts any valid JSON here.
    await db()
      .update(servicePages)
      .set({ stats: "not an array" as never })
      .where(eq(servicePages.id, created.data.id));

    const service = await getService("hrms-payroll");
    // content/services.ts is the fallback, so the page still renders.
    expect(service?.slug).toBe("hrms-payroll");
    expect(Array.isArray(service?.stats)).toBe(true);
  });

  it("refuses to delete a service another page still links to", async () => {
    const target = await createService(draft(), userId);
    if (!target.ok) throw new Error("setup failed");
    await createService(
      draft({ slug: "workplace-security", name: "Workplace Security", related: ["hrms-payroll"] }),
      userId,
    );

    const result = await deleteService(target.data.id);

    expect(result.ok).toBe(false);
    if (result.ok || result.error.kind !== "validation") return;
    expect(result.error.fieldErrors.related?.[0]).toMatch(/Workplace Security/);
    expect(await listAll()).toHaveLength(2);
  });

  it("deletes a service nothing links to, and clears the pages", async () => {
    const created = await createService(draft({ status: "published" }), userId);
    if (!created.ok) throw new Error("setup failed");
    revalidatePath.mockClear();

    const result = await deleteService(created.data.id);

    expect(result.ok).toBe(true);
    expect(await listAll()).toEqual([]);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("reports not_found rather than throwing for a missing id", async () => {
    const missing = "00000000-0000-0000-0000-000000000000";
    const updated = await updateService(missing, draft(), userId);
    const deleted = await deleteService(missing);

    expect(updated.ok).toBe(false);
    expect(deleted.ok).toBe(false);
    if (!updated.ok) expect(updated.error.kind).toBe("not_found");
    if (!deleted.ok) expect(deleted.error.kind).toBe("not_found");
  });

  it("keeps the slug editable and clears the old page", async () => {
    const created = await createService(draft({ status: "published" }), userId);
    if (!created.ok) throw new Error("setup failed");

    const updated = await updateService(
      created.data.id,
      draft({ slug: "hrms-and-payroll", status: "published" }),
      userId,
    );

    expect(updated.ok).toBe(true);
    expect(await getService("hrms-payroll")).toBeNull();
    expect(await getService("hrms-and-payroll")).not.toBeNull();
  });
});
