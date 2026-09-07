"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in the hosting provider's logs; swap for your error tracker.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-24">
      <div className="max-w-lg text-center">
        <span className="text-xs font-bold tracking-widest text-brand-800 uppercase">
          Something went wrong
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-4">
          We hit an unexpected error
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed mb-8">
          Please try again. If it keeps happening, contact us and we&rsquo;ll help directly.
          {error.digest && (
            <span className="block mt-3 font-mono text-[11px] text-slate-400">
              Reference: {error.digest}
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={reset}
          className="px-7 py-3.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
