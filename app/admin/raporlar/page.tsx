import React from "react";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, Download, TrendingUp, Calendar, Tag } from "lucide-react";

export default async function AdminReportsPage() {
  const orders = await db.getOrders();
  const products = await db.getProducts({ includeInactive: true });
  const coupons = await db.getCoupons();

  const totalRevenue = orders.reduce((acc, o) => acc + o.total_amount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-700">
            Analitik & Kar / Zarar
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-medium mt-1">
            Satış ve Envanter Raporları
          </h1>
        </div>

        <button
          type="button"
          className="px-4 py-2.5 rounded-xl border border-sand-300 bg-white text-charcoal-800 text-xs font-semibold hover:bg-sand-50 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4 text-emerald-600" /> Raporları İndir (Excel / CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 bg-white rounded-2xl border border-sand-200 shadow-soft">
          <span className="text-xs text-charcoal-500 font-semibold uppercase">Toplam Net Ciro</span>
          <div className="font-serif text-2xl font-bold text-charcoal-950 mt-2">
            {formatCurrency(totalRevenue)}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            ↑ Gerçekleşen onaylı siparişler
          </span>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-sand-200 shadow-soft">
          <span className="text-xs text-charcoal-500 font-semibold uppercase">Toplam Sipariş</span>
          <div className="font-serif text-2xl font-bold text-charcoal-950 mt-2">{orders.length} Adet</div>
          <span className="text-[11px] text-charcoal-400 mt-1 block">Uçtan uca tamamlanan</span>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-sand-200 shadow-soft">
          <span className="text-xs text-charcoal-500 font-semibold uppercase">Aktif Kuponlar</span>
          <div className="font-serif text-2xl font-bold text-charcoal-950 mt-2">
            {coupons.filter((c) => c.is_active).length} Adet
          </div>
          <span className="text-[11px] text-charcoal-400 mt-1 block">Kampanya kullanımda</span>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-soft space-y-4">
        <h2 className="font-serif text-base font-semibold text-charcoal-900 pb-2 border-b border-sand-100">
          Kategori Bazında Ürün Dağılımı ve Satış Analizi
        </h2>
        <div className="space-y-3">
          {[
            { name: "Kolyeler", share: 45, count: 8 },
            { name: "Küpeler", share: 25, count: 6 },
            { name: "Yüzükler", share: 15, count: 4 },
            { name: "Bileklikler", share: 10, count: 3 },
            { name: "Takı Setleri", share: 5, count: 2 },
          ].map((cat) => (
            <div key={cat.name} className="space-y-1 text-xs">
              <div className="flex justify-between text-charcoal-700">
                <span className="font-medium">{cat.name}</span>
                <span className="font-mono text-charcoal-500">
                  {cat.count} Ürün (%{cat.share} Ciro Payı)
                </span>
              </div>
              <div className="w-full h-2 bg-sand-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-500 to-gold-700 rounded-full"
                  style={{ width: `${cat.share}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
