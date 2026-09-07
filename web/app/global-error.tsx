"use client";

/** Last-resort boundary: replaces the root layout, so it ships its own <html>. */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          color: "#0f172a",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 12px" }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 14, color: "#475569", margin: "0 0 24px", lineHeight: 1.6 }}>
            The page failed to load. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              border: 0,
              background: "#6b21a8",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
