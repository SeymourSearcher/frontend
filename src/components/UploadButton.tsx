"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCollectionVersion } from "@/contexts/CollectionVersionContext";
import { track } from "@/lib/analytics";
import { uploadSeymours } from "@/lib/api";

const STATUS_MS = 6000;

type Status = { tone: "ok" | "error"; text: string } | null;

interface UploadButtonProps {
  className: string;
  onRequireLogin: () => void;
}

export function UploadButton({ className, onRequireLogin }: UploadButtonProps) {
  const { user } = useAuth();
  const { bump } = useCollectionVersion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(null), STATUS_MS);
    return () => clearTimeout(timer);
  }, [status]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    const result = await uploadSeymours(file);
    setUploading(false);

    if (result.ok) {
      setStatus({
        tone: "ok",
        text: `Imported ${result.data.imported} (${result.data.skipped} skipped)`,
      });
      bump();
      track("collection_uploaded", { piece_count: result.data.imported });
    } else {
      setStatus({ tone: "error", text: `Upload failed: ${result.detail}` });
      track("upload_failed", { reason: result.detail });
    }
  }

  return (
    <>
      <button
        onClick={() => (user ? inputRef.current?.click() : onRequireLogin())}
        disabled={uploading}
        className={`${className} disabled:opacity-50 disabled:cursor-wait`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept=".txt,.json"
      />
      {status && (
        <span
          role="status"
          className={`text-[11px] max-w-[220px] ${
            status.tone === "ok" ? "text-green-400" : "text-red-400"
          }`}
        >
          {status.text}
        </span>
      )}
    </>
  );
}
