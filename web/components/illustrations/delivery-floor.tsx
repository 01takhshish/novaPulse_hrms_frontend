import { Figure, Panel } from "./shared";

/** IT & BPO: zoned delivery floor, badge reader on the boundary, 24/7 clock. */
export function DeliveryFloor({ className }: { className?: string }) {
  const pods = [
    { x: 26, y: 60 }, { x: 82, y: 60 },
    { x: 26, y: 122 }, { x: 82, y: 122 },
  ];
  return (
    <Figure ns="del" label="Zoned delivery floor with badge-controlled access and round-the-clock shifts" className={className}>
      <rect x="0" y="0" width="320" height="240" rx="18" fill="url(#del-soft)" opacity="0.55" />

      {/* Desk pods with headsets */}
      {pods.map((pod, i) => (
        <g key={i} className="np-float" style={{ animationDelay: `${i * 0.4}s` }}>
          <rect x={pod.x} y={pod.y} width="46" height="44" rx="8" fill="#ffffff" stroke="#e9d5ff" strokeWidth="2" />
          <rect x={pod.x + 8} y={pod.y + 8} width="30" height="18" rx="3" fill="#f3e8ff" />
          {/* headset */}
          <path d={`M${pod.x + 15} ${pod.y + 36} a8 8 0 0 1 16 0`} stroke="#7e22ce" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <rect x={pod.x + 12} y={pod.y + 34} width="5" height="8" rx="2.5" fill="#7e22ce" />
          <rect x={pod.x + 29} y={pod.y + 34} width="5" height="8" rx="2.5" fill="#7e22ce" />
        </g>
      ))}

      {/* Secure zone boundary */}
      <path d="M150 34 V206" stroke="#c084fc" strokeWidth="2.5" strokeDasharray="7 7" strokeLinecap="round" />
      <rect x="138" y="106" width="24" height="34" rx="7" fill="url(#del-violet)" />
      <rect x="143" y="114" width="14" height="9" rx="2" fill="#ffffff" opacity="0.85" />
      <circle className="np-pulse" cx="150" cy="132" r="3.6" fill="#86efac" />

      {/* Restricted zone */}
      <Panel x="176" y="34" width="122" height="96" />
      <rect x="188" y="48" width="52" height="6" rx="3" fill="#6b21a8" />
      <rect x="188" y="62" width="76" height="4" rx="2" fill="#e9d5ff" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="188" y={78 + i * 16} width="10" height="10" rx="2.5" fill="url(#del-violet)" />
          <rect x="204" y={81 + i * 16} width={72 - i * 14} height="4" rx="2" fill="#f3e8ff" />
        </g>
      ))}

      {/* 24/7 clock */}
      <circle cx="237" cy="176" r="34" fill="#ffffff" stroke="#e9d5ff" strokeWidth="2" />
      <circle cx="237" cy="176" r="26" fill="#faf5ff" />
      <g className="np-spin" style={{ transformOrigin: "237px 176px" }}>
        <rect x="235.5" y="156" width="3" height="22" rx="1.5" fill="#7e22ce" />
      </g>
      <rect x="235.5" y="162" width="3" height="16" rx="1.5" fill="#a855f7" transform="rotate(115 237 176)" />
      <circle cx="237" cy="176" r="3.4" fill="#6b21a8" />
      <text x="237" y="222" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6b21a8">24/7</text>
    </Figure>
  );
}
