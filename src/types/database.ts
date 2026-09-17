export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type SiteSectionId = "hero" | "story" | "winter_banner" | "lifestyle_banner";

export type SiteSection = {
  id: SiteSectionId;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  image_url: string | null;
  image_url_2: string | null;
  cta_label: string | null;
  cta_href: string | null;
  cta2_label: string | null;
  cta2_href: string | null;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  customer_name: string;
  product_name: string | null;
  rating: number;
  quote: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type FaqPlacement = "home" | "shop";

export type Faq = {
  id: string;
  placement: FaqPlacement;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  category_id: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
};

export type ShippingAddress = {
  full_name: string;
  phone: string;
  email: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  country: string;
  postal_code?: string;
};

export type Order = {
  id: string;
  user_id: string | null;
  email: string;
  status: OrderStatus;
  subtotal: number;
  shipping_fee: number;
  total: number;
  currency: string;
  paystack_reference: string | null;
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
};

export type WishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock: number;
  created_at: string;
  updated_at: string;
};

type TableDef<Row, InsertDefaults extends keyof Row = never> = {
  Row: Row;
  Insert: Partial<Pick<Row, InsertDefaults>> & Omit<Row, InsertDefaults>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      categories: TableDef<Category, "id" | "created_at" | "sort_order" | "is_active">;
      site_sections: TableDef<SiteSection, "updated_at">;
      testimonials: TableDef<Testimonial, "id" | "created_at" | "sort_order" | "is_active" | "rating">;
      faqs: TableDef<Faq, "id" | "created_at" | "sort_order" | "is_active" | "placement">;
      products: TableDef<
        Product,
        | "id"
        | "created_at"
        | "updated_at"
        | "currency"
        | "images"
        | "sizes"
        | "colors"
        | "stock"
        | "is_active"
        | "is_featured"
        | "description"
        | "compare_at_price"
        | "category_id"
      >;
      profiles: TableDef<Profile, "created_at" | "is_admin" | "full_name">;
      orders: TableDef<
        Order,
        | "id"
        | "created_at"
        | "updated_at"
        | "user_id"
        | "status"
        | "subtotal"
        | "shipping_fee"
        | "total"
        | "currency"
        | "paystack_reference"
      >;
      order_items: TableDef<OrderItem, "id" | "product_id" | "product_image" | "size" | "color">;
      wishlist_items: TableDef<WishlistItem, "id" | "created_at">;
      product_variants: TableDef<ProductVariant, "id" | "created_at" | "updated_at" | "stock">;
    };
    Views: Record<string, never>;
    Functions: {
      decrement_stock: {
        Args: { p_product_id: string; p_quantity: number };
        Returns: void;
      };
      decrement_variant_stock: {
        Args: { p_product_id: string; p_size: string; p_color: string; p_quantity: number };
        Returns: void;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
