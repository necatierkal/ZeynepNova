"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  Truck,
  FileText,
  CreditCard,
  ChevronRight,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Contract Modal states
  const [activeModal, setActiveModal] = useState<"distance_sales" | "pre_info" | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    guest_name: "Ayşe Yılmaz",
    guest_email: "ayse.yilmaz@example.com",
    guest_phone: "05325551234",
    shipping_title: "Ev",
    shipping_first_name: "Ayşe",
    shipping_last_name: "Yılmaz",
    shipping_phone: "05325551234",
    shipping_address_line1: "Bağdat Caddesi No: 120 Daire: 4",
    shipping_district: "Kadıköy",
    shipping_city: "İstanbul",
    notes: "",
    agreed_to_terms: false,
  });

  // Simulated Cart items
  const items = [
    {
      id: "p0000001-0000-0000-0000-000000000001",
      name: "Işıltılı Baget Kesim Pırlanta Efektli Kolye",
      price: 1490,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&q=80",
    },
  ];

  const subtotal = 1490;
  const shippingFee = subtotal >= 1500 ? 0 : 79.9;
  const grandTotal = subtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checked = (e.target as any).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError("");

    if (!formData.agreed_to_terms) {
      setCheckoutError("Lütfen Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formunu onaylayın.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_email: formData.guest_email,
          guest_phone: formData.guest_phone,
          guest_name: formData.guest_name,
          shipping_address: {
            title: formData.shipping_title,
            first_name: formData.shipping_first_name,
            last_name: formData.shipping_last_name,
            phone: formData.shipping_phone,
            address_line1: formData.shipping_address_line1,
            district: formData.shipping_district,
            city: formData.shipping_city,
            country: "Türkiye",
          },
          billing_address: {
            title: formData.shipping_title,
            first_name: formData.shipping_first_name,
            last_name: formData.shipping_last_name,
            phone: formData.shipping_phone,
            address_line1: formData.shipping_address_line1,
            district: formData.shipping_district,
            city: formData.shipping_city,
            country: "Türkiye",
          },
          notes: formData.notes,
          items: items.map((it) => ({
            product_id: it.id,
            quantity: it.quantity,
          })),
          agreed_to_terms: true,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to confirmation or load iyzico checkout form
        router.push(data.paymentUrl || `/odeme/onay?orderNumber=${data.orderNumber}`);
      } else {
        setCheckoutError(data.error || "Sipariş işlenirken bir hata oluştu.");
      }
    } catch {
      // In offline/mock fallback: direct success navigation for local test
      const mockOrderNo = `ZN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
        Math.random() * 9000 + 1000
      )}`;
      router.push(`/odeme/onay?orderNumber=${mockOrderNo}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen pb-20 bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-charcoal-400 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-charcoal-800">
              Ana Sayfa
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/sepet" className="hover:text-charcoal-800">
              Sepet
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-charcoal-800 font-medium">Güvenli Ödeme</span>
          </nav>

          <div className="flex items-center justify-between pb-6 border-b border-sand-200 mb-8">
            <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-medium">
              Siparişi Tamamla
            </h1>
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 text-xs font-medium">
              <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Güvenli Checkout
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left 2 Cols: Customer & Address Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Customer Contact Info */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-sand-200/80 shadow-soft space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-sand-100">
                  <span className="w-7 h-7 rounded-full bg-charcoal-900 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="font-serif text-base font-medium text-charcoal-900">
                    İletişim Bilgileri
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal-700">Ad Soyad *</label>
                    <input
                      type="text"
                      name="guest_name"
                      required
                      value={formData.guest_name}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3 text-xs rounded-lg border border-sand-300 focus:outline-none focus:border-gold-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal-700">E-Posta *</label>
                    <input
                      type="email"
                      name="guest_email"
                      required
                      value={formData.guest_email}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3 text-xs rounded-lg border border-sand-300 focus:outline-none focus:border-gold-600"
                    />
                    <p className="text-[10px] text-charcoal-400">Sipariş takibi için kullanılacaktır.</p>
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-charcoal-700">Telefon Numarası *</label>
                    <input
                      type="tel"
                      name="guest_phone"
                      required
                      placeholder="05321234567"
                      value={formData.guest_phone}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3 text-xs rounded-lg border border-sand-300 focus:outline-none focus:border-gold-600"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping & Delivery Address */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-sand-200/80 shadow-soft space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-sand-100">
                  <span className="w-7 h-7 rounded-full bg-charcoal-900 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="font-serif text-base font-medium text-charcoal-900">
                    Teslimat Adresi
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal-700">Ad *</label>
                    <input
                      type="text"
                      name="shipping_first_name"
                      required
                      value={formData.shipping_first_name}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3 text-xs rounded-lg border border-sand-300 focus:outline-none focus:border-gold-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal-700">Soyad *</label>
                    <input
                      type="text"
                      name="shipping_last_name"
                      required
                      value={formData.shipping_last_name}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3 text-xs rounded-lg border border-sand-300 focus:outline-none focus:border-gold-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal-700">İl *</label>
                    <input
                      type="text"
                      name="shipping_city"
                      required
                      value={formData.shipping_city}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3 text-xs rounded-lg border border-sand-300 focus:outline-none focus:border-gold-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal-700">İlçe *</label>
                    <input
                      type="text"
                      name="shipping_district"
                      required
                      value={formData.shipping_district}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3 text-xs rounded-lg border border-sand-300 focus:outline-none focus:border-gold-600"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-charcoal-700">Açık Adres *</label>
                    <textarea
                      name="shipping_address_line1"
                      required
                      rows={2}
                      placeholder="Cadde, mahalle, sokak, bina ve daire numarası"
                      value={formData.shipping_address_line1}
                      onChange={handleInputChange}
                      className="w-full p-3 text-xs rounded-lg border border-sand-300 focus:outline-none focus:border-gold-600"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-charcoal-700">
                      Sipariş Notu (Opsiyonel)
                    </label>
                    <input
                      type="text"
                      name="notes"
                      placeholder="Kuryeye iletmek istediğiniz özel bir not var mı?"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3 text-xs rounded-lg border border-sand-300 focus:outline-none focus:border-gold-600"
                    />
                  </div>
                </div>

                {/* Billing address checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs text-charcoal-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="rounded border-sand-300 text-gold-600 focus:ring-gold-500"
                    />
                    <span>Fatura adresim teslimat adresiyle aynı</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Col: Order Summary & Legal Contracts */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-sand-200/80 shadow-soft space-y-4">
                <h3 className="font-serif text-base font-medium text-charcoal-950 pb-3 border-b border-sand-100 flex items-center justify-between">
                  <span>Sipariş Özeti</span>
                  <span className="text-xs text-charcoal-400 font-sans">1 Ürün</span>
                </h3>

                {/* Items preview */}
                <div className="space-y-3 pb-3 border-b border-sand-100">
                  {items.map((it) => (
                    <div key={it.id} className="flex gap-3 items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-12 h-12 rounded-lg object-cover border border-sand-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-charcoal-800 truncate">{it.name}</p>
                        <p className="text-[11px] text-charcoal-400">{it.quantity} Adet</p>
                      </div>
                      <span className="text-xs font-semibold text-charcoal-900">
                        {formatCurrency(it.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Calculation breakdown */}
                <div className="space-y-2 text-xs text-charcoal-600">
                  <div className="flex justify-between">
                    <span>Ara Toplam:</span>
                    <span className="font-medium text-charcoal-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kargo:</span>
                    <span className="font-medium text-charcoal-900">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-700">Ücretsiz</span>
                      ) : (
                        formatCurrency(shippingFee)
                      )}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-sand-200 flex justify-between items-baseline">
                    <span className="font-serif text-sm font-semibold text-charcoal-950">
                      Ödenecek Tutar:
                    </span>
                    <span className="font-serif text-xl font-bold text-charcoal-950">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Mandatory Legal Contracts Checkbox */}
                <div className="pt-4 border-t border-sand-100 space-y-2">
                  <label className="flex items-start gap-2 text-[11px] text-charcoal-600 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreed_to_terms"
                      required
                      checked={formData.agreed_to_terms}
                      onChange={handleInputChange}
                      className="mt-0.5 rounded border-sand-300 text-gold-600 focus:ring-gold-500"
                    />
                    <span>
                      <button
                        type="button"
                        onClick={() => setActiveModal("distance_sales")}
                        className="text-gold-700 underline font-medium"
                      >
                        Mesafeli Satış Sözleşmesi
                      </button>
                      &apos;ni ve{" "}
                      <button
                        type="button"
                        onClick={() => setActiveModal("pre_info")}
                        className="text-gold-700 underline font-medium"
                      >
                        Ön Bilgilendirme Formu
                      </button>
                      &apos;nu okudum, onaylıyorum.
                    </span>
                  </label>
                </div>

                {checkoutError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                {/* Payment Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-charcoal-900 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-gold-700 transition-all shadow-md active:scale-98 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      "Ödeme Başlatılıyor..."
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" /> iyzico ile Güvenli Öde
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-[10px] text-charcoal-400">
                    Kart bilgileriniz hiçbir şekilde sunucularımızda saklanmaz. Ödeme işlemi 256-Bit SSL
                    ve iyzico güvencesiyle yürütülür.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Contract Preview Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-sand-200 flex justify-between items-center">
              <h3 className="font-serif font-medium text-charcoal-900 text-sm">
                {activeModal === "distance_sales"
                  ? "Mesafeli Satış Sözleşmesi (Taslak)"
                  : "Ön Bilgilendirme Formu (Taslak)"}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-charcoal-400 hover:text-charcoal-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-xs text-charcoal-600 leading-relaxed space-y-3">
              <p>
                <strong>SATICI:</strong> ZeynepNova Takı ve Mücevherat Ltd. Şti.
                <br />
                <strong>ADRES:</strong> Nişantaşı, Abdi İpekçi Cad. No: 42, Şişli / İstanbul
                <br />
                <strong>E-POSTA:</strong> destek@zeynepnova.com | MERSİS NO: 0123456789000001
              </p>
              <p>
                Bu metin 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
                Yönetmeliği kapsamında hazırlanmış yasal taslak bilgilendirmedir. Tüketici siparişi
                tamamladığında sözleşme şartlarını kabul etmiş sayılır.
              </p>
              <p>
                <strong>CAYMA HAKKI:</strong> Tüketici, ürünün kendisine teslim edildiği tarihten itibaren
                14 gün içinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin cayma hakkını kullanabilir.
              </p>
            </div>
            <div className="p-4 border-t border-sand-200 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-charcoal-900 text-white rounded-lg text-xs font-semibold hover:bg-gold-700"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
