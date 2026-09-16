import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FaqForm from "@/components/admin/FaqForm";
import { updateFaq } from "@/lib/actions/faqs";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: faq } = await supabase.from("faqs").select("*").eq("id", id).single();

  if (!faq) notFound();

  const boundUpdate = updateFaq.bind(null, faq.id);

  return (
    <div>
      <h1 className="font-display text-2xl uppercase mb-8">Edit FAQ</h1>
      <FaqForm faq={faq} action={boundUpdate} />
    </div>
  );
}
