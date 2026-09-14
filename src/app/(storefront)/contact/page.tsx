import SimplePage from "@/components/SimplePage";

export default function ContactPage() {
  return (
    <SimplePage title="Contact">
      <p>
        Questions about your order, sizing, or a wholesale inquiry? Reach the Fit Coder team via{" "}
        <a href="mailto:support@fitcoder.com" className="underline">
          support@fitcoder.com
        </a>{" "}
        and we&apos;ll get back to you within 1–2 business days.
      </p>
    </SimplePage>
  );
}
