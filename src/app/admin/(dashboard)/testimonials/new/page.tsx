import TestimonialForm from "@/components/admin/TestimonialForm";
import { createTestimonial } from "@/lib/actions/testimonials";

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="font-display text-2xl uppercase mb-8">Add Testimonial</h1>
      <TestimonialForm action={createTestimonial} />
    </div>
  );
}
