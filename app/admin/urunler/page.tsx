import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  Plus,
  FileSpreadsheet,
  Search,
  CheckCircle2,
  AlertTriangle,
  Edit,
  ExternalLink,
} from "lucide-react";

interface AdminProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const { q, category } = await searchParams;

  const products = await db.getProducts({
    query: q,
    categorySlug: category,
    includeInactive: true,
  });

  const categories = await db.getCategories();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-700">
            Katalog Yönetimi
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-medium mt-1">
            Ürünler ({products.length})
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/urunler/yeni"
            className="px-4 py-2.5 rounded-xl bg-charcoal-900 text-white text-xs font-semibold hover:bg-gold-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Yeni Ürün Ekle
          </Link>
          <Link
            href="/admin/urunler/ice-aktar"
            className="px-4 py-2.5 rounded-xl border border-sand-300 bg-white text-charcoal-800 text-xs font-semibold hover:bg-sand-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Toplu İçe Aktar
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200/80 shadow-soft flex flex-col sm:flex-row gap-3">
        <form action="/admin/urunler" method="GET" className="relative flex-1">
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="Ürün adı, SKU veya materyal ile ara..."
            className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
          />
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex gap-2">
          <select
            defaultValue={category || ""}
            className="h-10 px-3 text-xs rounded-xl border border-sand-300 bg-white focus:outline-none focus:border-gold-600 text-charcoal-700"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-3xl border border-sand-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sand-200 text-charcoal-500 text-[11px] uppercase tracking-wider font-semibold bg-sand-50/50">
                <th className="py-3 px-4">Görsel</th>
                <th className="py-3 px-4">SKU / Kod</th>
                <th className="py-3 px-4">Ürün Adı</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Fiyat</th>
                <th className="py-3 px-4">Stok</th>
                <th className="py-3 px-4">Durum</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {products.map((p) => {
                const effectivePrice = p.sale_price ?? p.price;
                const isCriticalStock = p.stock_quantity > 0 && p.stock_quantity <= p.critical_stock_threshold;
                const isOutOfStock = p.stock_quantity <= 0;

                return (
                  <tr key={p.id} className="hover:bg-sand-50/40 transition-colors">
                    <td className="py-3 px-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.images[0] || "/placeholder-jewelry.jpg"}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-sand-200"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-charcoal-900">{p.sku}</td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/urun/${p.slug}`}
                        target="_blank"
                        className="font-medium text-charcoal-900 hover:text-gold-700 flex items-center gap-1.5"
                      >
                        <span className="truncate max-w-xs">{p.name}</span>
                        <ExternalLink className="w-3 h-3 text-charcoal-400" />
                      </Link>
                      <span className="text-[11px] text-charcoal-400 block">{p.material}</span>
                    </td>
                    <td className="py-3 px-4 text-charcoal-600">{p.category_name || "Takı"}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-charcoal-900">{formatCurrency(effectivePrice)}</div>
                      {p.sale_price && (
                        <span className="text-[10px] text-charcoal-400 line-through">
                          {formatCurrency(p.price)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                          isOutOfStock
                            ? "bg-rose-100 text-rose-800"
                            : isCriticalStock
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-50 text-emerald-800"
                        }`}
                      >
                        {isOutOfStock ? "Tükendi" : `${p.stock_quantity} Adet`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          p.is_active ? "text-emerald-700" : "text-charcoal-400"
                        }`}
                      >
                        {p.is_active ? "Yayında" : "Taslak"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/urunler/yeni?edit=${p.id}`}
                        className="p-1.5 text-charcoal-600 hover:text-gold-700 transition-colors inline-block"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
