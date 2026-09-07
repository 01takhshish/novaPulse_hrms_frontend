import { Figure, Panel } from "./shared";

/** Retail: several storefronts reporting into one central dashboard. */
export function MultiSiteNetwork({ className }: { className?: string }) {
  const stores = [
    { x: 20, y: 40 },
    { x: 20, y: 104 },
    { x: 20, y: 168 },
  ];
  return (
    <Figure ns="mul" label="Multiple store locations reporting into one central dashboard" className={className}>
      <rect x="0" y="0" width="320" height="240" rx="18" fill="url(#mul-soft)" opacity="0.55" />

      {stores.map((store, i) => (
        <g key={i}>
          {/* Awning + shopfront */}
          <path d={`M${store.x} ${store.y + 14} h72 l-8 12 h-56 z`} fill="url(#mul-violet)" />
          <rect x={store.x + 8} y={store.y + 26} width="56" height="34" rx="5" fill="#ffffff" stroke="#e9d5ff" strokeWidth="2" />
          <rect x={store.x + 16} y={store.y + 34} width="16" height="18" rx="3" fill="#f3e8ff" />
          <rect x={store.x + 38} y={store.y + 34} width="18" height="18" rx="3" fill="#faf5ff" stroke="#e9d5ff" strokeWidth="1.2" />
          <circle className="np-pulse" cx={store.x + 68} cy={store.y + 22} r="3.5" fill="#86efac"
            style={{ animationDelay: `${i * 0.5}s` }} />
          {/* Link to hub */}
          <path d={`M${store.x + 72} ${store.y + 43} C 130 ${store.y + 43}, 140 120, 186 120`}
            stroke="#c084fc" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
          <circle className="np-travel" r="3.5" fill="#7e22ce"
            style={{
              offsetPath: `path("M${store.x + 72} ${store.y + 43} C 130 ${store.y + 43}, 140 120, 186 120")`,
              animationDuration: "2.8s",
              animationDelay: `${i * 0.7}s`,
            }} />
        </g>
      ))}

      {/* Central dashboard */}
      <Panel x="186" y="52" width="112" height="136" />
      <rect x="198" y="66" width="46" height="6" rx="3" fill="#6b21a8" />
      <rect x="198" y="80" width="66" height="4" rx="2" fill="#e9d5ff" />
      {/* Consolidated bars */}
      {[
        { x: 200, h: 26 },
        { x: 222, h: 42 },
        { x: 244, h: 34 },
        { x: 266, h: 54 },
      ].map((bar, i) => (
        <rect key={i} x={bar.x} y={152 - bar.h} width="14" height={bar.h} rx="4"
          fill={i === 3 ? "url(#mul-violet)" : "#e9d5ff"} className="np-grow"
          style={{ transformOrigin: `${bar.x}px 152px`, animationDelay: `${i * 0.14}s` }} />
      ))}
      <rect x="198" y="160" width="88" height="5" rx="2.5" fill="#f3e8ff" />
      <rect x="198" y="172" width="60" height="5" rx="2.5" fill="#f3e8ff" />
      <circle cx="284" cy="66" r="9" fill="#dcfce7" />
      <path d="M280 66l3 3 5-6" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Figure>
  );
}
