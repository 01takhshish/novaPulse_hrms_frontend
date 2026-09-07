import { Figure, Panel } from "./shared";

/** Candidate cards funnelling down to a verified hire. */
export function HiringScene({ className }: { className?: string }) {
  return (
    <Figure ns="hir" label="Candidate shortlisting and verification pipeline" className={className}>
      <rect x="0" y="0" width="320" height="240" rx="18" fill="url(#hir-soft)" opacity="0.55" />

      {[0, 1, 2].map((i) => (
        <g key={i} className="np-float" style={{ animationDelay: `${i * 0.45}s` }}>
          <Panel x={26 + i * 6} y={28 + i * 40} width="120" height="34" />
          <circle cx={46 + i * 6} cy={45 + i * 40} r="10" fill="url(#hir-violet)" />
          <path d={`M${41 + i * 6} ${49 + i * 40}a5 5 0 0 1 10 0`} fill="#ffffff" opacity="0.9" />
          <circle cx={46 + i * 6} cy={42 + i * 40} r="3.4" fill="#ffffff" opacity="0.9" />
          <rect x={62 + i * 6} y={38 + i * 40} width="44" height="5" rx="2.5" fill="#6b21a8" />
          <rect x={62 + i * 6} y={48 + i * 40} width="62" height="4" rx="2" fill="#e9d5ff" />
        </g>
      ))}

      {/* Funnel */}
      <path d="M168 40 L292 40 L246 112 L246 176 L214 196 L214 112 Z"
        fill="url(#hir-violet)" opacity="0.14" stroke="#c084fc" strokeWidth="2" strokeLinejoin="round" />
      <circle className="np-travel" r="4.5" fill="#7e22ce" style={{ offsetPath: 'path("M196 46 L230 108 L230 168")', animationDuration: "3s", animationDelay: "0s" }} />
      <circle className="np-travel" r="4.5" fill="#a855f7" style={{ offsetPath: 'path("M262 46 L230 108 L230 168")', animationDuration: "3s", animationDelay: "1.5s" }} />

      {/* Verified hire */}
      <Panel x="184" y="184" width="92" height="38" />
      <circle cx="204" cy="203" r="11" fill="#dcfce7" />
      <path d="M199 203l3.5 3.5 6-7" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="222" y="195" width="42" height="5" rx="2.5" fill="#6b21a8" />
      <rect x="222" y="205" width="30" height="4" rx="2" fill="#e9d5ff" />
    </Figure>
  );
}
