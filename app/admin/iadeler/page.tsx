import React from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { RotateCcw, Check, X, Clock, AlertCircle } from "lucide-react";

export default async function AdminReturnsPage() {
  const returnRequests = [
    {
      id: "ret-1",
      order_number: "ZN-20261029-001",
      customer_name: "Ayşe Yılmaz",
      customer_email: "ayse.yilmaz@example.com",
      product_name: "Işıltılı Baget Kesim Pırlanta Efektli Kolye",
      amount: 1490.0,
      reason: "Ölçü / Beden Uyumsuzluğu",
      customer_notes: "Zincir uzunluğu boynuma biraz kısa geldi, daha uzun modeliyle değiştirmek istiyorum.",
      status: "under_review",
      created_at: new Date().toISOString(),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-gold-700">
          Müşteri Hizmetleri
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-medium mt-1">
          İade ve Değişim Talepleri
        </h1>
        <p className="text-xs text-charcoal-500 mt-1">
          14 gün koşulsuz cayma hakkı kapsamında müşteriler tarafından oluşturulan talepler.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-sand-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sand-200 text-charcoal-500 text-[11px] uppercase tracking-wider font-semibold bg-sand-50/50">
                <th className="py-3 px-4">Talep Tarihi</th>
                <th className="py-3 px-4">Sipariş No</th>
                <th className="py-3 px-4">Müşteri</th>
                <th className="py-3 px-4">Ürün</th>
                <th className="py-3 px-4">İade Nedeni & Not</th>
                <th className="py-3 px-4">Tutar</th>
                <th className="py-3 px-4">Durum</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {returnRequests.map((r) => (
                <tr key={r.id} className="hover:bg-sand-50/40">
                  <td className="py-3.5 px-4 font-mono text-charcoal-500">{formatDate(r.created_at)}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-charcoal-900">{r.order_number}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-charcoal-900">{r.customer_name}</p>
                    <span className="text-[11px] text-charcoal-400 block">{r.customer_email}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-charcoal-800">{r.product_name}</td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <span className="font-semibold text-charcoal-800 block">{r.reason}</span>
                    <span className="text-[11px] text-charcoal-500 line-clamp-2">{r.customer_notes}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-charcoal-900">{formatCurrency(r.amount)}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                      İnceleniyor
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      type="button"
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                    >
                      Onayla
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
                    >
                      Reddet
                    </button>
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
