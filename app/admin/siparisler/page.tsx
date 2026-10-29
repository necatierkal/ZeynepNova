import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ShoppingCart,
  Search,
  Filter,
  Download,
  Truck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface AdminOrdersPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status, search } = await searchParams;

  const orders = await db.getOrders({
    status,
    search,
  });

  const statusMap: Record<string, { label: string; color: string }> = {
    pending_payment: { label: "Ödeme Bekliyor", color: "bg-amber-100 text-amber-800" },
    verifying_payment: { label: "Ödeme Doğrulanıyor", color: "bg-amber-100 text-amber-800" },
    paid: { label: "Ödendi", color: "bg-emerald-100 text-emerald-800" },
    preparing: { label: "Hazırlanıyor", color: "bg-blue-100 text-blue-800" },
    shipped: { label: "Kargoya Verildi", color: "bg-indigo-100 text-indigo-800" },
    delivered: { label: "Teslim Edildi", color: "bg-emerald-100 text-emerald-800" },
    cancelled: { label: "İptal Edildi", color: "bg-rose-100 text-rose-800" },
    return_requested: { label: "İade Talebi", color: "bg-rose-100 text-rose-800" },
    return_completed: { label: "İade Tamamlandı", color: "bg-sand-200 text-charcoal-700" },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-700">
            Sipariş Operasyonları
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-medium mt-1">
            Sipariş Yönetimi ({orders.length})
          </h1>
        </div>

        <button
          type="button"
          className="px-4 py-2.5 rounded-xl border border-sand-300 bg-white text-charcoal-800 text-xs font-semibold hover:bg-sand-50 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4 text-emerald-600" /> Siparişleri Dışa Aktar (CSV)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200/80 shadow-soft flex flex-col sm:flex-row gap-3">
        <form action="/admin/siparisler" method="GET" className="relative flex-1">
          <input
            type="text"
            name="search"
            defaultValue={search || ""}
            placeholder="Sipariş no, müşteri adı veya e-posta ile ara..."
            className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
          />
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { label: "Tümü", val: "" },
            { label: "Ödendi", val: "paid" },
            { label: "Hazırlanıyor", val: "preparing" },
            { label: "Kargoda", val: "shipped" },
            { label: "Teslim Edildi", val: "delivered" },
          ].map((st) => {
            const isActive = (status || "") === st.val;
            return (
              <Link
                key={st.val}
                href={`/admin/siparisler${st.val ? `?status=${st.val}` : ""}`}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-charcoal-900 text-white"
                    : "bg-sand-50 text-charcoal-700 hover:bg-sand-100"
                }`}
              >
                {st.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-sand-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sand-200 text-charcoal-500 text-[11px] uppercase tracking-wider font-semibold bg-sand-50/50">
                <th className="py-3 px-4">Sipariş No</th>
                <th className="py-3 px-4">Tarih</th>
                <th className="py-3 px-4">Müşteri</th>
                <th className="py-3 px-4">Durum</th>
                <th className="py-3 px-4">Kargo Bilgisi</th>
                <th className="py-3 px-4">Tutar</th>
                <th className="py-3 px-4 text-right">Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-sand-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-charcoal-900">
                    {ord.order_number}
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-500 font-mono">
                    {formatDate(ord.created_at)}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-charcoal-900">{ord.guest_name || "Müşteri"}</p>
                    <span className="text-[11px] text-charcoal-400 block">{ord.guest_email}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        statusMap[ord.status]?.color || "bg-sand-200 text-charcoal-800"
                      }`}
                    >
                      {statusMap[ord.status]?.label || ord.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {ord.tracking_number ? (
                      <span className="text-emerald-700 font-semibold font-mono flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" /> {ord.tracking_number}
                      </span>
                    ) : (
                      <span className="text-charcoal-400">Atanmadı</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-serif font-bold text-charcoal-900 text-sm">
                    {formatCurrency(ord.total_amount)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/siparis-takip?orderNumber=${ord.order_number}`}
                      target="_blank"
                      className="text-xs font-semibold text-gold-700 hover:underline inline-flex items-center gap-1"
                    >
                      İncele <ExternalLink className="w-3 h-3" />
                    </Link>
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
