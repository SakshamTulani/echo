import {
  HTML_SCRIPT,
  NEXTJS_SCRIPT,
  REACT_SCRIPT,
  JAVASCRIPT_SCRIPT,
  type IntegrationId,
} from "./constants";

export const createScript = (
  integrationId: IntegrationId,
  organizationId: string,
) => {
  switch (integrationId) {
    case "html":
      return HTML_SCRIPT.replace(/{{ORGANIZATION_ID}}/g, organizationId);
    case "react":
      return REACT_SCRIPT.replace(/{{ORGANIZATION_ID}}/g, organizationId);
    case "nextjs":
      return NEXTJS_SCRIPT.replace(/{{ORGANIZATION_ID}}/g, organizationId);
    case "javascript":
      return JAVASCRIPT_SCRIPT.replace(/{{ORGANIZATION_ID}}/g, organizationId);
    default:
      return "";
  }
};
