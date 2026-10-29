import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ProductCard } from "@/components/shared/ProductCard";
import { Search, Sparkles } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const results = query ? await db.getProducts({ query }) : [];

  const popularSearches = [
    "Baget Kolye",
    "İnci Küpe",
    "Safir Yüzük",
    "Burgu Bileklik",
    "Takı Seti",
    "925 Gümüş",
  ];

  return (
    <>
      <AnnouncementBar />
      <Header />

      <main className="min-h-screen pb-20">
        <div className="bg-sand-100/70 border-b border-sand-200 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-medium">
              {query ? `"${query}" Arama Sonuçları` : "Ürün Arama"}
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              {query
                ? `Aramanızla eşleşen ${results.length} ürün bulundu.`
                : "Aramak istediğiniz ürün adını veya SKU kodunu yazın."}
            </p>

            {/* Popular Searches Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
              <span className="text-charcoal-500 font-medium">Popüler Aramalar:</span>
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={`/arama?q=${encodeURIComponent(term)}`}
                  className="px-3 py-1 bg-white rounded-full border border-sand-300 text-charcoal-700 hover:border-gold-600 hover:text-gold-700 transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {query && results.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-sand-200 shadow-soft max-w-xl mx-auto px-6">
              <div className="w-14 h-14 rounded-full bg-sand-100 flex items-center justify-center mx-auto text-charcoal-400 mb-4">
                <Search className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="font-serif text-lg font-medium text-charcoal-900">
                &ldquo;{query}&rdquo; için sonuç bulunamadı
              </h3>
              <p className="text-xs text-charcoal-500 mt-2 leading-relaxed">
                Farklı bir kelime deneyebilir veya aşağıdaki kategorilerden birini inceleyebilirsiniz.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <Link
                  href="/kategori/kolyeler"
                  className="px-4 py-2 rounded-lg bg-sand-100 text-charcoal-800 text-xs font-medium hover:bg-gold-100"
                >
                  Kolyeler
                </Link>
                <Link
                  href="/kategori/kupeler"
                  className="px-4 py-2 rounded-lg bg-sand-100 text-charcoal-800 text-xs font-medium hover:bg-gold-100"
                >
                  Küpeler
                </Link>
                <Link
                  href="/kategori/yuzukler"
                  className="px-4 py-2 rounded-lg bg-sand-100 text-charcoal-800 text-xs font-medium hover:bg-gold-100"
                >
                  Yüzükler
                </Link>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-charcoal-500 text-xs">
              <Sparkles className="w-6 h-6 text-gold-600 mx-auto mb-2" />
              Yukarıdaki arama çubuğunu veya popüler etiketleri kullanarak arama yapabilirsiniz.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
