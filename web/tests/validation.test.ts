import { describe, expect, it } from "vitest";
import { leadSubmissionSchema } from "@/lib/leads/validation";

const valid = {
  name: "Praveen Sharma",
  email: "Praveen@Example.COM",
  phone: "+91 98765 43210",
  company: "Enterprise Ltd",
  service: "HRMS & Payroll",
};

describe("leadSubmissionSchema", () => {
  it("accepts a well-formed submission", () => {
    const result = leadSubmissionSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("normalises the email to lowercase so duplicates collapse", () => {
    const result = leadSubmissionSchema.parse(valid);
    expect(result.email).toBe("praveen@example.com");
  });

  it("trims surrounding whitespace", () => {
    const result = leadSubmissionSchema.parse({ ...valid, name: "  Praveen  " });
    expect(result.name).toBe("Praveen");
  });

  it("rejects an invalid email", () => {
    const result = leadSubmissionSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it.each(["12345", "abcdefghij", "+91-98", ""])("rejects bad phone %s", (phone) => {
    expect(leadSubmissionSchema.safeParse({ ...valid, phone }).success).toBe(false);
  });

  it.each(["+919876543210", "09876543210", "(022) 1234 5678"])(
    "accepts phone %s",
    (phone) => {
      expect(leadSubmissionSchema.safeParse({ ...valid, phone }).success).toBe(true);
    },
  );

  it("rejects a service outside the published list", () => {
    const result = leadSubmissionSchema.safeParse({ ...valid, service: "Free Money" });
    expect(result.success).toBe(false);
  });

  it("treats an empty message as absent", () => {
    expect(leadSubmissionSchema.parse({ ...valid, message: "" }).message).toBeUndefined();
  });

  it("rejects an over-long message rather than truncating it", () => {
    const result = leadSubmissionSchema.safeParse({ ...valid, message: "x".repeat(2001) });
    expect(result.success).toBe(false);
  });

  // Deliberate: the schema must not reject this, or the 422 response would tell
  // a bot which field unmasked it. createLead() drops the submission instead.
  it("accepts a filled honeypot and leaves the decision to the service", () => {
    expect(leadSubmissionSchema.safeParse({ ...valid, _gotcha: "bot" }).success).toBe(true);
  });
});
