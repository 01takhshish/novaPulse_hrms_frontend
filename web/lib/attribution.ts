/**
 * Campaign attribution, captured in the browser.
 *
 * UTM parameters usually appear on the landing URL only, but the form is often
 * submitted several navigations later — so the first set seen this session is
 * stashed and reused. Client-safe: no server imports.
 */
const STORAGE_KEY = "novapulse_attribution";

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
};

const PARAMS: Array<[keyof Attribution, string]> = [
  ["utmSource", "utm_source"],
  ["utmMedium", "utm_medium"],
  ["utmCampaign", "utm_campaign"],
  ["utmTerm", "utm_term"],
  ["utmContent", "utm_content"],
];

function readFromUrl(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const found: Attribution = {};
  for (const [key, param] of PARAMS) {
    const value = params.get(param);
    if (value) found[key] = value.slice(0, 120);
  }
  // An external referrer is useful; our own pages are noise.
  if (document.referrer && !document.referrer.startsWith(window.location.origin)) {
    found.referrer = document.referrer.slice(0, 1000);
  }
  return found;
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const fresh = readFromUrl();
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (Object.keys(fresh).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    return stored ? (JSON.parse(stored) as Attribution) : {};
  } catch {
    // Private browsing, disabled storage — attribution is nice to have, not essential.
    return {};
  }
}
