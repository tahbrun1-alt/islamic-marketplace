export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Standalone auth — no Manus OAuth dependency.
// Returns the local login page path.
export const getLoginUrl = (returnPath?: string): string => {
  if (returnPath) {
    return `/login?return=${encodeURIComponent(returnPath)}`;
  }
  return "/login";
};
