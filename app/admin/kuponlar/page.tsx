import React from "react";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { TicketPercent, Plus, CheckCircle2, Tag } from "lucide-react";

export default async function AdminCouponsPage() {
  const coupons = await db.getCoupons();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-700">
            Promosyon & Pazarlama
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-medium mt-1">
            İndirim Kuponları
          </h1>
        </div>

        <button
          type="button"
          className="px-4 py-2.5 rounded-xl bg-charcoal-900 text-white text-xs font-semibold hover:bg-gold-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Yeni Kupon Tanımla
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-sand-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sand-200 text-charcoal-500 text-[11px] uppercase tracking-wider font-semibold bg-sand-50/50">
                <th className="py-3 px-4">Kupon Kodu</th>
                <th className="py-3 px-4">İndirim Türü</th>
                <th className="py-3 px-4">Değer</th>
                <th className="py-3 px-4">Min. Sepet Tutarı</th>
                <th className="py-3 px-4">Kullanım</th>
                <th className="py-3 px-4">Ücretsiz Kargo</th>
                <th className="py-3 px-4">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-sand-50/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-charcoal-950 text-sm">
                    {c.code}
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-600">
                    {c.discount_type === "percentage" ? "Yüzdesel İndirim" : "Sabit Tutar"}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-charcoal-900">
                    {c.discount_type === "percentage" ? `%${c.discount_value}` : `${c.discount_value} ₺`}
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-600">
                    {c.min_cart_amount ? formatCurrency(c.min_cart_amount) : "Limitsiz"}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-charcoal-700">
                    {c.usage_count} / {c.usage_limit || "∞"}
                  </td>
                  <td className="py-3.5 px-4">
                    {c.free_shipping ? (
                      <span className="text-emerald-700 font-bold">Evet</span>
                    ) : (
                      <span className="text-charcoal-400">Hayır</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-semibold px-2.5 py-0.5 rounded-full text-[11px] ${
                        c.is_active ? "bg-emerald-50 text-emerald-800" : "bg-sand-200 text-charcoal-500"
                      }`}
                    >
                      {c.is_active ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
