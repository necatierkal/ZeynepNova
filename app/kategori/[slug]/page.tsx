import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ProductCard } from "@/components/shared/ProductCard";
import { SlidersHorizontal, ChevronRight, X, Sparkles } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sort?: "price_asc" | "price_desc" | "newest" | "popular";
    minPrice?: string;
    maxPrice?: string;
    material?: string;
    stoneType?: string;
    inStock?: string;
  }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const categories = await db.getCategories();
  const currentCategory = categories.find((c) => c.slug === slug);

  // Special virtual collections
  const isSpecialCollection = slug === "yeni-gelenler" || slug === "cok-satanlar";
  const categoryTitle = isSpecialCollection
    ? slug === "yeni-gelenler"
      ? "Yeni Gelenler"
      : "Çok Satanlar"
    : currentCategory?.name;

  const categoryDesc = isSpecialCollection
    ? slug === "yeni-gelenler"
      ? "Atölyemizin en taze, ışıltılı ve en yeni takı tasarımlarını keşfedin."
      : "Müşterilerimizin en çok tercih ettiği ikonik ZeynepNova modelleri."
    : currentCategory?.description || "Zarafeti stilinize taşıyan özel takı modelleri.";

  if (!currentCategory && !isSpecialCollection) {
    notFound();
  }

  // Parse filters
  const minPrice = resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined;
  const material = resolvedSearchParams.material;
  const stoneType = resolvedSearchParams.stoneType;
  const inStockOnly = resolvedSearchParams.inStock === "true";
  const sort = resolvedSearchParams.sort || "newest";

  const products = await db.getProducts({
    categorySlug: slug,
    minPrice,
    maxPrice,
    material,
    stoneType,
    inStockOnly,
    sort,
  });

  // Calculate active filter count
  const activeFiltersCount =
    (minPrice !== undefined ? 1 : 0) +
    (maxPrice !== undefined ? 1 : 0) +
    (material ? 1 : 0) +
    (stoneType ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const materials = ["925 Ayar Gümüş", "14K Altın Kaplama", "Doğal Tatlı Su İncisi"];
  const stoneTypes = ["Zirkon", "İnci", "Safir Efektli Zirkon", "Taşsız"];

  return (
    <>
      <AnnouncementBar />
      <Header />

      <main className="min-h-screen pb-20">
        {/* Category Header Banner */}
        <div className="bg-sand-100/70 border-b border-sand-200 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-charcoal-400 mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-charcoal-800 transition-colors">
                Ana Sayfa
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-charcoal-300" />
              <Link href="/kategori/kolyeler" className="hover:text-charcoal-800 transition-colors">
                Koleksiyonlar
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-charcoal-300" />
              <span className="text-charcoal-800 font-medium">{categoryTitle}</span>
            </nav>

            <div className="max-w-2xl">
              <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-medium tracking-tight">
                {categoryTitle}
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-600 mt-2 leading-relaxed">
                {categoryDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Content & Filters Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Controls Bar: Result count & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-200">
            <div className="flex items-center gap-3">
              <span className="text-xs text-charcoal-600">
                Toplam <strong>{products.length}</strong> ürün listeleniyor
              </span>
              {activeFiltersCount > 0 && (
                <Link
                  href={`/kategori/${slug}`}
                  className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full font-medium"
                >
                  <X className="w-3 h-3" /> Filtreleri Temizle ({activeFiltersCount})
                </Link>
              )}
            </div>

            {/* Sorting Dropdown Links */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-charcoal-500">Sırala:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Yeni Gelenler", val: "newest" },
                  { label: "Fiyat: Düşükten Yükseğe", val: "price_asc" },
                  { label: "Fiyat: Yüksekten Düşüğe", val: "price_desc" },
                  { label: "Çok Satanlar", val: "popular" },
                ].map((s) => {
                  const isActive = sort === s.val;
                  const newParams = new URLSearchParams();
                  if (minPrice) newParams.set("minPrice", String(minPrice));
                  if (maxPrice) newParams.set("maxPrice", String(maxPrice));
                  if (material) newParams.set("material", material);
                  if (stoneType) newParams.set("stoneType", stoneType);
                  if (inStockOnly) newParams.set("inStock", "true");
                  newParams.set("sort", s.val);

                  return (
                    <Link
                      key={s.val}
                      href={`/kategori/${slug}?${newParams.toString()}`}
                      className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                        isActive
                          ? "bg-charcoal-900 text-white border-charcoal-900"
                          : "bg-white text-charcoal-700 border-sand-200 hover:border-sand-300"
                      }`}
                    >
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
            {/* Desktop Left Sidebar Filters */}
            <aside className="hidden lg:block space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-sand-100">
                  <h3 className="font-serif text-sm font-medium text-charcoal-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-gold-600" /> Filtreler
                  </h3>
                  {activeFiltersCount > 0 && (
                    <Link
                      href={`/kategori/${slug}`}
                      className="text-[11px] text-charcoal-500 hover:text-rose-600"
                    >
                      Sıfırla
                    </Link>
                  )}
                </div>

                {/* Materyal Filtresi */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-2.5">
                    Materyal
                  </h4>
                  <div className="space-y-1.5">
                    {materials.map((m) => {
                      const isSelected = material === m;
                      const nextParams = new URLSearchParams();
                      if (sort) nextParams.set("sort", sort);
                      if (stoneType) nextParams.set("stoneType", stoneType);
                      if (!isSelected) nextParams.set("material", m);

                      return (
                        <Link
                          key={m}
                          href={`/kategori/${slug}?${nextParams.toString()}`}
                          className={`block px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                            isSelected
                              ? "bg-gold-100 text-gold-900 font-medium"
                              : "text-charcoal-600 hover:bg-sand-50"
                          }`}
                        >
                          {m}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Taş Tipi Filtresi */}
                <div className="pt-4 border-t border-sand-100">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-2.5">
                    Taş Tipi
                  </h4>
                  <div className="space-y-1.5">
                    {stoneTypes.map((st) => {
                      const isSelected = stoneType === st;
                      const nextParams = new URLSearchParams();
                      if (sort) nextParams.set("sort", sort);
                      if (material) nextParams.set("material", material);
                      if (!isSelected) nextParams.set("stoneType", st);

                      return (
                        <Link
                          key={st}
                          href={`/kategori/${slug}?${nextParams.toString()}`}
                          className={`block px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                            isSelected
                              ? "bg-gold-100 text-gold-900 font-medium"
                              : "text-charcoal-600 hover:bg-sand-50"
                          }`}
                        >
                          {st}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Stok Durumu */}
                <div className="pt-4 border-t border-sand-100">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-2.5">
                    Stok Durumu
                  </h4>
                  <Link
                    href={`/kategori/${slug}?inStock=${inStockOnly ? "false" : "true"}`}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border w-full justify-between transition-colors ${
                      inStockOnly
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-medium"
                        : "bg-white text-charcoal-700 border-sand-200"
                    }`}
                  >
                    <span>Yalnızca Stokta Olanlar</span>
                    {inStockOnly && <span className="text-[10px]">✓</span>}
                  </Link>
                </div>
              </div>
            </aside>

            {/* Product Grid Area */}
            <div className="lg:col-span-3">
              {products.length === 0 ? (
                /* Empty Result State */
                <div className="text-center py-20 px-4 bg-white rounded-3xl border border-sand-200/80 shadow-soft">
                  <div className="w-14 h-14 rounded-full bg-sand-100 mx-auto flex items-center justify-center text-charcoal-400 mb-4">
                    <Sparkles className="w-7 h-7 text-gold-600" />
                  </div>
                  <h3 className="font-serif text-lg text-charcoal-900 font-medium">
                    Seçilen kriterlere uygun ürün bulunamadı
                  </h3>
                  <p className="text-xs text-charcoal-500 max-w-sm mx-auto mt-2">
                    Lütfen filtreleri sıfırlayarak veya farklı bir materyal/taş seçimi yaparak tekrar deneyin.
                  </p>
                  <div className="mt-6">
                    <Link
                      href={`/kategori/${slug}`}
                      className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-charcoal-900 text-white text-xs font-medium hover:bg-gold-700 transition-colors"
                    >
                      Tüm Ürünleri Göster
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
