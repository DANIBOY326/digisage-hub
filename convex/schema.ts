import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),

  cohortRegistrations: defineTable({
    // Personal info
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    // Course selection
    courseId: v.string(),
    courseName: v.string(),
    // Cohort preference
    cohortPreference: v.string(),
    // Motivation
    motivation: v.string(),
    // Payment
    paymentType: v.union(v.literal("full"), v.literal("part")),
    paymentEvidenceStorageId: v.optional(v.id("_storage")),
    // Status for admin
    status: v.union(
      v.literal("pending"),
      v.literal("reviewed"),
      v.literal("contacted"),
    ),
  })
    .index("by_status", ["status"])
    .index("by_course", ["courseId"])
    .index("by_email", ["email"]),
});
