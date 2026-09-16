import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SiteSectionForm, { type SiteSectionFieldConfig } from "@/components/admin/SiteSectionForm";
import { updateSiteSection } from "@/lib/actions/site-content";
import type { SiteSectionId } from "@/types/database";

const CONFIG: Record<SiteSectionId, { label: string; fields: SiteSectionFieldConfig }> = {
  hero: {
    label: "Homepage Hero",
    fields: { eyebrow: true, title: true, subtitle: true, image: true, cta: true, cta2: true },
  },
  story: {
    label: "Our Story Section",
    fields: {
      eyebrow: true,
      title: true,
      body: true,
      image: true,
      image2: true,
      image2Label: "Second Image",
      cta: true,
    },
  },
  winter_banner: {
    label: "Seasonal Collection Banner",
    fields: { eyebrow: true, title: true, image: true, cta: true },
  },
  lifestyle_banner: {
    label: "Lifestyle Banner",
    fields: { title: true, subtitle: true, image: true, cta: true },
  },
};

export default async function EditSiteSectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!(id in CONFIG)) notFound();
  const sectionId = id as SiteSectionId;

  const supabase = await createClient();
  const { data: section } = await supabase.from("site_sections").select("*").eq("id", sectionId).single();

  if (!section) notFound();

  const boundUpdate = updateSiteSection.bind(null, sectionId);
  const { label, fields } = CONFIG[sectionId];

  return (
    <div>
      <h1 className="font-display text-2xl uppercase mb-8">{label}</h1>
      <SiteSectionForm section={section} fields={fields} action={boundUpdate} />
    </div>
  );
}
