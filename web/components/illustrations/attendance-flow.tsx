import { Figure, Panel } from "./shared";

/** Device → cloud → payslip, with a scanning sweep and travelling sync dots. */
export function AttendanceFlow({ className }: { className?: string }) {
  return (
    <Figure ns="att" label="Biometric device syncing attendance to the cloud and into payroll" className={className}>
      <rect x="0" y="0" width="320" height="240" rx="18" fill="url(#att-soft)" opacity="0.55" />

      {/* Terminal */}
      <Panel x="26" y="62" width="86" height="116" />
      <rect x="38" y="74" width="62" height="52" rx="7" fill="#faf5ff" stroke="#e9d5ff" strokeWidth="1.5" />
      {/* Fingerprint */}
      <g stroke="#7e22ce" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path d="M60 112c0-12 4-19 9-19s9 7 9 19" />
        <path d="M54 112c0-16 6-25 15-25s15 9 15 25" />
        <path d="M66 112c0-7 1-11 3-11s3 4 3 11" />
      </g>
      <rect className="np-scan" x="38" y="76" width="62" height="3" rx="1.5" fill="#a855f7" opacity="0.85" />
      <rect x="42" y="138" width="54" height="7" rx="3.5" fill="#e9d5ff" />
      <rect x="42" y="151" width="34" height="7" rx="3.5" fill="#f3e8ff" />

      {/* Flow path */}
      <path d="M118 120 C 150 120, 150 66, 186 66" stroke="#c084fc" strokeWidth="2.5"
        strokeDasharray="5 6" strokeLinecap="round" />
      <path d="M118 120 C 150 120, 150 176, 186 176" stroke="#c084fc" strokeWidth="2.5"
        strokeDasharray="5 6" strokeLinecap="round" />
      <circle className="np-travel" r="4" fill="#7e22ce" style={{ offsetPath: 'path("M118 120 C 150 120, 150 66, 186 66")', animationDuration: "2.6s", animationDelay: "0s" }} />
      <circle className="np-travel" r="4" fill="#a855f7" style={{ offsetPath: 'path("M118 120 C 150 120, 150 176, 186 176")', animationDuration: "2.6s", animationDelay: "1.3s" }} />

      {/* Cloud */}
      <g>
        <rect x="190" y="40" width="104" height="52" rx="14" fill="url(#att-violet)" />
        <path d="M212 66a9 9 0 0 1 9-9 12 12 0 0 1 23 2 8 8 0 0 1-1 16h-22a9 9 0 0 1-9-9Z" fill="#ffffff" opacity="0.92" />
        <circle className="np-pulse" cx="282" cy="52" r="4" fill="#86efac" />
      </g>

      {/* Payslip */}
      <Panel x="190" y="146" width="104" height="62" />
      <rect x="202" y="158" width="46" height="6" rx="3" fill="#6b21a8" />
      <rect x="202" y="170" width="70" height="5" rx="2.5" fill="#e9d5ff" />
      <rect x="202" y="180" width="58" height="5" rx="2.5" fill="#f3e8ff" />
      <circle cx="276" cy="188" r="11" fill="#dcfce7" />
      <path d="M271 188l3.5 3.5 6-7" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </Figure>
  );
}
