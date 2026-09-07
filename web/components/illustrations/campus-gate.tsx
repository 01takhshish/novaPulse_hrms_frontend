import { Figure, Panel } from "./shared";

/** Education: campus building, visitor badge issue, period timetable. */
export function CampusGate({ className }: { className?: string }) {
  return (
    <Figure ns="cam" label="Campus entrance issuing visitor badges beside a period timetable" className={className}>
      <rect x="0" y="0" width="320" height="240" rx="18" fill="url(#cam-soft)" opacity="0.55" />

      {/* Building with pediment and pillars */}
      <path d="M22 82 L82 46 L142 82 Z" fill="url(#cam-violet)" />
      <rect x="28" y="82" width="108" height="10" rx="3" fill="#6b21a8" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={38 + i * 26} y="92" width="14" height="66" rx="3" fill="#ffffff" stroke="#e9d5ff" strokeWidth="2" />
      ))}
      <rect x="28" y="158" width="108" height="12" rx="4" fill="#6b21a8" />
      {/* Flag */}
      <rect x="80" y="26" width="3" height="22" rx="1.5" fill="#6b21a8" />
      <path d="M83 28 h18 l-5 6 5 6 h-18 z" fill="#c084fc" className="np-float" />

      {/* Visitor badge */}
      <g className="np-float" style={{ animationDelay: "0.6s" }}>
        <rect x="34" y="182" width="94" height="42" rx="8" fill="#ffffff" stroke="#c084fc" strokeWidth="2" />
        <circle cx="54" cy="203" r="11" fill="#f3e8ff" />
        <circle cx="54" cy="199" r="4" fill="#a855f7" />
        <path d="M46 210a8 8 0 0 1 16 0z" fill="#a855f7" />
        <rect x="72" y="193" width="44" height="5" rx="2.5" fill="#6b21a8" />
        <rect x="72" y="203" width="34" height="4" rx="2" fill="#e9d5ff" />
        <rect x="72" y="211" width="28" height="4" rx="2" fill="#f3e8ff" />
      </g>

      {/* Timetable */}
      <Panel x="158" y="40" width="140" height="184" />
      <rect x="172" y="54" width="48" height="6" rx="3" fill="#6b21a8" />
      <rect x="172" y="68" width="34" height="4" rx="2" fill="#e9d5ff" />
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 4 }).map((__, col) => {
          const i = row * 4 + col;
          const active = [2, 5, 9, 14, 17].includes(i);
          return (
            <rect
              key={i}
              x={172 + col * 30}
              y={86 + row * 24}
              width="24"
              height="17"
              rx="4"
              fill={active ? "url(#cam-violet)" : "#f3e8ff"}
              className={active ? "np-pulse" : undefined}
              style={active ? { animationDelay: `${(i % 4) * 0.4}s` } : undefined}
            />
          );
        }),
      )}
      <rect x="172" y="212" width="60" height="5" rx="2.5" fill="#e9d5ff" />
    </Figure>
  );
}
