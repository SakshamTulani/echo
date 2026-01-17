import { action, mutation } from "../_generated/server";
import {
  contentHashFromArrayBuffer,
  guessMimeTypeFromContents,
  guessMimeTypeFromExtension,
  vEntryId,
} from "@convex-dev/rag";
import { ConvexError, v } from "convex/values";
import { extractTextContent } from "../lib/extractTextContent";
import rag from "../system/ai/rag";
import type { Id } from "../_generated/dataModel";

function guessMimeType(filename: string, bytes: ArrayBuffer): string {
  return (
    guessMimeTypeFromContents(bytes) ||
    guessMimeTypeFromExtension(filename) ||
    "application/octet-stream"
  );
}

export const deleteFile = mutation({
  args: { entryId: vEntryId },
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
    const namespace = await rag.getNamespace(ctx, {
      namespace: organizationId,
    });
    if (!namespace) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid namespace",
      });
    }
    const entry = await rag.getEntry(ctx, {
      entryId: args.entryId,
    });
    if (!entry) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Entry not found",
      });
    }
    if (entry.metadata?.uploadedBy !== organizationId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized to delete this entry",
      });
    }
    if (entry.metadata?.storageId) {
      await ctx.storage.delete(entry.metadata?.storageId as Id<"_storage">);
    }
    await rag.deleteAsync(ctx, {
      entryId: args.entryId,
    });
  },
});

export const addFile = action({
  args: {
    filename: v.string(),
    mimeType: v.string(),
    bytes: v.bytes(),
    category: v.optional(v.string()),
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
    const { bytes, filename, category } = args;
    const mimeType = args.mimeType || guessMimeType(filename, bytes);
    const blob = new Blob([bytes], { type: mimeType });
    const storageId = await ctx.storage.store(blob);
    const text = await extractTextContent(ctx, {
      storageId,
      filename,
      mimeType,
      bytes,
    });

    const { entryId, created } = await rag.add(ctx, {
      // Super important to pass the namespace
      // This ensures that the data is isolated to the organization
      // If not passed, the data will be accessible to all organizations
      namespace: organizationId,
      text,
      key: filename,
      metadata: {
        storageId,
        uploadedBy: organizationId, //Important for deletion
        filename,
        category: category ?? null,
        mimeType,
      },
      contentHash: await contentHashFromArrayBuffer(bytes), // To avoid re-inserting if the file content hasn't changed
    });
    if (!created) {
      console.debug("entry already exists, deleting file");
      await ctx.storage.delete(storageId);
    }
    return {
      url: await ctx.storage.getUrl(storageId),
      entryId,
    };
  },
});
