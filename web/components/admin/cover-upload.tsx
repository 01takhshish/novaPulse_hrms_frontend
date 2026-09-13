"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FaImage, FaXmark } from "react-icons/fa6";

const ACCEPT = "image/jpeg,image/png,image/webp";
const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Uploads straight to /api/admin/upload and keeps only the returned URL in a
 * hidden input, so the form submit stays a small text payload. The server
 * re-checks type and size — these checks are here purely to fail fast.
 */
export function CoverUpload({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function upload(file: File) {
    setMessage(null);
    if (file.size > MAX_BYTES) return setMessage("Image must be under 4 MB.");
    if (!ACCEPT.split(",").includes(file.type)) {
      return setMessage("Only JPG, PNG and WebP images are accepted.");
    }

    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(payload.error ?? "Upload failed.");
        return;
      }
      onChange(payload.url);
    } catch {
      setMessage("Upload failed — check your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input type="hidden" name="coverUrl" value={value} />

      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-slate-200">
          {/* Unoptimised: this is an admin preview of an image that may have
              been uploaded seconds ago, so the optimiser has nothing cached. */}
          <Image
            src={value}
            alt=""
            width={480}
            height={270}
            unoptimized
            className="h-32 w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove cover image"
            className="absolute top-2 right-2 rounded-lg bg-slate-900/80 p-1.5 text-white transition-colors hover:bg-slate-900"
          >
            <FaXmark className="text-xs" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer.files?.[0];
            if (file) void upload(file);
          }}
          disabled={busy}
          className={`flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-xs font-semibold transition-colors ${
            dragging
              ? "border-brand-500 bg-brand-50 text-brand-800"
              : "border-slate-200 text-slate-500 hover:border-brand-400 hover:text-brand-800"
          } disabled:opacity-60`}
        >
          <FaImage className="text-base" />
          {busy ? "Uploading…" : "Drop an image, or browse"}
          <span className="text-[10px] font-normal text-slate-400">JPG, PNG or WebP · max 4 MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
          // Reset so re-picking the same file after a failure still fires.
          event.target.value = "";
        }}
      />

      {(message || error) && (
        <p className="mt-2 text-[11px] font-semibold text-rose-600">{message ?? error}</p>
      )}
    </div>
  );
}
