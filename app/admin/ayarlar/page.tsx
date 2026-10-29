import React from "react";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Settings, ShieldCheck, CreditCard, Truck, Building2, Save } from "lucide-react";

export default async function AdminSettingsPage() {
  const settings = await db.getStoreSettings();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-gold-700">
          Sistem Yapılandırması
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-medium mt-1">
          Mağaza ve Entegrasyon Ayarları
        </h1>
        <p className="text-xs text-charcoal-500 mt-1">
          Türkiye e-ticaret mevzuatına uygun fatura bilgileri, kargo kuralları ve ödeme parametreleri.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-soft space-y-6">
        {/* Company Legal Information */}
        <div className="space-y-4">
          <h2 className="font-serif text-base font-semibold text-charcoal-900 pb-2 border-b border-sand-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gold-600" /> Şirket & Yasal Bilgiler (ETBİS & Fatura)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-charcoal-700">Resmi Şirket Unvanı</label>
              <input
                type="text"
                defaultValue={settings.company_legal_name}
                className="w-full h-11 px-3.5 rounded-xl border border-sand-300 bg-sand-50/50"
                readOnly
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-charcoal-700">MERSİS Numarası</label>
              <input
                type="text"
                defaultValue={settings.mersis_number || "0123456789000001"}
                className="w-full h-11 px-3.5 rounded-xl border border-sand-300 bg-sand-50/50 font-mono"
                readOnly
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-charcoal-700">Vergi Dairesi & No</label>
              <input
                type="text"
                defaultValue={`${settings.tax_office} - ${settings.tax_number}`}
                className="w-full h-11 px-3.5 rounded-xl border border-sand-300 bg-sand-50/50"
                readOnly
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-charcoal-700">Müşteri Destek E-Posta</label>
              <input
                type="email"
                defaultValue={settings.support_email}
                className="w-full h-11 px-3.5 rounded-xl border border-sand-300 bg-sand-50/50"
                readOnly
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-charcoal-700">Resmi Şirket Adresi</label>
              <input
                type="text"
                defaultValue={settings.company_address}
                className="w-full h-11 px-3.5 rounded-xl border border-sand-300 bg-sand-50/50"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Parameters */}
        <div className="space-y-4 pt-4 border-t border-sand-100">
          <h2 className="font-serif text-base font-semibold text-charcoal-900 pb-2 border-b border-sand-100 flex items-center gap-2">
            <Truck className="w-4 h-4 text-gold-600" /> Kargo ve Teslimat Kuralları
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-charcoal-700">Ücretsiz Kargo Eşiği (TL)</label>
              <input
                type="number"
                defaultValue={settings.free_shipping_threshold}
                className="w-full h-11 px-3.5 rounded-xl border border-sand-300 font-semibold"
              />
              <p className="text-[10px] text-charcoal-400">
                Bu sepet tutarının üzerindeki siparişlerde kargo otomatik olarak ücretsiz olur.
              </p>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-charcoal-700">Standart Sabit Kargo Ücreti (TL)</label>
              <input
                type="number"
                defaultValue={settings.standard_shipping_fee}
                className="w-full h-11 px-3.5 rounded-xl border border-sand-300 font-semibold"
              />
              <p className="text-[10px] text-charcoal-400">
                Eşiğin altındaki siparişlere uygulanacak kargo bedeli.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Integration (iyzico) */}
        <div className="space-y-4 pt-4 border-t border-sand-100">
          <h2 className="font-serif text-base font-semibold text-charcoal-900 pb-2 border-b border-sand-100 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gold-600" /> iyzico Ödeme Entegrasyonu
          </h2>

          <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-charcoal-900">Çalışma Modu:</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {settings.iyzico_test_mode ? "Sandbox Test Modu" : "Canlı Üretim Modu"}
              </span>
            </div>
            <p className="text-[11px] text-charcoal-500 leading-relaxed">
              Canlı iyzico API anahtarları `.env` ortam değişkenlerinden güvenli biçimde okunmaktadır.
              Kaynak koda hiçbir gizli anahtar yazılmaz.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-sand-100 flex justify-end">
          <button
            type="button"
            className="px-6 py-2.5 rounded-xl bg-charcoal-900 text-white text-xs font-semibold hover:bg-gold-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" /> Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
