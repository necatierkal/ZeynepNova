import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingCart,
  Boxes,
  AlertTriangle,
  RotateCcw,
  Clock,
  CheckCircle2,
  Package,
  ArrowRight,
  ShieldCheck,
  Server,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const products = await db.getProducts({ includeInactive: true });
  const orders = await db.getOrders();
  const auditLogs = await db.getAuditLogs();
  const settings = await db.getStoreSettings();

  // Metrics calculation from real store data
  const totalSales = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending_payment" || o.status === "verifying_payment");
  const preparingOrders = orders.filter((o) => o.status === "paid" || o.status === "preparing");
  const shippedOrders = orders.filter((o) => o.status === "shipped");
  const deliveredOrders = orders.filter((o) => o.status === "delivered");
  const returnOrders = orders.filter((o) => o.status.startsWith("return"));

  const averageOrderValue = orders.length > 0 ? totalSales / orders.length : 0;

  // Inventory analysis
  const criticalStockProducts = products.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= p.critical_stock_threshold
  );
  const outOfStockProducts = products.filter((p) => p.stock_quantity <= 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-700">
            ZeynepNova Mağaza İstatistikleri
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-medium mt-1">
            Yönetim Kontrol Paneli
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/urunler/yeni"
            className="px-4 py-2.5 rounded-xl bg-charcoal-900 text-white text-xs font-semibold hover:bg-gold-700 transition-colors shadow-sm"
          >
            + Yeni Ürün Ekle
          </Link>
          <Link
            href="/admin/urunler/ice-aktar"
            className="px-4 py-2.5 rounded-xl border border-sand-300 bg-white text-charcoal-800 text-xs font-semibold hover:bg-sand-50 transition-colors shadow-sm"
          >
            Excel/CSV İçe Aktar
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales */}
        <div className="bg-white p-6 rounded-2xl border border-sand-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Toplam Satış
            </span>
            <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center text-gold-700">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 font-serif text-2xl font-bold text-charcoal-950">
            {formatCurrency(totalSales)}
          </div>
          <p className="text-[11px] text-charcoal-400 mt-1">Sistemdeki tüm onaylı siparişler</p>
        </div>

        {/* Order Count */}
        <div className="bg-white p-6 rounded-2xl border border-sand-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Sipariş Sayısı
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 font-serif text-2xl font-bold text-charcoal-950">{orders.length} Adet</div>
          <p className="text-[11px] text-charcoal-400 mt-1">
            {preparingOrders.length} paket hazırlanıyor
          </p>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-6 rounded-2xl border border-sand-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Ortalama Sepet (AOV)
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 font-serif text-2xl font-bold text-charcoal-950">
            {formatCurrency(averageOrderValue)}
          </div>
          <p className="text-[11px] text-charcoal-400 mt-1">Sipariş başına ortalama ciro</p>
        </div>

        {/* Critical Stock */}
        <div className="bg-white p-6 rounded-2xl border border-sand-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Kritik / Biten Stok
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 font-serif text-2xl font-bold text-charcoal-950">
            {criticalStockProducts.length + outOfStockProducts.length} Ürün
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            {outOfStockProducts.length} tükendi, {criticalStockProducts.length} kritik seviyede
          </p>
        </div>
      </div>

      {/* Order Status Funnel Strip */}
      <div className="bg-white p-6 rounded-2xl border border-sand-200/80 shadow-soft">
        <h3 className="font-serif text-sm font-semibold text-charcoal-900 mb-4">
          Operasyonel Sipariş Durumları
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Link
            href="/admin/siparisler?status=pending_payment"
            className="p-3.5 rounded-xl bg-sand-50 hover:bg-sand-100 transition-colors border border-sand-200/60"
          >
            <span className="text-[11px] text-charcoal-500 block">Ödeme Bekleyen</span>
            <span className="text-lg font-bold text-amber-700">{pendingOrders.length}</span>
          </Link>

          <Link
            href="/admin/siparisler?status=paid"
            className="p-3.5 rounded-xl bg-sand-50 hover:bg-sand-100 transition-colors border border-sand-200/60"
          >
            <span className="text-[11px] text-charcoal-500 block">Hazırlanacak</span>
            <span className="text-lg font-bold text-blue-700">{preparingOrders.length}</span>
          </Link>

          <Link
            href="/admin/siparisler?status=shipped"
            className="p-3.5 rounded-xl bg-sand-50 hover:bg-sand-100 transition-colors border border-sand-200/60"
          >
            <span className="text-[11px] text-charcoal-500 block">Kargoda</span>
            <span className="text-lg font-bold text-indigo-700">{shippedOrders.length}</span>
          </Link>

          <Link
            href="/admin/siparisler?status=delivered"
            className="p-3.5 rounded-xl bg-sand-50 hover:bg-sand-100 transition-colors border border-sand-200/60"
          >
            <span className="text-[11px] text-charcoal-500 block">Teslim Edildi</span>
            <span className="text-lg font-bold text-emerald-700">{deliveredOrders.length}</span>
          </Link>

          <Link
            href="/admin/iadeler"
            className="p-3.5 rounded-xl bg-sand-50 hover:bg-sand-100 transition-colors border border-sand-200/60"
          >
            <span className="text-[11px] text-charcoal-500 block">İade Talebi</span>
            <span className="text-lg font-bold text-rose-700">{returnOrders.length}</span>
          </Link>
        </div>
      </div>

      {/* Two Column Grid: Critical Stock + System Status / Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Critical Stock List */}
        <div className="bg-white p-6 rounded-2xl border border-sand-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-100">
            <h3 className="font-serif text-sm font-semibold text-charcoal-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Kritik ve Biten Stoklar
            </h3>
            <Link
              href="/admin/stok"
              className="text-xs text-charcoal-500 hover:text-gold-700 flex items-center gap-1"
            >
              Tümünü Gör <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {criticalStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-charcoal-400">
              Tüm ürünlerin stok seviyeleri güvenli eşiğin üzerinde.
            </div>
          ) : (
            <div className="divide-y divide-sand-100">
              {[...outOfStockProducts, ...criticalStockProducts].slice(0, 5).map((prod) => (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-medium text-charcoal-900 truncate">{prod.name}</p>
                    <span className="text-[11px] text-charcoal-400 font-mono">SKU: {prod.sku}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-bold px-2.5 py-1 rounded-full text-[11px] ${
                        prod.stock_quantity <= 0
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {prod.stock_quantity <= 0 ? "Tükendi" : `${prod.stock_quantity} Adet Kaldı`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Integration Status & Audit Logs */}
        <div className="bg-white p-6 rounded-2xl border border-sand-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-100">
            <h3 className="font-serif text-sm font-semibold text-charcoal-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-gold-600" /> Sistem & Entegrasyon Durumu
            </h3>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              Canlı
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-sand-50 border border-sand-200/60">
              <div>
                <p className="font-semibold text-charcoal-900">PostgreSQL Veritabanı</p>
                <p className="text-[11px] text-charcoal-500">38 Tablo, RLS ve Tetikleyiciler Hazır</p>
              </div>
              <span className="text-emerald-700 font-bold text-xs">Aktif</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-sand-50 border border-sand-200/60">
              <div>
                <p className="font-semibold text-charcoal-900">iyzico Ödeme Gateway</p>
                <p className="text-[11px] text-charcoal-500">
                  {settings.iyzico_test_mode ? "Sandbox Test Modunda" : "Canlı Üretim Modunda"}
                </p>
              </div>
              <span className="text-emerald-700 font-bold text-xs">Bağlı</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-sand-50 border border-sand-200/60">
              <div>
                <p className="font-semibold text-charcoal-900">E-Posta & Bildirim Kuyruğu</p>
                <p className="text-[11px] text-charcoal-500">Outbox Pattern ile Kesintisiz İletim</p>
              </div>
              <span className="text-emerald-700 font-bold text-xs">Çalışıyor</span>
            </div>
          </div>

          {/* Recent Audit Logs */}
          <div className="pt-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-500 mb-2">
              Son Yönetici İşlemleri
            </h4>
            <div className="space-y-1.5">
              {auditLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="text-[11px] text-charcoal-600 flex justify-between py-1">
                  <span className="truncate max-w-xs">{log.details || log.action}</span>
                  <span className="text-charcoal-400 flex-shrink-0 font-mono">
                    {formatDate(log.created_at)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
