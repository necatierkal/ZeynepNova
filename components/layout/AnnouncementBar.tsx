import React from "react";
import Link from "next/link";
import { Sparkles, Truck, ShieldCheck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-charcoal-900 text-sand-100 text-xs py-2 px-4 font-normal tracking-wide border-b border-charcoal-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center">
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-gold-400" />
          <span>1.500 ₺ ve Üzeri Siparişlerde <strong>Ücretsiz Kargo</strong></span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-charcoal-300">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            256-Bit SSL Güvenli Ödeme
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            Özel Tasarım Hediye Paketi
          </span>
        </div>
        <div>
          <Link
            href="/iletisim"
            className="hover:text-gold-300 transition-colors underline decoration-sand-400 underline-offset-2"
          >
            Müşteri Hizmetleri
          </Link>
        </div>
      </div>
    </div>
  );
}
