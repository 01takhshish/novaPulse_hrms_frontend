/**
 * Ambient colour wash for hero sections. Purely decorative and non-interactive;
 * the drift animation is disabled under prefers-reduced-motion.
 */
export function BlobBackdrop({ variant = "default" }: { variant?: "default" | "deep" }) {
  const deep = variant === "deep";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <span
        className="blob blob-drift-a"
        style={{
          width: 420, height: 420, top: -120, left: -80,
          background: deep ? "#6b21a8" : "#e9d5ff",
        }}
      />
      <span
        className="blob blob-drift-b"
        style={{
          width: 360, height: 360, top: -60, right: -100,
          background: deep ? "#a855f7" : "#f3e8ff",
        }}
      />
    </div>
  );
}
