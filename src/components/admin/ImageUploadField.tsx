"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function ImageUploadField({
  name,
  label,
  defaultImages = [],
  multiple = true,
}: {
  name: string;
  label: string;
  defaultImages?: string[];
  multiple?: boolean;
}) {
  const [existing, setExisting] = useState(defaultImages);
  const [previews, setPreviews] = useState<string[]>([]);

  function removeExisting(url: string) {
    setExisting((prev) => prev.filter((u) => u !== url));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    previews.forEach((url) => URL.revokeObjectURL(url));
    const files = Array.from(e.target.files ?? []);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  return (
    <div>
      <p className="text-xs text-muted mb-2">{label}</p>
      <input type="hidden" name={`${name}_existing`} value={existing.join(",")} />

      {(existing.length > 0 || previews.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-3">
          {existing.map((url) => (
            <div key={url} className="relative w-20 h-24 bg-surface-2 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeExisting(url)}
                aria-label="Remove image"
                className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {previews.map((url, i) => (
            <div
              key={url}
              className="relative w-20 h-24 bg-surface-2 overflow-hidden border border-dashed border-border"
              title="Will be uploaded on save"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <span className="absolute bottom-0 inset-x-0 bg-background/80 text-[9px] text-center py-0.5">
                #{i + 1} new
              </span>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        name={`${name}_new`}
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="block w-full text-xs text-muted file:mr-3 file:py-2 file:px-3 file:border file:border-border file:bg-surface file:text-foreground file:text-xs file:uppercase file:tracking-wide file:cursor-pointer"
      />
    </div>
  );
}
