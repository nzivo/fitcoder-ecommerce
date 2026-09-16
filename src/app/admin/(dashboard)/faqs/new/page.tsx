import FaqForm from "@/components/admin/FaqForm";
import { createFaq } from "@/lib/actions/faqs";

export default function NewFaqPage() {
  return (
    <div>
      <h1 className="font-display text-2xl uppercase mb-8">Add FAQ</h1>
      <FaqForm action={createFaq} />
    </div>
  );
}
