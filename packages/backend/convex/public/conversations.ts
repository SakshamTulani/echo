import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";

export const getOne = query({
  args: {
    conversationId: v.id("conversations"),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "Session not found or expired",
      });
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      return null;
    }

    if (conversation.contactSessionId !== args.contactSessionId) {
      return null;
    }

    return {
      _id: conversation._id,
      threadId: conversation.threadId,
      status: conversation.status,
    };
  },
});

export const create = mutation({
  args: {
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "Session not found or expired",
      });
    }

    if (session.organizationId !== args.organizationId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Session not authorized for this organization",
      });
    }

    // Todo: Replace once functionality is ready
    const threadId = "123";

    const conversationId = await ctx.db.insert("conversations", {
      contactSessionId: args.contactSessionId,
      organizationId: args.organizationId,
      status: "unresolved",
      threadId: threadId,
    });
    return conversationId;
  },
});
