import { Figure, Panel } from "./shared";

/** Multi-channel outbound feeding a rising pipeline. */
export function GrowthFunnel({ className }: { className?: string }) {
  const bars = [
    { x: 196, h: 30 }, { x: 222, h: 48 }, { x: 248, h: 68 }, { x: 274, h: 92 },
  ];
  return (
    <Figure ns="gro" label="Multi-channel outbound building a rising sales pipeline" className={className}>
      <rect x="0" y="0" width="320" height="240" rx="18" fill="url(#gro-soft)" opacity="0.55" />

      {/* Channels */}
      {[
        { y: 34, label: 26 },
        { y: 84, label: 40 },
        { y: 134, label: 32 },
      ].map((row, i) => (
        <g key={i}>
          <Panel x="22" y={row.y} width="112" height="36" />
          <rect x="34" y={row.y + 12} width="12" height="12" rx="3.5" fill="url(#gro-violet)" />
          <rect x="54" y={row.y + 13} width={row.label} height="5" rx="2.5" fill="#6b21a8" />
          <rect x="54" y={row.y + 23} width="58" height="4" rx="2" fill="#e9d5ff" />
          <path d={`M134 ${row.y + 18} L168 ${row.y + 18}`} stroke="#c084fc" strokeWidth="2"
            strokeDasharray="4 5" strokeLinecap="round" />
          <circle className="np-travel" r="3.5" fill="#7e22ce"
            style={{ offsetPath: `path("M134 ${row.y + 18} L168 ${row.y + 18}")`,
                     animationDuration: "2.2s", animationDelay: `${i * 0.5}s` }} />
        </g>
      ))}

      {/* Chart */}
      <Panel x="176" y="30" width="126" height="176" />
      <path d="M190 178 L214 156 L240 138 L266 108 L288 74" stroke="url(#gro-violet)"
        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="np-draw" />
      {bars.map((bar, i) => (
        <rect key={i} x={bar.x} y={188 - bar.h} width="14" height={bar.h} rx="4"
          fill="#e9d5ff" className="np-grow" style={{ transformOrigin: `${bar.x}px 188px`, animationDelay: `${i * 0.15}s` }} />
      ))}
      <circle className="np-pulse" cx="288" cy="74" r="6" fill="#7e22ce" />
      <rect x="190" y="42" width="52" height="6" rx="3" fill="#6b21a8" />
      <rect x="190" y="56" width="34" height="5" rx="2.5" fill="#e9d5ff" />
    </Figure>
  );
}
