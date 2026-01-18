import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import { internal } from "../_generated/api";

export const upsert = mutation({
  args: {
    service: v.union(v.literal("vapi")),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "User not authenticated",
      });
    }

    const organizationId = identity.orgId as string;

    if (!organizationId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }
    // TODO : check for subscription

    await ctx.scheduler.runAfter(0, internal.system.secrets.upsert, {
      organizationId,
      service: args.service,
      value: args.value,
    });
  },
});
