/** JSON embedded in HTML must not contain a script-closing delimiter. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
