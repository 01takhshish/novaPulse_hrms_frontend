import { describe, expect, it } from "vitest";
import { csvCell, toCsv } from "@/lib/csv";

describe("csvCell", () => {
  it("quotes plain values", () => {
    expect(csvCell("Praveen")).toBe('"Praveen"');
  });

  it("doubles embedded quotes", () => {
    expect(csvCell('He said "hi"')).toBe('"He said ""hi"""');
  });

  it("keeps commas and newlines inside the quoted cell", () => {
    expect(csvCell("Delhi, India")).toBe('"Delhi, India"');
    expect(csvCell("line1\nline2")).toBe('"line1\nline2"');
  });

  it("renders null and undefined as empty cells", () => {
    expect(csvCell(null)).toBe('""');
    expect(csvCell(undefined)).toBe('""');
  });

  it("serialises dates as ISO strings", () => {
    expect(csvCell(new Date("2026-09-06T10:00:00Z"))).toBe('"2026-09-06T10:00:00.000Z"');
  });

  // Lead text comes from the public internet and lands in someone's spreadsheet.
  it.each(["=1+1", "+1", "-1", "@SUM(A1)", "=cmd|'/c calc'!A1"])(
    "neutralises the formula %s",
    (payload) => {
      expect(csvCell(payload)).toBe(`"'${payload}"`);
    },
  );
});

describe("toCsv", () => {
  it("emits a BOM, CRLF line endings and a header row", () => {
    const csv = toCsv(["name", "email"], [["Asha", "asha@example.com"]]);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv).toContain("\r\n");
    expect(csv).toContain('"name","email"');
    expect(csv).toContain('"Asha","asha@example.com"');
  });
});
