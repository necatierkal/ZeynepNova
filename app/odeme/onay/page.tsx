import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, AlertTriangle, ArrowRight, Package, Home } from "lucide-react";

interface OrderConfirmationPageProps {
  searchParams: Promise<{
    orderNumber?: string;
    status?: string;
    error?: string;
  }>;
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
  const { orderNumber, status, error } = await searchParams;
  const isSuccess = status !== "failed";
  const displayOrderNo = orderNumber || `ZN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-8821`;

  return (
    <>
      <Header />

      <main className="min-h-screen py-16 bg-sand-50 flex items-center justify-center">
        <div className="max-w-xl w-full mx-4 bg-white p-8 sm:p-10 rounded-3xl border border-sand-200 shadow-soft text-center space-y-6">
          {isSuccess ? (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-gold-700 font-semibold">
                  Tebrikler!
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-medium">
                  Siparişiniz Başarıyla Alındı
                </h1>
                <p className="text-xs text-charcoal-500">
                  Ödemeniz güvenle alındı. Sipariş detaylarınız e-posta adresinize gönderildi.
                </p>
              </div>

              {/* Order Number Box */}
              <div className="p-4 bg-sand-50 rounded-2xl border border-sand-200/80 text-left space-y-1">
                <div className="text-[11px] text-charcoal-400">Sipariş Takip Numaranız:</div>
                <div className="font-mono text-base font-bold text-charcoal-900">{displayOrderNo}</div>
                <p className="text-[11px] text-charcoal-500 pt-1">
                  Bu numara ile siparişinizi dilediğiniz an takip edebilirsiniz.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-left flex items-start gap-3 text-xs text-charcoal-600">
                <Package className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <p>
                  Takılarınız atölyemizde özenle kontrol edilecek, hediye kutusuna konulacak ve en geç 1-2 iş
                  gününde sigortalı olarak kargoya verilecektir.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link
                  href={`/siparis-takip?orderNumber=${displayOrderNo}`}
                  className="flex-1 h-12 rounded-xl bg-charcoal-900 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-gold-700 transition-all shadow-md"
                >
                  Siparişi Takip Et <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="flex-1 h-12 rounded-xl border border-sand-300 bg-white text-charcoal-800 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-sand-100 transition-all"
                >
                  <Home className="w-4 h-4" /> Ana Sayfaya Dön
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h1 className="font-serif text-2xl text-charcoal-950 font-medium">
                  Ödeme Tamamlanamadı
                </h1>
                <p className="text-xs text-rose-600 font-medium">
                  {error || "Banka tarafından ödeme onaylanmadı."}
                </p>
                <p className="text-xs text-charcoal-500">
                  Kartınızdan herhangi bir ücret tahsil edilmemiştir. Lütfen kart bilgilerinizi kontrol ederek
                  tekrar deneyin.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/sepet"
                  className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-charcoal-900 text-white text-xs font-semibold hover:bg-gold-700 transition-all"
                >
                  Sepete Dön ve Tekrar Dene
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
