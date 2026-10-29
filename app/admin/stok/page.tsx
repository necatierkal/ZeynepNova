import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Boxes, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";

export default async function AdminStockPage() {
  const products = await db.getProducts({ includeInactive: true });

  const criticalStock = products.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= p.critical_stock_threshold
  );
  const outOfStock = products.filter((p) => p.stock_quantity <= 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-gold-700">
          Envanter & Lojistik
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-medium mt-1">
          Stok Takibi ve Envanter Hareketleri
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 bg-white rounded-2xl border border-sand-200 shadow-soft">
          <span className="text-xs text-charcoal-500 font-semibold uppercase">Toplam Ürün Çeşidi</span>
          <div className="font-serif text-2xl font-bold text-charcoal-950 mt-2">{products.length} SKU</div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-sand-200 shadow-soft">
          <span className="text-xs text-amber-700 font-semibold uppercase">Kritik Stok Uyarısı</span>
          <div className="font-serif text-2xl font-bold text-amber-700 mt-2">{criticalStock.length} Ürün</div>
          <p className="text-[11px] text-charcoal-400 mt-1">Stok eşiğinin altına düşenler</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-sand-200 shadow-soft">
          <span className="text-xs text-rose-600 font-semibold uppercase">Tükenen Ürünler</span>
          <div className="font-serif text-2xl font-bold text-rose-600 mt-2">{outOfStock.length} Ürün</div>
          <p className="text-[11px] text-charcoal-400 mt-1">Satışa kapalı (Stok: 0)</p>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-sand-100 flex items-center justify-between">
          <h2 className="font-serif text-base font-semibold text-charcoal-900">
            Anlık Ürün Stok Seviyeleri
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sand-200 text-charcoal-500 text-[11px] uppercase tracking-wider font-semibold bg-sand-50/50">
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Ürün Adı</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Mevcut Stok</th>
                <th className="py-3 px-4">Kritik Eşik</th>
                <th className="py-3 px-4">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {products.map((p) => {
                const isOut = p.stock_quantity <= 0;
                const isCrit = p.stock_quantity > 0 && p.stock_quantity <= p.critical_stock_threshold;

                return (
                  <tr key={p.id} className="hover:bg-sand-50/40">
                    <td className="py-3 px-4 font-mono font-bold text-charcoal-900">{p.sku}</td>
                    <td className="py-3 px-4 font-medium text-charcoal-800">{p.name}</td>
                    <td className="py-3 px-4 text-charcoal-600">{p.category_name || "Takı"}</td>
                    <td className="py-3 px-4 font-bold text-charcoal-900 text-sm">
                      {p.stock_quantity} Adet
                    </td>
                    <td className="py-3 px-4 text-charcoal-500 font-mono">
                      {p.critical_stock_threshold} Adet
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold px-2.5 py-0.5 rounded-full text-[11px] ${
                          isOut
                            ? "bg-rose-100 text-rose-800"
                            : isCrit
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-50 text-emerald-800"
                        }`}
                      >
                        {isOut ? "Tükendi" : isCrit ? "Kritik Seviye" : "Yeterli"}
                      </span>
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
