/**
 * ZeynepNova E-Ticaret Veritabanı Tip Tanımları
 */

export type UserRole =
  | "SuperAdmin"
  | "StoreAdmin"
  | "ProductManager"
  | "OrderManager"
  | "ContentEditor"
  | "SupportAgent"
  | "ReadOnlyAnalyst"
  | "Customer";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  tc_identity_number?: string | null;
  is_active: boolean;
  marketing_consent: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  assigned_by?: string | null;
  created_at: string;
}

export interface Address {
  id: string;
  user_id?: string | null;
  title: string;
  first_name: string;
  last_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  neighborhood?: string | null;
  district: string;
  city: string;
  postal_code?: string | null;
  country: string;
  address_type: "shipping" | "billing" | "both";
  is_default: boolean;
  corporate_company_name?: string | null;
  corporate_tax_office?: string | null;
  corporate_tax_number?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  parent_id?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  display_order: number;
  is_active: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id?: string | null;
  sku: string;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  price: number;
  sale_price?: number | null;
  cost_price?: number | null;
  stock_quantity: number;
  critical_stock_threshold: number;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  material?: string | null;
  stone_type?: string | null;
  color?: string | null;
  size?: string | null;
  weight_grams?: number | null;
  care_instructions?: string | null;
  package_contents?: string | null;
  estimated_delivery_days?: number | null;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  name: string;
  price_difference: number;
  stock_quantity: number;
  option_name: string;
  option_value: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface InventoryMovement {
  id: string;
  product_id: string;
  variant_id?: string | null;
  quantity_change: number;
  new_quantity: number;
  movement_type: "sale" | "return" | "restock" | "adjustment" | "import";
  reference_type?: "order" | "return" | "admin" | "import" | null;
  reference_id?: string | null;
  reason?: string | null;
  created_by?: string | null;
  created_at: string;
}

export type OrderStatus =
  | "pending_payment"
  | "verifying_payment"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "return_inspecting"
  | "return_approved"
  | "return_rejected"
  | "return_completed";

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  guest_email?: string | null;
  guest_phone?: string | null;
  guest_name?: string | null;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total_amount: number;
  shipping_address: Address;
  billing_address: Address;
  coupon_code?: string | null;
  notes?: string | null;
  admin_notes?: string | null;
  tracking_number?: string | null;
  shipping_carrier?: string | null;
  tracking_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string | null;
  sku: string;
  product_name: string;
  variant_name?: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
  image_url?: string | null;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed_amount";
  discount_value: number;
  min_cart_amount?: number | null;
  max_discount_amount?: number | null;
  usage_limit?: number | null;
  usage_count: number;
  per_customer_limit: number;
  start_date?: string | null;
  end_date?: string | null;
  is_active: boolean;
  free_shipping: boolean;
  created_at: string;
}

export interface StoreSettings {
  id: string;
  site_name: string;
  support_email: string;
  support_phone: string;
  company_legal_name: string;
  company_address: string;
  tax_office?: string | null;
  tax_number?: string | null;
  mersis_number?: string | null;
  free_shipping_threshold: number;
  standard_shipping_fee: number;
  currency: string;
  timezone: string;
  iyzico_test_mode: boolean;
  created_at: string;
  updated_at: string;
}
