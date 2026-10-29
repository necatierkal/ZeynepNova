import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin } from "lucide-react";

interface OrderTrackingPageProps {
  searchParams: Promise<{
    orderNumber?: string;
    email?: string;
  }>;
}

export default async function OrderTrackingPage({ searchParams }: OrderTrackingPageProps) {
  const { orderNumber, email } = await searchParams;

  const order = orderNumber ? await db.getOrderByNumber(orderNumber.trim()) : null;

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending_payment: { label: "Ödeme Bekleniyor", color: "bg-amber-100 text-amber-800" },
    paid: { label: "Ödendi / Hazırlanıyor", color: "bg-emerald-100 text-emerald-800" },
    preparing: { label: "Atölyede Hazırlanıyor", color: "bg-blue-100 text-blue-800" },
    shipped: { label: "Kargoya Verildi", color: "bg-indigo-100 text-indigo-800" },
    delivered: { label: "Teslim Edildi", color: "bg-emerald-100 text-emerald-800" },
    cancelled: { label: "İptal Edildi", color: "bg-rose-100 text-rose-800" },
  };

  return (
    <>
      <AnnouncementBar />
      <Header />

      <main className="min-h-screen pb-20 bg-sand-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-lg mx-auto mb-10">
            <h1 className="font-serif text-3xl text-charcoal-950 font-medium">Sipariş Takibi</h1>
            <p className="text-xs text-charcoal-500 mt-2">
              Sipariş onay e-postanızda yer alan sipariş numarasını girerek anlık teslimat durumunu
              öğrenebilirsiniz.
            </p>

            {/* Tracking Search Form */}
            <form action="/siparis-takip" method="GET" className="mt-6 flex gap-2">
              <input
                type="text"
                name="orderNumber"
                defaultValue={orderNumber || ""}
                placeholder="Örn: ZN-20261029-001"
                required
                className="flex-1 h-12 px-4 rounded-xl border border-sand-300 text-xs uppercase font-mono focus:outline-none focus:border-gold-600 bg-white"
              />
              <button
                type="submit"
                className="h-12 px-6 rounded-xl bg-charcoal-900 text-white text-xs font-semibold hover:bg-gold-700 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" /> Sorgula
              </button>
            </form>
          </div>

          {orderNumber && !order && (
            <div className="p-8 bg-white rounded-3xl border border-sand-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                ✕
              </div>
              <h3 className="font-serif text-base text-charcoal-900 font-medium">
                &ldquo;{orderNumber}&rdquo; numaralı sipariş bulunamadı
              </h3>
              <p className="text-xs text-charcoal-500 max-w-md mx-auto">
                Lütfen sipariş numaranızı kontrol edip tekrar deneyiniz veya destek@zeynepnova.com adresiyle
                iletişime geçiniz.
              </p>
            </div>
          )}

          {order && (
            <div className="bg-white rounded-3xl border border-sand-200 shadow-soft overflow-hidden">
              {/* Header */}
              <div className="p-6 sm:p-8 bg-sand-100/60 border-b border-sand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-charcoal-400 font-mono block">Sipariş No</span>
                  <h2 className="font-mono text-xl font-bold text-charcoal-950 mt-0.5">
                    {order.order_number}
                  </h2>
                  <span className="text-xs text-charcoal-500 mt-1 block">
                    Tarih: {formatDate(order.created_at)}
                  </span>
                </div>

                <div className="flex flex-col sm:items-end">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      statusLabels[order.status]?.color || "bg-sand-200 text-charcoal-800"
                    }`}
                  >
                    {statusLabels[order.status]?.label || order.status}
                  </span>
                  <span className="text-sm font-bold text-charcoal-900 mt-2">
                    Toplam: {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>

              {/* Shipping info banner if available */}
              {order.tracking_number && (
                <div className="p-4 bg-emerald-50/70 border-b border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>
                      <strong>{order.shipping_carrier || "Yurtiçi Kargo"}:</strong> Takip No:{" "}
                      <span className="font-mono font-bold">{order.tracking_number}</span>
                    </span>
                  </div>
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold hover:text-emerald-950"
                    >
                      Kargo Takip Sayfası
                    </a>
                  )}
                </div>
              )}

              {/* Order Items List */}
              <div className="p-6 sm:p-8 space-y-4">
                <h3 className="font-serif text-sm font-semibold text-charcoal-900 pb-2 border-b border-sand-100">
                  Siparişteki Ürünler
                </h3>
                <div className="divide-y divide-sand-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {item.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image_url}
                            alt={item.product_name}
                            className="w-12 h-12 rounded-lg object-cover border border-sand-200"
                          />
                        )}
                        <div>
                          <p className="text-xs font-medium text-charcoal-900">{item.product_name}</p>
                          <p className="text-[11px] text-charcoal-400 font-mono">
                            {item.quantity} adet × {formatCurrency(item.unit_price)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-charcoal-900">
                        {formatCurrency(item.total_price)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping address details */}
                <div className="mt-6 pt-4 border-t border-sand-100 text-xs text-charcoal-600">
                  <span className="font-semibold text-charcoal-800 block mb-1">Teslimat Adresi:</span>
                  <p>
                    {order.shipping_address?.address_line1}, {order.shipping_address?.district} /{" "}
                    {order.shipping_address?.city}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
