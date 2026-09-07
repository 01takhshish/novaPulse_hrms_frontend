import { Figure, Panel } from "./shared";

/** Timesheets through a rules engine, out as payslips. */
export function PayrollFlow({ className }: { className?: string }) {
  return (
    <Figure ns="pay" label="Timesheets processed through payroll rules into salary slips" className={className}>
      <rect x="0" y="0" width="320" height="240" rx="18" fill="url(#pay-soft)" opacity="0.55" />

      {[0, 1, 2].map((i) => (
        <g key={i} className="np-float" style={{ animationDelay: `${i * 0.4}s` }}>
          <Panel x={20 + i * 10} y={54 + i * 34} width="78" height="30" />
          <rect x={30 + i * 10} y={62 + i * 34} width="34" height="5" rx="2.5" fill="#6b21a8" />
          <rect x={30 + i * 10} y={72 + i * 34} width="52" height="4" rx="2" fill="#e9d5ff" />
        </g>
      ))}

      <path d="M112 108 L140 108" stroke="#c084fc" strokeWidth="2.5" strokeDasharray="5 6" strokeLinecap="round" />

      {/* Rules engine */}
      <g className="np-spin" style={{ transformOrigin: "176px 108px" }}>
        <path
          d="M176 76 l7 3 6-6 8 8-6 6 3 7 8 2v12l-8 2-3 7 6 6-8 8-6-6-7 3-2 8h-12l-2-8-7-3-6 6-8-8 6-6-3-7-8-2v-12l8-2 3-7-6-6 8-8 6 6 7-3 2-8h12z"
          fill="url(#pay-violet)" opacity="0.9"
        />
      </g>
      <circle cx="176" cy="108" r="13" fill="#faf5ff" />
      <text x="176" y="114" textAnchor="middle" fontSize="15" fontWeight="700" fill="#6b21a8">₹</text>

      <path d="M212 108 L240 108" stroke="#c084fc" strokeWidth="2.5" strokeDasharray="5 6" strokeLinecap="round" />
      <circle className="np-travel" r="4" fill="#7e22ce" style={{ offsetPath: 'path("M212 108 L240 108")', animationDuration: "2.4s", animationDelay: "0s" }} />

      {/* Payslips */}
      <Panel x="238" y="62" width="66" height="92" />
      <rect x="250" y="76" width="30" height="6" rx="3" fill="#6b21a8" />
      <rect x="250" y="90" width="42" height="4" rx="2" fill="#e9d5ff" />
      <rect x="250" y="100" width="34" height="4" rx="2" fill="#f3e8ff" />
      <rect x="250" y="110" width="40" height="4" rx="2" fill="#f3e8ff" />
      <circle cx="286" cy="138" r="11" fill="#dcfce7" />
      <path d="M281 138l3.5 3.5 6-7" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </Figure>
  );
}
