import Link from "next/link";
import Image from "next/image";
import SocialIcons from "@/components/layout/SocialIcons";
import NewsletterForm from "@/components/layout/NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Image
            src="/logo.svg"
            alt="Fit Coder"
            width={1000}
            height={200}
            unoptimized
            className="h-6 w-auto mb-3"
          />
          <p className="text-sm text-muted max-w-xs">
            Fit Coder isn&apos;t just a clothing brand. It&apos;s your statement to the world.
          </p>
          <div className="mt-5 text-muted">
            <SocialIcons size={18} />
          </div>
        </div>

        <FooterColumn
          title="About"
          links={[
            { label: "Our Story", href: "/#our-story" },
            { label: "Contact", href: "/contact" },
            { label: "Blog", href: "/blog" },
            { label: "Ambassador Program", href: "/ambassador" },
          ]}
        />

        <FooterColumn
          title="Customers"
          links={[
            { label: "Shipping Policy", href: "/shipping" },
            { label: "Returns", href: "/returns" },
            { label: "Track Order", href: "/account" },
          ]}
        />

        <div>
          <p className="text-xs tracking-widest-xl uppercase mb-4">Join the Legends Club</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted tracking-wide">
          <p>© {new Date().getFullYear()} Fit Coder</p>
          <p className="uppercase tracking-widest-xl">Secure Checkout</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs tracking-widest-xl uppercase mb-4">{title}</p>
      <ul className="space-y-2 text-sm text-muted">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-foreground transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
