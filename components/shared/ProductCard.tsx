"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryName?: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  stockQuantity: number;
  material?: string;
  stoneType?: string;
  isNew?: boolean;
}

export function ProductCard({
  name,
  slug,
  categoryName,
  price,
  salePrice,
  images,
  stockQuantity,
  material,
  isNew,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = images && images.length > 0 ? images[0] : "/placeholder-jewelry.jpg";
  const hoverImage = images && images.length > 1 ? images[1] : primaryImage;

  const hasDiscount = salePrice !== null && salePrice !== undefined && salePrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - (salePrice as number)) / price) * 100) : 0;
  const isOutOfStock = stockQuantity <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;

    // Dispatch event or call cart store
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      className="group relative bg-white rounded-2xl border border-sand-200/80 overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/urun/${slug}`} className="relative aspect-square w-full bg-sand-100 overflow-hidden block">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {hasDiscount && (
            <Badge variant="danger" size="sm" className="shadow-sm font-bold">
              %{discountPercent} İndirim
            </Badge>
          )}
          {isNew && (
            <Badge variant="gold" size="sm" className="shadow-sm font-semibold">
              Yeni
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="default" size="sm" className="bg-charcoal-700 text-white">
              Tükendi
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-charcoal-700 hover:text-rose-600 shadow-sm transition-transform active:scale-90"
          aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? "fill-rose-600 text-rose-600" : "text-charcoal-600"
            }`}
          />
        </button>

        {/* Product Image with Smooth Transition */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={isHovered ? hoverImage : primaryImage}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Quick View Floating Overlay Button */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all ${
                addedToCart
                  ? "bg-emerald-600 text-white"
                  : isOutOfStock
                  ? "bg-sand-300 text-charcoal-500 cursor-not-allowed"
                  : "bg-charcoal-900 text-white hover:bg-gold-700"
              }`}
            >
              {addedToCart ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Eklendi
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Sepete Ekle
                </>
              )}
            </button>
            <span
              className="w-9 h-9 rounded-lg bg-white/90 text-charcoal-700 flex items-center justify-center shadow-md hover:bg-white transition-colors"
              title="İncele"
            >
              <Eye className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Material */}
          <div className="flex items-center justify-between text-[11px] text-charcoal-400 mb-1">
            <span>{categoryName || "Takı"}</span>
            {material && <span>{material}</span>}
          </div>

          {/* Product Name */}
          <Link href={`/urun/${slug}`}>
            <h3 className="font-serif text-sm font-medium text-charcoal-900 group-hover:text-gold-700 line-clamp-1 transition-colors">
              {name}
            </h3>
          </Link>
        </div>

        {/* Price and Mobile Add Button */}
        <div className="mt-3 pt-2 border-t border-sand-100 flex items-center justify-between">
          <div className="flex flex-col">
            {hasDiscount ? (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-charcoal-900 text-sm">
                  {formatCurrency(salePrice)}
                </span>
                <span className="text-[11px] text-charcoal-400 line-through">
                  {formatCurrency(price)}
                </span>
              </div>
            ) : (
              <span className="font-semibold text-charcoal-900 text-sm">
                {formatCurrency(price)}
              </span>
            )}
          </div>

          {/* Mobile Direct Add Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="sm:hidden p-2 rounded-full bg-sand-100 hover:bg-gold-600 hover:text-white text-charcoal-800 transition-colors"
            aria-label="Sepete Ekle"
          >
            {addedToCart ? <Check className="w-4 h-4 text-emerald-600" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
