import { Product, Category, Order, OrderItem, Coupon, StoreSettings, UserRole } from "./types";

// ============================================================================
// BAŞLANGIÇ ÇEKİRDEK VERİLERİ (IN-MEMORY & OFFLINE PERSISTENCE)
// ============================================================================

let categoriesState: Category[] = [
  {
    id: "c0000001-0000-0000-0000-000000000001",
    name: "Kolyeler",
    slug: "kolyeler",
    description: "925 ayar gümüş ve altın kaplama zarif kolye modelleri.",
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c0000002-0000-0000-0000-000000000002",
    name: "Küpeler",
    slug: "kupeler",
    description: "Halka, sallantılı, inci ve baget kesim küpe tasarımları.",
    image_url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80",
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c0000003-0000-0000-0000-000000000003",
    name: "Yüzükler",
    slug: "yuzukler",
    description: "Zarif tektaşlar, ayarlanabilir yüzükler ve şövalye modelleri.",
    image_url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c0000004-0000-0000-0000-000000000004",
    name: "Bileklikler",
    slug: "bileklikler",
    description: "İtalyan ezme zincirler, kelepçeler ve su yolu bileklikler.",
    image_url: "https://images.unsplash.com/photo-1611591475152-473523dd66c4?auto=format&fit=crop&w=600&q=80",
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c0000005-0000-0000-0000-000000000005",
    name: "Takı Setleri",
    slug: "taki-setleri",
    description: "Özel günler ve hediyeler için uyumlu kolye ve küpe setleri.",
    image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
    display_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let productsState: (Product & { images: string[]; category_name?: string })[] = [
  {
    id: "p0000001-0000-0000-0000-000000000001",
    category_id: "c0000001-0000-0000-0000-000000000001",
    category_name: "Kolyeler",
    sku: "ZN-KLY-0001",
    name: "Işıltılı Baget Kesim Pırlanta Efektli Kolye",
    slug: "isiltili-baget-kesim-kolye",
    short_description: "Zarif baget zirkon taşlı, 925 ayar gümüş ve 14K altın kaplama kolye.",
    description:
      "Her detayı özenle tasarlanan bu kolye, zarif geometrik kesimiyle boynunuzda büyüleyici bir ışıltı yaratır. Antialerjiktir, nikel içermez.",
    price: 1850,
    sale_price: 1490,
    cost_price: 650,
    stock_quantity: 15,
    critical_stock_threshold: 3,
    is_active: true,
    is_featured: true,
    is_new: true,
    material: "925 Ayar Gümüş / 14K Altın Kaplama",
    stone_type: "Baget Zirkon",
    color: "Altın",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
    ],
    care_instructions: "Parfüm ve kimyasal maddelerle doğrudan temastan kaçınınız. Kuru ve kapalı kutuda muhafaza ediniz.",
    package_contents: "Özel ZeynepNova hediye kutusu, garanti belgesi ve gümüş parlatma bezi.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p0000002-0000-0000-0000-000000000002",
    category_id: "c0000002-0000-0000-0000-000000000002",
    category_name: "Küpeler",
    sku: "ZN-KUP-0002",
    name: "Zarif İnci Damla Sallantılı Küpe",
    slug: "zarif-inci-damla-kupe",
    short_description: "Doğal tatlı su incisi ile süslenmiş hafif ve konforlu sallantılı küpe.",
    description: "Günlük kullanımdan özel akşamlara kadar tarzınızı asil bir dokunuşla tamamlar.",
    price: 950,
    sale_price: null,
    cost_price: 380,
    stock_quantity: 22,
    critical_stock_threshold: 5,
    is_active: true,
    is_featured: true,
    is_new: true,
    material: "Doğal Tatlı Su İncisi",
    stone_type: "İnci",
    color: "Beyaz & Gümüş",
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p0000003-0000-0000-0000-000000000003",
    category_id: "c0000003-0000-0000-0000-000000000003",
    category_name: "Yüzükler",
    sku: "ZN-YUZ-0003",
    name: "Safir Mavi Zirkon Taşlı Ayarlanabilir Yüzük",
    slug: "safir-mavi-zirkon-yuzuk",
    short_description: "Kraliyet mavisi safir efektli merkezi taş ve etrafını saran mikro zirkon detaylar.",
    description: "Her parmak ölçüsüne uygun ayarlanabilir halka tasarımı. Sevdikleriniz için harika bir hediye.",
    price: 1250,
    sale_price: 990,
    cost_price: 480,
    stock_quantity: 8,
    critical_stock_threshold: 2,
    is_active: true,
    is_featured: true,
    is_new: false,
    material: "925 Ayar Gümüş",
    stone_type: "Safir Efektli Zirkon",
    color: "Safir Mavi",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p0000004-0000-0000-0000-000000000004",
    category_id: "c0000004-0000-0000-0000-000000000004",
    category_name: "Bileklikler",
    sku: "ZN-BLK-0004",
    name: "Minimalist Burgu Zincir İtalyan Bileklik",
    slug: "minimalist-burgu-zincir-bileklik",
    short_description: "İtalyan ezme burgu örgü tekniğiyle üretilmiş, pürüzsüz dokulu 14K altın kaplama bileklik.",
    description: "Tek başına ya da diğer bilekliklerle kombinlenerek kullanılabilir.",
    price: 1400,
    sale_price: 1190,
    cost_price: 520,
    stock_quantity: 12,
    critical_stock_threshold: 3,
    is_active: true,
    is_featured: true,
    is_new: true,
    material: "14K Mikron Altın Kaplama",
    stone_type: "Taşsız",
    color: "Sarı Altın",
    images: [
      "https://images.unsplash.com/photo-1611591475152-473523dd66c4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80",
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p0000005-0000-0000-0000-000000000005",
    category_id: "c0000005-0000-0000-0000-000000000005",
    category_name: "Takı Setleri",
    sku: "ZN-SET-0005",
    name: "Aura Koleksiyonu Kolye & Küpe Takı Seti",
    slug: "aura-kolye-kupe-taki-seti",
    short_description: "Uyumlu baget zirkon kolye ve halka küpeden oluşan lüks hediye seti.",
    description: "Zarif kadife kutusunda, sertifikası ve temizleme beziyle birlikte sunulur.",
    price: 3200,
    sale_price: 2650,
    cost_price: 1100,
    stock_quantity: 5,
    critical_stock_threshold: 2,
    is_active: true,
    is_featured: true,
    is_new: false,
    material: "925 Ayar Gümüş & Zirkon",
    stone_type: "Zirkon",
    color: "Gümüş",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let ordersState: (Order & { items: OrderItem[] })[] = [
  {
    id: "ord-sample-01",
    order_number: "ZN-20261029-001",
    status: "paid",
    subtotal: 1850,
    discount_amount: 360,
    shipping_fee: 0,
    total_amount: 1490,
    guest_name: "Ayşe Yılmaz",
    guest_email: "ayse.yilmaz@example.com",
    guest_phone: "+90 532 555 12 34",
    shipping_address: {
      id: "addr-1",
      title: "Ev",
      first_name: "Ayşe",
      last_name: "Yılmaz",
      phone: "+90 532 555 12 34",
      address_line1: "Bağdat Caddesi No: 120 Daire: 4",
      district: "Kadıköy",
      city: "İstanbul",
      country: "Türkiye",
      address_type: "shipping",
      is_default: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    billing_address: {
      id: "addr-2",
      title: "Fatura",
      first_name: "Ayşe",
      last_name: "Yılmaz",
      phone: "+90 532 555 12 34",
      address_line1: "Bağdat Caddesi No: 120 Daire: 4",
      district: "Kadıköy",
      city: "İstanbul",
      country: "Türkiye",
      address_type: "billing",
      is_default: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    items: [
      {
        id: "item-1",
        order_id: "ord-sample-01",
        product_id: "p0000001-0000-0000-0000-000000000001",
        sku: "ZN-KLY-0001",
        product_name: "Işıltılı Baget Kesim Pırlanta Efektli Kolye",
        unit_price: 1490,
        quantity: 1,
        total_price: 1490,
        image_url:
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        created_at: new Date().toISOString(),
      },
    ],
    tracking_number: "YK-9876543210",
    shipping_carrier: "Yurtiçi Kargo",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let couponsState: Coupon[] = [
  {
    id: "coup-1",
    code: "ZEYNEP10",
    discount_type: "percentage",
    discount_value: 10,
    min_cart_amount: 500,
    max_discount_amount: 500,
    usage_limit: 1000,
    usage_count: 14,
    per_customer_limit: 1,
    is_active: true,
    free_shipping: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "coup-2",
    code: "HOSGELDIN150",
    discount_type: "fixed_amount",
    discount_value: 150,
    min_cart_amount: 1200,
    max_discount_amount: null,
    usage_limit: 500,
    usage_count: 28,
    per_customer_limit: 1,
    is_active: true,
    free_shipping: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "coup-3",
    code: "KARGO",
    discount_type: "fixed_amount",
    discount_value: 79.9,
    min_cart_amount: 500,
    max_discount_amount: 79.9,
    usage_limit: 1000,
    usage_count: 5,
    per_customer_limit: 1,
    is_active: true,
    free_shipping: true,
    created_at: new Date().toISOString(),
  },
];

let storeSettingsState: StoreSettings = {
  id: "s0000001-0000-0000-0000-000000000001",
  site_name: "ZeynepNova",
  support_email: "destek@zeynepnova.com",
  support_phone: "+90 (212) 555 01 23",
  company_legal_name: "ZeynepNova Takı ve Mücevherat Ltd. Şti.",
  company_address: "Nişantaşı, Abdi İpekçi Cad. No: 42, Şişli / İstanbul",
  tax_office: "Şişli Vergi Dairesi",
  tax_number: "1234567890",
  mersis_number: "0123456789000001",
  free_shipping_threshold: 1500,
  standard_shipping_fee: 79.9,
  currency: "TRY",
  timezone: "Europe/Istanbul",
  iyzico_test_mode: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  user_email: string;
  details?: string;
  created_at: string;
}

let auditLogsState: AuditLog[] = [
  {
    id: "log-1",
    action: "system.init",
    entity_type: "system",
    user_email: "system@zeynepnova.com",
    details: "ZeynepNova mağaza sistemi ve başlangıç katalog verileri yüklendi.",
    created_at: new Date().toISOString(),
  },
];

export interface ImportJob {
  id: string;
  filename: string;
  file_type: "excel" | "csv";
  strategy: "create_only" | "update_only" | "create_and_update";
  total_rows: number;
  successful_rows: number;
  failed_rows: number;
  status: "pending" | "validating" | "validated" | "importing" | "completed" | "failed";
  errors: { row: number; sku?: string; error: string }[];
  created_at: string;
  completed_at?: string;
}

let importJobsState: ImportJob[] = [];

// ============================================================================
// VERİTABANI REPOSITORY NESNESİ (DB ADAPTER)
// ============================================================================

export const db = {
  // --- ÜRÜN İŞLEMLERİ ---
  async getProducts(params?: {
    categorySlug?: string;
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    material?: string;
    stoneType?: string;
    inStockOnly?: boolean;
    sort?: "price_asc" | "price_desc" | "newest" | "popular";
    includeInactive?: boolean;
  }) {
    let result = [...productsState];

    if (!params?.includeInactive) {
      result = result.filter((p) => p.is_active);
    }

    if (params?.categorySlug) {
      if (params.categorySlug === "yeni-gelenler") {
        result = result.filter((p) => p.is_new);
      } else if (params.categorySlug === "cok-satanlar") {
        result = result.filter((p) => p.is_featured);
      } else {
        const cat = categoriesState.find((c) => c.slug === params.categorySlug);
        if (cat) {
          result = result.filter((p) => p.category_id === cat.id);
        }
      }
    }

    if (params?.query) {
      const q = params.query.toLocaleLowerCase("tr-TR");
      result = result.filter(
        (p) =>
          p.name.toLocaleLowerCase("tr-TR").includes(q) ||
          p.sku.toLocaleLowerCase("tr-TR").includes(q) ||
          p.short_description?.toLocaleLowerCase("tr-TR").includes(q) ||
          p.category_name?.toLocaleLowerCase("tr-TR").includes(q)
      );
    }

    if (params?.minPrice !== undefined) {
      result = result.filter((p) => (p.sale_price ?? p.price) >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      result = result.filter((p) => (p.sale_price ?? p.price) <= params.maxPrice!);
    }

    if (params?.material) {
      result = result.filter((p) => p.material?.includes(params.material!));
    }

    if (params?.stoneType) {
      result = result.filter((p) => p.stone_type?.includes(params.stoneType!));
    }

    if (params?.inStockOnly) {
      result = result.filter((p) => p.stock_quantity > 0);
    }

    // Sıralama
    if (params?.sort === "price_asc") {
      result.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
    } else if (params?.sort === "price_desc") {
      result.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
    } else if (params?.sort === "popular") {
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    } else {
      // Newest default
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  },

  async getProductBySlug(slug: string) {
    return productsState.find((p) => p.slug === slug) || null;
  },

  async getProductById(id: string) {
    return productsState.find((p) => p.id === id) || null;
  },

  async getProductBySku(sku: string) {
    return productsState.find((p) => p.sku.toUpperCase() === sku.toUpperCase()) || null;
  },

  async createProduct(data: Partial<Product> & { images?: string[]; category_name?: string }) {
    const id = `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newProduct = {
      id,
      category_id: data.category_id || categoriesState[0].id,
      category_name: data.category_name || categoriesState[0].name,
      sku: data.sku || `ZN-GEN-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: data.name || "Yeni Ürün",
      slug: data.slug || `yeni-urun-${Date.now()}`,
      short_description: data.short_description || "",
      description: data.description || "",
      price: Number(data.price) || 0,
      sale_price: data.sale_price ? Number(data.sale_price) : null,
      cost_price: data.cost_price ? Number(data.cost_price) : null,
      stock_quantity: Number(data.stock_quantity) || 0,
      critical_stock_threshold: Number(data.critical_stock_threshold) || 3,
      is_active: data.is_active ?? true,
      is_featured: data.is_featured ?? false,
      is_new: data.is_new ?? true,
      material: data.material || "925 Ayar Gümüş",
      stone_type: data.stone_type || "Zirkon",
      color: data.color || "Gümüş",
      size: data.size || "",
      care_instructions: data.care_instructions || "",
      package_contents: data.package_contents || "",
      images: data.images && data.images.length > 0 ? data.images : ["/placeholder-jewelry.jpg"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    productsState.unshift(newProduct);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product> & { images?: string[]; category_name?: string }) {
    const index = productsState.findIndex((p) => p.id === id);
    if (index === -1) return null;

    productsState[index] = {
      ...productsState[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return productsState[index];
  },

  async bulkUpdatePriceAndStock(
    updates: { id: string; price?: number; sale_price?: number | null; stock_quantity?: number; is_active?: boolean }[]
  ) {
    let updatedCount = 0;
    for (const item of updates) {
      const p = productsState.find((x) => x.id === item.id);
      if (p) {
        if (item.price !== undefined) p.price = item.price;
        if (item.sale_price !== undefined) p.sale_price = item.sale_price;
        if (item.stock_quantity !== undefined) p.stock_quantity = item.stock_quantity;
        if (item.is_active !== undefined) p.is_active = item.is_active;
        p.updated_at = new Date().toISOString();
        updatedCount++;
      }
    }
    return updatedCount;
  },

  async deleteProduct(id: string) {
    // Soft delete: set is_active to false to protect historical orders
    const p = productsState.find((x) => x.id === id);
    if (p) {
      p.is_active = false;
      p.updated_at = new Date().toISOString();
      return true;
    }
    return false;
  },

  // --- KATEGORİ İŞLEMLERİ ---
  async getCategories() {
    return [...categoriesState].sort((a, b) => a.display_order - b.display_order);
  },

  async getCategoryBySlug(slug: string) {
    return categoriesState.find((c) => c.slug === slug) || null;
  },

  async createCategory(data: Partial<Category>) {
    const newCategory: Category = {
      id: `c-${Date.now()}`,
      name: data.name || "Yeni Kategori",
      slug: data.slug || `kategori-${Date.now()}`,
      description: data.description || "",
      image_url: data.image_url || null,
      display_order: data.display_order || categoriesState.length + 1,
      is_active: data.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    categoriesState.push(newCategory);
    return newCategory;
  },

  async updateCategory(id: string, updates: Partial<Category>) {
    const cat = categoriesState.find((c) => c.id === id);
    if (!cat) return null;
    Object.assign(cat, updates, { updated_at: new Date().toISOString() });
    return cat;
  },

  // --- SİPARİŞ İŞLEMLERİ ---
  async getOrders(params?: { status?: string; search?: string }) {
    let result = [...ordersState];
    if (params?.status) {
      result = result.filter((o) => o.status === params.status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.guest_name?.toLowerCase().includes(q) ||
          o.guest_email?.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getOrderById(id: string) {
    return ordersState.find((o) => o.id === id) || null;
  },

  async getOrderByNumber(orderNumber: string) {
    return ordersState.find((o) => o.order_number === orderNumber) || null;
  },

  async createOrder(
    orderData: Omit<Order, "id" | "created_at" | "updated_at"> & { items: OrderItem[] }
  ) {
    const id = `ord-${Date.now()}`;
    const newOrder = {
      ...orderData,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Stok düşürme
    for (const item of newOrder.items) {
      const product = productsState.find((p) => p.id === item.product_id);
      if (product) {
        product.stock_quantity = Math.max(0, product.stock_quantity - item.quantity);
        product.updated_at = new Date().toISOString();
      }
    }

    ordersState.unshift(newOrder);
    return newOrder;
  },

  async updateOrderStatus(id: string, newStatus: Order["status"], notes?: string, trackingNumber?: string) {
    const order = ordersState.find((o) => o.id === id);
    if (!order) return null;

    order.status = newStatus;
    if (notes) order.admin_notes = notes;
    if (trackingNumber) order.tracking_number = trackingNumber;
    order.updated_at = new Date().toISOString();

    return order;
  },

  // --- KUPON İŞLEMLERİ ---
  async getCoupons() {
    return [...couponsState];
  },

  async getCouponByCode(code: string) {
    return (
      couponsState.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.is_active) || null
    );
  },

  async createCoupon(data: Partial<Coupon>) {
    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code: (data.code || `KOD-${Date.now()}`).toUpperCase(),
      discount_type: data.discount_type || "percentage",
      discount_value: Number(data.discount_value) || 10,
      min_cart_amount: data.min_cart_amount ? Number(data.min_cart_amount) : 0,
      max_discount_amount: data.max_discount_amount ? Number(data.max_discount_amount) : null,
      usage_limit: data.usage_limit ? Number(data.usage_limit) : 100,
      usage_count: 0,
      per_customer_limit: 1,
      is_active: true,
      free_shipping: data.free_shipping || false,
      created_at: new Date().toISOString(),
    };
    couponsState.push(newCoupon);
    return newCoupon;
  },

  // --- MAĞAZA AYARLARI ---
  async getStoreSettings() {
    return { ...storeSettingsState };
  },

  async updateStoreSettings(updates: Partial<StoreSettings>) {
    storeSettingsState = {
      ...storeSettingsState,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return storeSettingsState;
  },

  // --- DENETİM VE İÇE AKTARMA KAYITLARI ---
  async getAuditLogs() {
    return [...auditLogsState].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async addAuditLog(log: Omit<AuditLog, "id" | "created_at">) {
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    auditLogsState.unshift(newLog);
    return newLog;
  },

  async createImportJob(job: Omit<ImportJob, "id" | "created_at">) {
    const newJob: ImportJob = {
      ...job,
      id: `job-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    importJobsState.unshift(newJob);
    return newJob;
  },

  async updateImportJob(id: string, updates: Partial<ImportJob>) {
    const job = importJobsState.find((j) => j.id === id);
    if (!job) return null;
    Object.assign(job, updates);
    return job;
  },

  async getImportJobs() {
    return [...importJobsState];
  },

  async getImportJobById(id: string) {
    return importJobsState.find((j) => j.id === id) || null;
  },
};
