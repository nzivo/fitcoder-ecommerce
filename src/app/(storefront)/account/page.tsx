import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import SignOutButton from "@/components/SignOutButton";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatMoney } from "@/lib/format";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectedFrom?: string }>;
}) {
  const { redirectedFrom } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-display text-2xl uppercase text-center mb-10">Account</h1>
        <AuthForm redirectTo={redirectedFrom ?? "/account"} />
      </div>
    );
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-2xl uppercase">My Orders</h1>
          <p className="text-sm text-muted mt-1">{user.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/account/wishlist" className="text-xs underline">
            Wishlist
          </Link>
          <SignOutButton />
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <p className="text-sm text-muted">You haven&apos;t placed any orders yet.</p>
      ) : (
        <div className="divide-y divide-border border-t border-b border-border">
          {orders.map((order) => (
            <div key={order.id} className="py-4 flex items-center justify-between text-sm">
              <div>
                <p>{order.paystack_reference}</p>
                <p className="text-muted text-xs mt-1">{formatDate(order.created_at)}</p>
              </div>
              <div className="text-right">
                <p>{formatMoney(order.total, order.currency)}</p>
                <p className="text-xs uppercase tracking-widest-xl text-muted mt-1">{order.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
