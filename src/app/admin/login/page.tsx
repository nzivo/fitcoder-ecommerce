import AuthForm from "@/components/AuthForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectedFrom?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <h1 className="font-display text-2xl uppercase text-center mb-2">Admin</h1>
      <p className="text-center text-sm text-muted mb-8">Sign in to manage orders and products.</p>
      {error === "not_authorized" && (
        <p className="text-center text-sm text-danger mb-6">
          That account doesn&apos;t have admin access.
        </p>
      )}
      <AuthForm redirectTo="/admin" />
    </div>
  );
}
