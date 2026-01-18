import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { upsertSecret } from "../lib/secrets";
import { internal } from "../_generated/api";

const getSecretName = (organizationId: string, service: string) =>
  `tenant/${organizationId}/${service}`;

export const upsert = internalAction({
  args: {
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const secretName = getSecretName(args.organizationId, args.service);
    await upsertSecret(secretName, args.value);
    await ctx.runMutation(internal.system.plugins.upsert, {
      organizationId: args.organizationId,
      service: args.service,
      secretName,
    });
    return { status: "success" };
  },
});
