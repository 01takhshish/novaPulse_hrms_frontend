import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt = "Nova Pulse — The Pulse of Every Growing Business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The raw logo is a transparent PNG, which disappears on dark social backgrounds.
// Compositing it onto a brand-coloured card fixes that for every platform.
const logo = readFileSync(join(process.cwd(), "public/images/logo-og.png")).toString("base64");

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #200338 0%, #3b0764 55%, #0f172a 100%)",
          padding: "72px 80px",
        }}
      >
        <img src={`data:image/png;base64,${logo}`} height={104} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#c084fc", fontSize: 26, letterSpacing: 4, fontWeight: 700 }}>
            HIRE. SECURE. GROW.
          </div>
          <div style={{ color: "#ffffff", fontSize: 68, fontWeight: 800, lineHeight: 1.1, marginTop: 14 }}>
            The Pulse of Every
          </div>
          <div style={{ color: "#e9d5ff", fontSize: 68, fontWeight: 800, lineHeight: 1.1 }}>
            Growing Business
          </div>
        </div>
        <div style={{ color: "#cbd5e1", fontSize: 26, display: "flex" }}>
          HRMS &amp; Payroll · Biometric Attendance · Security · Hiring · B2B Growth
        </div>
      </div>
    ),
    size,
  );
}
