import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { updateTestimonial } from "@/lib/actions/testimonials";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: testimonial } = await supabase.from("testimonials").select("*").eq("id", id).single();

  if (!testimonial) notFound();

  const boundUpdate = updateTestimonial.bind(null, testimonial.id);

  return (
    <div>
      <h1 className="font-display text-2xl uppercase mb-8">Edit Testimonial</h1>
      <TestimonialForm testimonial={testimonial} action={boundUpdate} />
    </div>
  );
}
