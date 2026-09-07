import { Figure, Panel } from "./shared";

/** Healthcare: contactless face scan and a round-the-clock rota grid. */
export function ClinicRoster({ className }: { className?: string }) {
  const cells = Array.from({ length: 21 }, (_, i) => i);
  return (
    <Figure ns="cli" label="Contactless staff verification beside a 24-hour rota grid" className={className}>
      <rect x="0" y="0" width="320" height="240" rx="18" fill="url(#cli-soft)" opacity="0.55" />

      {/* Contactless scan */}
      <Panel x="22" y="44" width="122" height="152" />
      {/* Bracket corners */}
      <g stroke="#a855f7" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M44 78v-12h12" /><path d="M122 78v-12h-12" />
        <path d="M44 140v12h12" /><path d="M122 140v12h-12" />
      </g>
      {/* Head */}
      <circle cx="83" cy="102" r="20" fill="#f3e8ff" stroke="#c084fc" strokeWidth="2" />
      <path d="M63 142a20 20 0 0 1 40 0z" fill="#e9d5ff" />
      <circle cx="76" cy="99" r="2.6" fill="#6b21a8" />
      <circle cx="90" cy="99" r="2.6" fill="#6b21a8" />
      <path d="M76 110a9 9 0 0 0 14 0" stroke="#6b21a8" strokeWidth="2" strokeLinecap="round" />
      <rect className="np-scan" x="46" y="70" width="74" height="3" rx="1.5" fill="#a855f7" opacity="0.9" />
      {/* Medical cross badge */}
      <circle cx="128" cy="176" r="14" fill="url(#cli-violet)" />
      <path d="M128 169v14M121 176h14" stroke="#ffffff" strokeWidth="3.4" strokeLinecap="round" />

      {/* Rota grid */}
      <Panel x="162" y="44" width="136" height="152" />
      <rect x="176" y="58" width="46" height="6" rx="3" fill="#6b21a8" />
      <rect x="176" y="72" width="30" height="4" rx="2" fill="#e9d5ff" />
      {cells.map((i) => {
        const col = i % 7;
        const row = Math.floor(i / 7);
        const night = [4, 9, 13, 18].includes(i);
        return (
          <rect
            key={i}
            x={176 + col * 17}
            y={90 + row * 22}
            width="13"
            height="16"
            rx="3.5"
            fill={night ? "url(#cli-violet)" : "#f3e8ff"}
            className={night ? "np-pulse" : undefined}
            style={night ? { animationDelay: `${(i % 5) * 0.35}s` } : undefined}
          />
        );
      })}
      <rect x="176" y="164" width="12" height="12" rx="3" fill="url(#cli-violet)" />
      <rect x="194" y="168" width="42" height="5" rx="2.5" fill="#e9d5ff" />
      <rect x="176" y="182" width="12" height="12" rx="3" fill="#f3e8ff" />
      <rect x="194" y="186" width="58" height="5" rx="2.5" fill="#f3e8ff" />
    </Figure>
  );
}
