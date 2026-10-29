import { z } from "zod";

// ============================================================================
// 1. ÜRÜN VE KATALOG DOĞRULAMA ŞEMALARI
// ============================================================================

export const ProductInputSchema = z.object({
  sku: z
    .string()
    .min(3, "SKU en az 3 karakter olmalıdır.")
    .max(50, "SKU en fazla 50 karakter olabilir.")
    .regex(/^[A-Za-z0-9-_]+$/, "SKU yalnızca harf, rakam, tire ve alt çizgi içerebilir."),
  name: z
    .string()
    .min(3, "Ürün adı en az 3 karakter olmalıdır.")
    .max(255, "Ürün adı en fazla 255 karakter olabilir."),
  category_id: z.string().min(1, "Lütfen bir kategori seçin."),
  short_description: z.string().max(500).optional().nullable(),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır."),
  price: z.coerce.number().positive("Normal fiyat 0'dan büyük olmalıdır."),
  sale_price: z.coerce
    .number()
    .positive("İndirimli fiyat 0'dan büyük olmalıdır.")
    .optional()
    .nullable(),
  cost_price: z.coerce.number().nonnegative("Maliyet fiyatı negatif olamaz.").optional().nullable(),
  stock_quantity: z.coerce.number().int().nonnegative("Stok miktarı negatif olamaz."),
  critical_stock_threshold: z.coerce.number().int().nonnegative().default(3),
  material: z.string().min(2, "Materyal bilgisi girilmelidir.").optional().nullable(),
  stone_type: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  weight_grams: z.coerce.number().positive().optional().nullable(),
  care_instructions: z.string().optional().nullable(),
  package_contents: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(true),
  images: z.array(z.string().url("Geçerli bir görsel bağlantısı olmalıdır.")).default([]),
}).refine(
  (data) => {
    if (data.sale_price !== null && data.sale_price !== undefined) {
      return data.sale_price < data.price;
    }
    return true;
  },
  {
    message: "İndirimli fiyat, normal fiyattan küçük olmalıdır.",
    path: ["sale_price"],
  }
);

// Excel ve CSV Satır Doğrulama Şeması (Bölüm 6.4)
export const CsvProductRowSchema = z.object({
  sku: z.string().min(2, "SKU zorunludur."),
  name: z.string().min(2, "Ürün adı zorunludur."),
  category: z.string().min(2, "Kategori adı zorunludur."),
  short_description: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive("Fiyat pozitif bir sayı olmalıdır."),
  sale_price: z.coerce.number().positive().optional().nullable(),
  stock_quantity: z.coerce.number().int().nonnegative("Stok negatif olamaz."),
  color: z.string().optional().nullable(),
  material: z.string().optional().nullable(),
  stone_type: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  weight: z.coerce.number().positive().optional().nullable(),
  is_active: z.preprocess((val) => {
    if (typeof val === "string") {
      const lower = val.toLowerCase().trim();
      return lower === "true" || lower === "1" || lower === "aktif" || lower === "evet";
    }
    return Boolean(val);
  }, z.boolean().default(true)),
  image_urls: z.preprocess((val) => {
    if (typeof val === "string" && val.trim().length > 0) {
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (Array.isArray(val)) return val;
    return [];
  }, z.array(z.string()).default([])),
});

// ============================================================================
// 2. SEPET VE SİPARİŞ DOĞRULAMA ŞEMALARI
// ============================================================================

export const AddToCartSchema = z.object({
  product_id: z.string().min(1, "Ürün ID zorunludur."),
  variant_id: z.string().optional().nullable(),
  quantity: z.coerce.number().int().positive("Adet en az 1 olmalıdır."),
});

export const AddressSchema = z.object({
  title: z.string().min(2, "Adres başlığı giriniz (Örn: Evim, İşyeri)."),
  first_name: z.string().min(2, "Ad en az 2 karakter olmalıdır."),
  last_name: z.string().min(2, "Soyad en az 2 karakter olmalıdır."),
  phone: z
    .string()
    .min(10, "Telefon numarası en az 10 haneli olmalıdır.")
    .regex(/^(\+90|0)?[0-9]{10}$/, "Geçerli bir Türkiye telefon numarası giriniz (Örn: 05321234567)."),
  address_line1: z.string().min(10, "Cadde, sokak ve kapı numarası içeren açık adres yazınız."),
  address_line2: z.string().optional().nullable(),
  district: z.string().min(2, "İlçe bilgisi zorunludur."),
  city: z.string().min(2, "İl bilgisi zorunludur."),
  country: z.string().default("Türkiye"),
  postal_code: z.string().optional().nullable(),
  corporate_company_name: z.string().optional().nullable(),
  corporate_tax_office: z.string().optional().nullable(),
  corporate_tax_number: z.string().optional().nullable(),
});

export const CheckoutOrderSchema = z.object({
  guest_email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  guest_phone: z.string().min(10, "Geçerli bir telefon numarası giriniz."),
  guest_name: z.string().min(3, "Ad ve soyad giriniz."),
  shipping_address: AddressSchema,
  billing_address: AddressSchema,
  coupon_code: z.string().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  items: z.array(
    z.object({
      product_id: z.string(),
      variant_id: z.string().optional().nullable(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Sepetinizde en az 1 ürün bulunmalıdır."),
  agreed_to_terms: z.literal(true, {
    errorMap: () => ({ message: "Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formunu kabul etmelisiniz." }),
  }),
});

// ============================================================================
// 3. İADE TALEBİ ŞEMASI
// ============================================================================

export const ReturnRequestSchema = z.object({
  order_number: z.string().min(1, "Sipariş numarası zorunludur."),
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  return_reason: z.enum([
    "wrong_size",
    "defective",
    "different_than_pictured",
    "changed_mind",
    "other",
  ], {
    errorMap: () => ({ message: "Lütfen bir iade nedeni seçin." }),
  }),
  customer_notes: z.string().min(10, "Lütfen iade gerekçenizi en az 10 karakterle açıklayın."),
});
