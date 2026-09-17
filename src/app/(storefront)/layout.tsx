import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import WishlistSync from "@/components/layout/WishlistSync";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WishlistSync />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
