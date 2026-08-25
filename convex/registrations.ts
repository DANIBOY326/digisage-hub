import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const submitRegistration = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    courseId: v.string(),
    courseName: v.string(),
    cohortPreference: v.string(),
    motivation: v.string(),
    paymentType: v.union(v.literal("full"), v.literal("part")),
    paymentEvidenceStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("cohortRegistrations", {
      ...args,
      status: "pending",
    });
    return id;
  },
});

export const listRegistrations = query({
  args: {
    paginationOpts: paginationOptsValidator,
    courseId: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("reviewed"),
        v.literal("contacted"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("cohortRegistrations").order("desc");

    if (args.courseId) {
      q = ctx.db
        .query("cohortRegistrations")
        .withIndex("by_course", (idx) => idx.eq("courseId", args.courseId!))
        .order("desc");
    }

    if (args.status) {
      q = ctx.db
        .query("cohortRegistrations")
        .withIndex("by_status", (idx) => idx.eq("status", args.status!))
        .order("desc");
    }

    const results = await q.paginate(args.paginationOpts);

    // Always resolve payment evidence URLs
    const pageWithUrls = await Promise.all(
      results.page.map(async (reg) => {
        const evidenceUrl = reg.paymentEvidenceStorageId
          ? await ctx.storage.getUrl(reg.paymentEvidenceStorageId)
          : null;
        return { ...reg, evidenceUrl };
      }),
    );

    return { ...results, page: pageWithUrls };
  },
});

// Non-paginated query for CSV export — returns all registrations with optional filters
export const exportRegistrations = query({
  args: {
    courseId: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("reviewed"),
        v.literal("contacted"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    let rows = await ctx.db.query("cohortRegistrations").order("desc").collect();

    if (args.courseId) {
      rows = rows.filter((r) => r.courseId === args.courseId);
    }
    if (args.status) {
      rows = rows.filter((r) => r.status === args.status);
    }

    const rowsWithUrls = await Promise.all(
      rows.map(async (reg) => {
        const evidenceUrl = reg.paymentEvidenceStorageId
          ? await ctx.storage.getUrl(reg.paymentEvidenceStorageId)
          : null;
        return { ...reg, evidenceUrl };
      }),
    );

    return rowsWithUrls;
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("cohortRegistrations").collect();
    const pending = all.filter((r) => r.status === "pending").length;
    const reviewed = all.filter((r) => r.status === "reviewed").length;
    const contacted = all.filter((r) => r.status === "contacted").length;
    const fullPayment = all.filter((r) => r.paymentType === "full").length;
    const partPayment = all.filter((r) => r.paymentType === "part").length;

    const byCourse: Record<string, number> = {};
    for (const r of all) {
      byCourse[r.courseName] = (byCourse[r.courseName] ?? 0) + 1;
    }

    return {
      total: all.length,
      pending,
      reviewed,
      contacted,
      fullPayment,
      partPayment,
      byCourse,
    };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("cohortRegistrations"),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewed"),
      v.literal("contacted"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch("cohortRegistrations", args.id, { status: args.status });
  },
});

export const deleteRegistration = mutation({
  args: { id: v.id("cohortRegistrations") },
  handler: async (ctx, args) => {
    const reg = await ctx.db.get("cohortRegistrations", args.id);
    if (reg?.paymentEvidenceStorageId) {
      await ctx.storage.delete(reg.paymentEvidenceStorageId);
    }
    await ctx.db.delete("cohortRegistrations", args.id);
  },
});
