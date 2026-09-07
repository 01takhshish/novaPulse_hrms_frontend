import { Figure, Panel } from "./shared";

/** Camera with a sweeping cone, a controlled door and a shield badge. */
export function SecurityScene({ className }: { className?: string }) {
  return (
    <Figure ns="sec" label="CCTV camera, access-controlled door and security shield" className={className}>
      <rect x="0" y="0" width="320" height="240" rx="18" fill="url(#sec-soft)" opacity="0.55" />

      {/* Camera + sweep */}
      <g className="np-sweep" style={{ transformOrigin: "70px 60px" }}>
        <path d="M70 60 L172 122 L172 22 Z" fill="#a855f7" opacity="0.16" />
      </g>
      <rect x="34" y="46" width="44" height="24" rx="7" fill="url(#sec-violet)" />
      <circle cx="72" cy="58" r="7" fill="#faf5ff" />
      <circle cx="72" cy="58" r="3" fill="#3b0764" />
      <rect x="50" y="28" width="6" height="20" rx="3" fill="#6b21a8" />
      <rect x="38" y="22" width="30" height="7" rx="3.5" fill="#3b0764" />
      <circle className="np-pulse" cx="42" cy="58" r="3.5" fill="#f87171" />

      {/* Door */}
      <Panel x="112" y="96" width="82" height="118" />
      <rect x="124" y="108" width="58" height="94" rx="6" fill="#faf5ff" stroke="#e9d5ff" strokeWidth="1.5" />
      <circle cx="172" cy="156" r="4" fill="#7e22ce" />
      <rect x="130" y="118" width="30" height="5" rx="2.5" fill="#e9d5ff" />
      {/* Reader */}
      <rect x="196" y="128" width="24" height="34" rx="6" fill="url(#sec-violet)" />
      <circle className="np-pulse" cx="208" cy="140" r="4" fill="#86efac" />
      <rect x="202" y="150" width="12" height="3" rx="1.5" fill="#ffffff" opacity="0.7" />

      {/* Shield */}
      <path d="M254 58c14 0 26-5 26-5s12 5 26 5v34c0 24-19 36-26 39-7-3-26-15-26-39V58Z"
        fill="url(#sec-deep)" transform="translate(-26 8)" />
      <path d="M242 108l8 8 15-17" stroke="#c084fc" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />

      {/* Visitor log */}
      <Panel x="214" y="160" width="80" height="54" />
      <rect x="224" y="172" width="36" height="5" rx="2.5" fill="#6b21a8" />
      <rect x="224" y="183" width="58" height="4" rx="2" fill="#e9d5ff" />
      <rect x="224" y="192" width="48" height="4" rx="2" fill="#f3e8ff" />
      <rect x="224" y="201" width="54" height="4" rx="2" fill="#f3e8ff" />
    </Figure>
  );
}
