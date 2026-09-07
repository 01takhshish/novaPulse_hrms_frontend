import { Figure, Panel, Person } from "./shared";

/** Manufacturing: plant with a smoking stack, a three-arm turnstile, shift queue. */
export function FactoryFloor({ className }: { className?: string }) {
  return (
    <Figure ns="fac" label="Factory gate with turnstiles handling a shift change" className={className}>
      <rect x="0" y="0" width="320" height="240" rx="18" fill="url(#fac-soft)" opacity="0.55" />

      {/* Chimney with smoke */}
      <rect x="112" y="58" width="18" height="52" rx="3" fill="#6b21a8" />
      <rect x="109" y="54" width="24" height="8" rx="3" fill="#3b0764" />
      <circle className="np-float" cx="121" cy="42" r="7" fill="#e9d5ff" opacity="0.9" />
      <circle className="np-float" cx="133" cy="28" r="5" fill="#f3e8ff" opacity="0.8"
        style={{ animationDelay: "0.7s" }} />

      {/* Sawtooth roof + plant */}
      <path d="M20 92 L42 70 L42 92 L64 70 L64 92 L86 70 L86 92 L108 70 L108 92 Z" fill="url(#fac-violet)" />
      <rect x="20" y="92" width="90" height="76" rx="6" fill="#ffffff" stroke="#e9d5ff" strokeWidth="2" />
      <rect x="32" y="108" width="20" height="18" rx="3" fill="#f3e8ff" />
      <rect x="60" y="108" width="20" height="18" rx="3" fill="#f3e8ff" />
      <rect x="88" y="108" width="12" height="18" rx="3" fill="#f3e8ff" />
      <rect x="32" y="138" width="50" height="30" rx="4" fill="#faf5ff" stroke="#e9d5ff" strokeWidth="1.5" />

      {/* Turnstile: hub with three arms 120 degrees apart, so it reads correctly
          at any point in the rotation. */}
      <rect x="150" y="110" width="86" height="60" rx="8" fill="#ffffff" stroke="#e9d5ff" strokeWidth="2" />
      <rect x="158" y="120" width="9" height="40" rx="4" fill="url(#fac-violet)" />
      <rect x="219" y="120" width="9" height="40" rx="4" fill="url(#fac-violet)" />
      <g className="np-spin" style={{ transformOrigin: "193px 140px" }}>
        {[0, 120, 240].map((deg) => (
          <rect key={deg} x="191" y="118" width="4.5" height="24" rx="2.25" fill="#a855f7"
            transform={`rotate(${deg} 193 140)`} />
        ))}
      </g>
      <circle cx="193" cy="140" r="6" fill="#6b21a8" />
      <circle className="np-pulse" cx="163" cy="110" r="4" fill="#86efac" />

      {/* Queue walking through */}
      <Person x={254} y={124} />
      <Person x={276} y={124} scale={0.9} fill="#a855f7" />
      <Person x={296} y={124} scale={0.8} fill="#c084fc" />
      <circle className="np-travel" r="4" fill="#7e22ce"
        style={{ offsetPath: 'path("M246 140 L152 140")', animationDuration: "3s", animationDelay: "0s" }} />
      <circle className="np-travel" r="4" fill="#a855f7"
        style={{ offsetPath: 'path("M292 140 L152 140")', animationDuration: "3s", animationDelay: "1.5s" }} />

      {/* Throughput readout */}
      <Panel x="150" y="182" width="150" height="42" />
      <rect x="162" y="194" width="52" height="6" rx="3" fill="#6b21a8" />
      <rect x="162" y="206" width="94" height="5" rx="2.5" fill="#e9d5ff" />
      <circle cx="284" cy="203" r="10" fill="#dcfce7" />
      <path d="M279 203l3.5 3.5 6-7" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </Figure>
  );
}
