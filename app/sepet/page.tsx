"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { formatCurrency } from "@/lib/utils";
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  Check,
  Tag,
  AlertCircle,
} from "lucide-react";

interface LocalCartItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice?: number | null;
  image: string;
  quantity: number;
  material?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<LocalCartItem[]>([
    {
      id: "p0000001-0000-0000-0000-000000000001",
      name: "Işıltılı Baget Kesim Pırlanta Efektli Kolye",
      slug: "isiltili-baget-kesim-kolye",
      sku: "ZN-KLY-0001",
      price: 1850,
      salePrice: 1490,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80",
      quantity: 1,
      material: "925 Ayar Gümüş / 14K Altın Kaplama",
    },
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const freeShippingThreshold = 1500;
  const standardShippingFee = 79.9;

  // Recalculate subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    const p = item.salePrice ?? item.price;
    return acc + p * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const isFreeShipping = subtotal >= freeShippingThreshold || appliedCoupon?.code === "KARGO";
  const shippingFee = cartItems.length === 0 ? 0 : isFreeShipping ? 0 : standardShippingFee;
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as LocalCartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "ZEYNEP10") {
      const discount = (subtotal * 10) / 100;
      setAppliedCoupon({ code, discount });
      setCouponSuccess("%10 İndirim uygulandı!");
    } else if (code === "HOSGELDIN150") {
      if (subtotal < 1200) {
        setCouponError("Bu kupon en az 1.200 ₺ sepet tutarında geçerlidir.");
        return;
      }
      setAppliedCoupon({ code, discount: 150 });
      setCouponSuccess("150 ₺ indirim uygulandı!");
    } else if (code === "KARGO") {
      setAppliedCoupon({ code, discount: standardShippingFee });
      setCouponSuccess("Ücretsiz kargo kuponu uygulandı!");
    } else {
      setCouponError("Geçersiz veya süresi dolmuş kupon kodu.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponSuccess("");
  };

  return (
    <>
      <AnnouncementBar />
      <Header />

      <main className="min-h-screen pb-20 bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="w-6 h-6 text-gold-600" />
            <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-medium">
              Alışveriş Sepetim
            </h1>
            <span className="text-xs text-charcoal-500 font-sans">({cartItems.length} Ürün)</span>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart View */
            <div className="text-center py-24 bg-white rounded-3xl border border-sand-200/80 shadow-soft max-w-lg mx-auto p-8">
              <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center mx-auto text-charcoal-400 mb-4">
                <ShoppingBag className="w-8 h-8 text-gold-600" />
              </div>
              <h2 className="font-serif text-xl font-medium text-charcoal-900">Sepetiniz Boş</h2>
              <p className="text-xs text-charcoal-500 mt-2 leading-relaxed">
                Henüz sepetinize bir takı eklemediniz. ZeynepNova koleksiyonlarını keşfederek ışıltınıza
                yakışacak parçaları hemen seçebilirsiniz.
              </p>
              <div className="mt-8">
                <Link
                  href="/kategori/kolyeler"
                  className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-charcoal-900 text-white text-xs font-semibold hover:bg-gold-700 transition-colors gap-2"
                >
                  Koleksiyonları Keşfet <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Cart Item List */}
              <div className="lg:col-span-2 space-y-4">
                {/* Free Shipping Progress Indicator */}
                <div className="p-4 bg-white rounded-2xl border border-sand-200/80 shadow-soft space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-charcoal-800 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-gold-600" />
                      {isFreeShipping ? (
                        <span className="text-emerald-700 font-semibold">Tebrikler! Kargonuz Ücretsiz.</span>
                      ) : (
                        <span>
                          Ücretsiz kargo için <strong>{formatCurrency(neededForFreeShipping)}</strong> daha alışveriş yapın!
                        </span>
                      )}
                    </span>
                    <span className="text-charcoal-400 font-medium">
                      {isFreeShipping ? "100%" : `%${freeShippingProgress}`}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-sand-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl border border-sand-200/80 shadow-soft divide-y divide-sand-100">
                  {cartItems.map((item) => {
                    const price = item.salePrice ?? item.price;
                    const itemTotal = price * item.quantity;

                    return (
                      <div key={item.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-center">
                        {/* Image */}
                        <Link
                          href={`/urun/${item.slug}`}
                          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-sand-100 overflow-hidden flex-shrink-0 border border-sand-200"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover object-center"
                          />
                        </Link>

                        {/* Title, Details, Qty, Price */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/urun/${item.slug}`}>
                            <h3 className="font-serif text-sm font-medium text-charcoal-900 hover:text-gold-700 truncate">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-[11px] text-charcoal-400 mt-0.5 font-mono">SKU: {item.sku}</p>
                          {item.material && (
                            <p className="text-[11px] text-charcoal-500 mt-0.5">{item.material}</p>
                          )}

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-sand-300 rounded-lg bg-white overflow-hidden">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, -1)}
                                className="w-7 h-7 flex items-center justify-center text-charcoal-600 hover:bg-sand-100 text-xs"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="w-7 h-7 flex items-center justify-center text-charcoal-600 hover:bg-sand-100 text-xs"
                              >
                                +
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="font-semibold text-charcoal-900 text-sm">
                                {formatCurrency(itemTotal)}
                              </div>
                              {item.salePrice && (
                                <div className="text-[11px] text-charcoal-400 line-through">
                                  {formatCurrency(item.price * item.quantity)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-charcoal-400 hover:text-rose-600 transition-colors"
                          title="Ürünü sepetten çıkar"
                          aria-label="Sepetten çıkar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Col: Order Summary & Coupon */}
              <div className="space-y-6">
                {/* Coupon Box */}
                <div className="bg-white p-5 rounded-2xl border border-sand-200/80 shadow-soft">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-3 flex items-center gap-1.5 font-serif">
                    <Tag className="w-3.5 h-3.5 text-gold-600" /> İndirim Kuponu
                  </h4>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                      <div>
                        <span className="font-semibold text-emerald-800">{appliedCoupon.code}</span>
                        <p className="text-[11px] text-emerald-600">
                          {formatCurrency(appliedCoupon.discount)} indirim uygulandı
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-xs text-rose-600 hover:underline font-medium"
                      >
                        Kaldır
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Kupon Kodu (Örn: ZEYNEP10)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1 h-10 px-3 text-xs uppercase rounded-lg border border-sand-300 focus:outline-none focus:border-gold-600"
                        />
                        <button
                          type="submit"
                          className="h-10 px-4 rounded-lg bg-charcoal-900 text-white text-xs font-medium hover:bg-gold-700 transition-colors"
                        >
                          Uygula
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[11px] text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {couponError}
                        </p>
                      )}
                      {couponSuccess && (
                        <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                          <Check className="w-3 h-3" /> {couponSuccess}
                        </p>
                      )}
                    </form>
                  )}
                </div>

                {/* Summary Card */}
                <div className="bg-white p-6 rounded-2xl border border-sand-200/80 shadow-soft space-y-4">
                  <h3 className="font-serif text-base font-medium text-charcoal-950 pb-3 border-b border-sand-100">
                    Sipariş Özeti
                  </h3>

                  <div className="space-y-2.5 text-xs text-charcoal-600">
                    <div className="flex justify-between">
                      <span>Ara Toplam:</span>
                      <span className="font-medium text-charcoal-900">{formatCurrency(subtotal)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Kupon İndirimi:</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Kargo:</span>
                      <span>
                        {shippingFee === 0 ? (
                          <strong className="text-emerald-700">Ücretsiz</strong>
                        ) : (
                          formatCurrency(shippingFee)
                        )}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-sand-200 flex justify-between items-baseline">
                      <span className="font-serif text-sm font-semibold text-charcoal-950">
                        Genel Toplam:
                      </span>
                      <div className="text-right">
                        <span className="font-serif text-xl font-bold text-charcoal-950 block">
                          {formatCurrency(grandTotal)}
                        </span>
                        <span className="text-[10px] text-charcoal-400">KDV Dahil</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/odeme"
                      className="w-full h-12 rounded-xl bg-charcoal-900 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-gold-700 transition-all shadow-md active:scale-98"
                    >
                      Siparişi Tamamla <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Security icons */}
                  <div className="pt-4 border-t border-sand-100 flex items-center justify-center gap-4 text-charcoal-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold-600" /> 256-Bit SSL
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-gold-600" /> Orijinal Tasarım
                    </span>
                  </div>
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
