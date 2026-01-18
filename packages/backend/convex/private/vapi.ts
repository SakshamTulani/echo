import { VapiClient, Vapi } from "@vapi-ai/server-sdk";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { getSecretValue, parseSecretString } from "../lib/secrets";
import { ConvexError } from "convex/values";

export const getAssistants = action({
  args: {},
  handler: async (ctx) => {
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

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIDAndService,
      {
        organizationId,
        service: "vapi",
      },
    );

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      });
    }
    const secretName = plugin.secretName;
    const secretValue = await getSecretValue(secretName);
    const parsedSecretValue = parseSecretString<{
      privateApiKey: string;
      publicApiKey: string;
    }>(secretValue);
    if (!parsedSecretValue) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials not found",
      });
    }
    if (!parsedSecretValue.privateApiKey || !parsedSecretValue.publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials incomplete. Please reconnect your Vapi account.",
      });
    }
    const vapiClient = new VapiClient({
      token: parsedSecretValue.privateApiKey,
    });
    const assistants = await vapiClient.assistants.list();
    return assistants;
  },
});

export const getPhoneNumbers = action({
  args: {},
  handler: async (ctx) => {
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

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIDAndService,
      {
        organizationId,
        service: "vapi",
      },
    );

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      });
    }
    const secretName = plugin.secretName;
    const secretValue = await getSecretValue(secretName);
    const parsedSecretValue = parseSecretString<{
      privateApiKey: string;
      publicApiKey: string;
    }>(secretValue);
    if (!parsedSecretValue) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials not found",
      });
    }
    if (!parsedSecretValue.privateApiKey || !parsedSecretValue.publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials incomplete. Please reconnect your Vapi account.",
      });
    }
    const vapiClient = new VapiClient({
      token: parsedSecretValue.privateApiKey,
    });
    const phoneNumbers = await vapiClient.phoneNumbers.list();
    return phoneNumbers;
  },
});
