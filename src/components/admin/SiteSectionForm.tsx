"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { SiteSection } from "@/types/database";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SubmitButton from "@/components/admin/SubmitButton";

type ActionResult = { error: string | null; success?: boolean } | undefined | void;

export interface SiteSectionFieldConfig {
  eyebrow?: boolean;
  title?: boolean;
  subtitle?: boolean;
  body?: boolean;
  image?: boolean;
  image2?: boolean;
  image2Label?: string;
  cta?: boolean;
  cta2?: boolean;
}

export default function SiteSectionForm({
  section,
  fields,
  action,
}: {
  section: SiteSection;
  fields: SiteSectionFieldConfig;
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    const result = await action(formData);
    setSubmitting(false);
    if (result?.error) toast.error(result.error);
    else toast.success("Section updated");
  }

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-6">
      {fields.eyebrow && (
        <TextField label="Eyebrow" name="eyebrow" defaultValue={section.eyebrow ?? ""} />
      )}
      {fields.title && <TextField label="Title" name="title" defaultValue={section.title ?? ""} />}
      {fields.subtitle && (
        <TextArea label="Subtitle" name="subtitle" defaultValue={section.subtitle ?? ""} rows={2} />
      )}
      {fields.body && <TextArea label="Body" name="body" defaultValue={section.body ?? ""} rows={3} />}

      {fields.image && (
        <ImageUploadField
          name="image"
          label="Image"
          defaultImages={section.image_url ? [section.image_url] : []}
          multiple={false}
        />
      )}
      {fields.image2 && (
        <ImageUploadField
          name="image2"
          label={fields.image2Label ?? "Second Image"}
          defaultImages={section.image_url_2 ? [section.image_url_2] : []}
          multiple={false}
        />
      )}

      {fields.cta && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Button Label" name="cta_label" defaultValue={section.cta_label ?? ""} />
          <TextField label="Button Link" name="cta_href" defaultValue={section.cta_href ?? ""} />
        </div>
      )}
      {fields.cta2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Second Button Label" name="cta2_label" defaultValue={section.cta2_label ?? ""} />
          <TextField label="Second Button Link" name="cta2_href" defaultValue={section.cta2_href ?? ""} />
        </div>
      )}

      <SubmitButton submitting={submitting} label="Save Changes" />
    </form>
  );
}

function TextField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="block text-xs">
      <span className="text-muted">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows = 3,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <label className="block text-xs">
      <span className="text-muted">{label}</span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
      />
    </label>
  );
}
