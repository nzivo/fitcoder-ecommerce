import SimplePage from "@/components/SimplePage";

export default function ReturnsPage() {
  return (
    <SimplePage title="Returns">
      <p>Unworn items in original condition can be returned within 14 days of delivery for a full refund.</p>
      <p>
        To start a return, email{" "}
        <a href="mailto:support@dopebeyond.com" className="underline">
          support@dopebeyond.com
        </a>{" "}
        with your order reference.
      </p>
    </SimplePage>
  );
}
