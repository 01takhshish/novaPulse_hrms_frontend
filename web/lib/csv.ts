/**
 * Minimal RFC 4180 writer with spreadsheet-injection defence.
 *
 * A cell starting with =, +, - or @ is executed as a formula by Excel and
 * Sheets. Since lead names and messages come from the public internet, every
 * such cell is prefixed with an apostrophe so it stays inert text.
 */
const FORMULA_PREFIX = /^[=+\-@\t\r]/;

export function csvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  let text = value instanceof Date ? value.toISOString() : String(value);
  if (FORMULA_PREFIX.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function toCsv(headers: readonly string[], rows: readonly unknown[][]): string {
  const lines = [headers.map(csvCell).join(","), ...rows.map((r) => r.map(csvCell).join(","))];
  // Leading BOM so Excel opens UTF-8 correctly.
  return "﻿" + lines.join("\r\n");
}
