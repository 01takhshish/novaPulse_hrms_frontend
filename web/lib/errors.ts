/** Log a classification, never database parameters, credentials or lead content. */
export function reportError(context: string, error: unknown) {
  const kind = error instanceof Error ? error.name : "UnknownError";
  console.error(`[${context}] operation failed`, { kind });
}

export function databaseErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  if ("code" in error && typeof error.code === "string") return error.code;
  return "cause" in error ? databaseErrorCode(error.cause) : undefined;
}
