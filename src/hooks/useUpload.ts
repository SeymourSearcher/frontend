"use client";

import { useState, useRef } from "react";
import { uploadSeymours } from "@/lib/api";

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const result = await uploadSeymours(file);
    setUploading(false);

    if (result) {
      alert(`Imported ${result.imported} seymours (${result.skipped} skipped)`);
    } else {
      alert("Upload failed. Please log in first.");
    }

    e.target.value = "";
  }

  function triggerUpload() {
    fileInputRef.current?.click();
  }

  return { fileInputRef, handleFileChange, triggerUpload, uploading };
}

