"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Share2,
  Check,
  ChevronRight,
  Package,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/components/shared/ProductCard";
import { Product } from "@/lib/db/types";

interface ProductDetailClientProps {
  product: Product & { images: string[]; category_name?: string };
  relatedProducts: (Product & { images: string[]; category_name?: string })[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "care" | "shipping">("desc");

  const images = product.images && product.images.length > 0 ? product.images : ["/placeholder-jewelry.jpg"];
  const currentImage = images[selectedImageIndex] || images[0];

  const hasDiscount = product.sale_price !== null && product.sale_price !== undefined && product.sale_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.sale_price as number)) / product.price) * 100)
    : 0;
  const isOutOfStock = product.stock_quantity <= 0;
  const effectivePrice = product.sale_price ?? product.price;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleDirectBuy = () => {
    if (isOutOfStock) return;
    router.push(`/odeme?directProduct=${product.id}&qty=${quantity}`);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-charcoal-400 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-charcoal-800 transition-colors">
          Ana Sayfa
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-charcoal-300" />
        <Link href="/kategori/kolyeler" className="hover:text-charcoal-800 transition-colors">
          {product.category_name || "Kategori"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-charcoal-300" />
        <span className="text-charcoal-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Image Gallery */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? "border-gold-600 shadow-sm"
                      : "border-sand-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${product.name} - ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="relative flex-1 aspect-square rounded-3xl bg-sand-100 border border-sand-200/80 overflow-hidden shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {hasDiscount && (
                <Badge variant="danger" size="md" className="font-bold shadow-sm">
                  %{discountPercent} İndirim
                </Badge>
              )}
              {product.is_new && (
                <Badge variant="gold" size="md" className="shadow-sm">
                  Yeni Sezon
                </Badge>
              )}
            </div>

            {/* Favorite Button */}
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-charcoal-700 hover:text-rose-600 shadow-md transition-transform active:scale-90"
              aria-label="Favorilere ekle"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-rose-600 text-rose-600" : "text-charcoal-600"}`}
              />
            </button>
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & SKU */}
            <div className="flex items-center justify-between text-xs text-charcoal-400">
              <span className="uppercase tracking-widest font-semibold text-gold-700">
                {product.category_name || "Özel Koleksiyon"}
              </span>
              <span className="font-mono">SKU: {product.sku}</span>
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-medium tracking-tight">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 py-2 border-y border-sand-200/70">
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal-950">
                {formatCurrency(effectivePrice)}
              </span>
              {hasDiscount && (
                <span className="text-base text-charcoal-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                KDV Dahil
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-light">
              {product.short_description || product.description}
            </p>

            {/* Attributes Highlights */}
            <div className="grid grid-cols-2 gap-3 py-3 bg-white p-4 rounded-2xl border border-sand-200/80 text-xs text-charcoal-700">
              <div>
                <span className="text-charcoal-400 block text-[11px]">Materyal:</span>
                <span className="font-medium">{product.material || "925 Ayar Gümüş"}</span>
              </div>
              <div>
                <span className="text-charcoal-400 block text-[11px]">Taş:</span>
                <span className="font-medium">{product.stone_type || "Zirkon"}</span>
              </div>
              <div>
                <span className="text-charcoal-400 block text-[11px]">Renk:</span>
                <span className="font-medium">{product.color || "Altın"}</span>
              </div>
              <div>
                <span className="text-charcoal-400 block text-[11px]">Stok Durumu:</span>
                <span
                  className={`font-semibold ${
                    isOutOfStock
                      ? "text-rose-600"
                      : product.stock_quantity <= product.critical_stock_threshold
                      ? "text-amber-600"
                      : "text-emerald-700"
                  }`}
                >
                  {isOutOfStock
                    ? "Tükendi"
                    : product.stock_quantity <= product.critical_stock_threshold
                    ? `Son ${product.stock_quantity} Adet!`
                    : "Stokta Var"}
                </span>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                  Adet:
                </span>
                <div className="flex items-center border border-sand-300 rounded-lg bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="w-9 h-9 flex items-center justify-center text-charcoal-600 hover:bg-sand-100 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    disabled={quantity >= product.stock_quantity || isOutOfStock}
                    className="w-9 h-9 flex items-center justify-center text-charcoal-600 hover:bg-sand-100 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart & Direct Buy */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 h-12 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                    addedToCart
                      ? "bg-emerald-600 text-white"
                      : isOutOfStock
                      ? "bg-sand-300 text-charcoal-400 cursor-not-allowed"
                      : "bg-charcoal-900 text-white hover:bg-charcoal-800"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-4 h-4" /> Sepete Eklendi
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Sepete Ekle
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDirectBuy}
                  disabled={isOutOfStock}
                  className="flex-1 h-12 rounded-xl text-xs sm:text-sm font-semibold bg-gold-600 text-white hover:bg-gold-700 active:scale-98 flex items-center justify-center gap-2 transition-all shadow-md shadow-gold-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-4 h-4 fill-white" /> Doğrudan Satın Al
                </button>
              </div>

              {/* Share Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 text-xs text-charcoal-500 hover:text-charcoal-800 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {copiedLink ? "Bağlantı Kopyalandı!" : "Ürünü Paylaş"}
                </button>
              </div>
            </div>

            {/* Trust Features Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-sand-200 text-charcoal-600 text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold-600 flex-shrink-0" />
                <span>1-2 İş Gününde Hızlı Kargo</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-600 flex-shrink-0" />
                <span>Orijinal Ayar Sertifikalı</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-gold-600 flex-shrink-0" />
                <span>14 Gün Koşulsuz İade</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description / Care / Delivery */}
      <div className="mt-16 pt-8 border-t border-sand-200">
        <div className="flex border-b border-sand-200 gap-8">
          <button
            type="button"
            onClick={() => setActiveTab("desc")}
            className={`pb-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "desc"
                ? "border-gold-600 text-charcoal-900"
                : "border-transparent text-charcoal-400 hover:text-charcoal-700"
            }`}
          >
            Ürün Açıklaması
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("care")}
            className={`pb-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "care"
                ? "border-gold-600 text-charcoal-900"
                : "border-transparent text-charcoal-400 hover:text-charcoal-700"
            }`}
          >
            Bakım Talimatları
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("shipping")}
            className={`pb-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "shipping"
                ? "border-gold-600 text-charcoal-900"
                : "border-transparent text-charcoal-400 hover:text-charcoal-700"
            }`}
          >
            Teslimat & İade
          </button>
        </div>

        <div className="py-6 text-xs sm:text-sm text-charcoal-600 leading-relaxed max-w-3xl">
          {activeTab === "desc" && (
            <div className="space-y-3">
              <p>{product.description || "ZeynepNova özel tasarım takı modeli."}</p>
              {product.package_contents && (
                <div className="mt-4 p-4 rounded-xl bg-sand-100 flex items-start gap-3">
                  <Package className="w-4 h-4 text-gold-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-charcoal-900 text-xs">Paket İçeriği:</h5>
                    <p className="text-xs text-charcoal-600 mt-0.5">{product.package_contents}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "care" && (
            <div className="space-y-3">
              <p>
                {product.care_instructions ||
                  "Takılarınızın parlaklığını ve kaplamasını uzun süre koruması için su, parfüm, deterjan ve kimyasal maddelerle doğrudan temasından kaçınınız."}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Denize, havuza veya duşa girmeden önce çıkarınız.</li>
                <li>Kullanmadığınız zamanlarda hava almayan özel kutusunda muhafaza ediniz.</li>
                <li>Gümüş parlatma bezi ile nazikçe silerek temizleyiniz.</li>
              </ul>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-3">
              <p>
                Siparişleriniz en geç 1-2 iş günü içerisinde özenle hazırlanarak sigortalı kargo ile gönderilir.
              </p>
              <p>
                1.500 ₺ ve üzeri tüm siparişlerde kargo <strong>ücretsizdir</strong>. 14 gün içerisinde
                kullanılmamış ürünleri koşulsuz iade edebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-sand-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
                Tamamlayıcı Parçalar
              </span>
              <h2 className="font-serif text-2xl text-charcoal-950 font-medium mt-1">
                Birlikte Çok Yakışanlar
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="h-full">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <ProductCard {...(p as any)} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
