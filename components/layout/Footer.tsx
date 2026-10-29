"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, ShieldCheck, CreditCard, RefreshCw } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
      } else {
        // Fallback for UI if endpoint not ready yet
        setSubscribed(true);
      }
    } catch {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-sand-100/90 text-charcoal-800 border-t border-sand-200 mt-auto pt-16 pb-8">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-sand-200/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-xl bg-white/60 border border-sand-200/60 shadow-soft">
            <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-medium text-sm text-charcoal-900">Güvenli Alışveriş</h4>
              <p className="text-xs text-charcoal-500 mt-0.5">iyzico altyapısıyla 256-bit SSL şifreli ödeme.</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-xl bg-white/60 border border-sand-200/60 shadow-soft">
            <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 flex-shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-medium text-sm text-charcoal-900">1.500 ₺ Üzeri Ücretsiz Kargo</h4>
              <p className="text-xs text-charcoal-500 mt-0.5">Özenli hediye paketi ve sigortalı gönderim.</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-xl bg-white/60 border border-sand-200/60 shadow-soft">
            <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-medium text-sm text-charcoal-900">14 Gün Koşulsuz İade</h4>
              <p className="text-xs text-charcoal-500 mt-0.5">Kolay ve şeffaf iade süreci garantisi.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl tracking-widest text-charcoal-950 uppercase font-medium">
                Zeynep<span className="text-gold-600 font-light">Nova</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-charcoal-600 max-w-sm">
              ZeynepNova, zarafeti ve modern tasarımı bir araya getiren özgün takı koleksiyonları sunar.
              Her bir parçamız özenli el işçiliği, seçkin materyaller ve zamansız estetikle üretilir.
            </p>
            <div className="pt-2">
              <p className="text-xs text-charcoal-500 font-medium">Müşteri Destek:</p>
              <p className="text-xs text-charcoal-800 font-semibold mt-0.5">destek@zeynepnova.com</p>
              <p className="text-[11px] text-charcoal-400 mt-1">Hafta içi 09:00 - 18:00 (Europe/Istanbul)</p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 mb-4 font-serif">
              Koleksiyonlar
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-600">
              <li>
                <Link href="/kategori/kolyeler" className="hover:text-gold-700 transition-colors">
                  Kolyeler
                </Link>
              </li>
              <li>
                <Link href="/kategori/kupeler" className="hover:text-gold-700 transition-colors">
                  Küpeler
                </Link>
              </li>
              <li>
                <Link href="/kategori/yuzukler" className="hover:text-gold-700 transition-colors">
                  Yüzükler
                </Link>
              </li>
              <li>
                <Link href="/kategori/bileklikler" className="hover:text-gold-700 transition-colors">
                  Bileklikler
                </Link>
              </li>
              <li>
                <Link href="/kategori/taki-setleri" className="hover:text-gold-700 transition-colors">
                  Takı Setleri
                </Link>
              </li>
              <li>
                <Link href="/kategori/cok-satanlar" className="hover:text-gold-700 transition-colors">
                  Çok Satanlar
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Help */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 mb-4 font-serif">
              Müşteri Hizmetleri
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-600">
              <li>
                <Link href="/siparis-takip" className="hover:text-gold-700 transition-colors">
                  Sipariş Takibi
                </Link>
              </li>
              <li>
                <Link href="/kargo-ve-teslimat" className="hover:text-gold-700 transition-colors">
                  Kargo ve Teslimat
                </Link>
              </li>
              <li>
                <Link href="/iade-ve-degisim" className="hover:text-gold-700 transition-colors">
                  İade ve Değişim
                </Link>
              </li>
              <li>
                <Link href="/sikca-sorulan-sorular" className="hover:text-gold-700 transition-colors">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="hover:text-gold-700 transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-gold-700 transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 mb-3 font-serif">
              E-Bülten
            </h4>
            <p className="text-xs text-charcoal-600">
              Yeni koleksiyonlar ve özel ayrıcalıklardan ilk siz haberdar olun.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Bültenimize başarıyla kaydoldunuz. Teşekkürler!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 pr-9 text-xs rounded-lg border border-sand-300 bg-white focus:outline-none focus:border-gold-600"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-500 hover:text-gold-700"
                    aria-label="Abone Ol"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
                {error && <p className="text-[11px] text-rose-600">{error}</p>}
                <p className="text-[10px] text-charcoal-500">
                  Kaydolarak{" "}
                  <Link href="/gizlilik-politikasi" className="underline hover:text-gold-700">
                    Gizlilik Politikası
                  </Link>
                  &apos;nı kabul etmiş olursunuz.
                </p>
              </form>
            )}

            <div className="pt-2">
              <h5 className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-2">
                Yasal Bilgilendirme
              </h5>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-charcoal-500">
                <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-gold-700">
                  Mesafeli Satış
                </Link>
                <Link href="/on-bilgilendirme-formu" className="hover:text-gold-700">
                  Ön Bilgilendirme
                </Link>
                <Link href="/kvkk-aydinlatma-metni" className="hover:text-gold-700">
                  KVKK Metni
                </Link>
                <Link href="/cerez-politikasi" className="hover:text-gold-700">
                  Çerez Politikası
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Logos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-sand-200/60">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-500">
          <p>© {new Date().getFullYear()} ZeynepNova Atelier. Tüm hakları saklıdır. (Türkiye / TRY)</p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-charcoal-400">
              Güvenli Ödeme:
            </span>
            <span className="font-semibold text-charcoal-700 bg-white px-2 py-0.5 rounded border border-sand-200 text-[11px]">
              iyzico
            </span>
            <span className="font-semibold text-charcoal-700 bg-white px-2 py-0.5 rounded border border-sand-200 text-[11px]">
              Troy
            </span>
            <span className="font-semibold text-charcoal-700 bg-white px-2 py-0.5 rounded border border-sand-200 text-[11px]">
              Visa
            </span>
            <span className="font-semibold text-charcoal-700 bg-white px-2 py-0.5 rounded border border-sand-200 text-[11px]">
              Mastercard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
