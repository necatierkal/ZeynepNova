import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ProductDetailClient } from "@/components/features/products/ProductDetailClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.getProductBySlug(slug);

  if (!product) {
    return {
      title: "Ürün Bulunamadı | ZeynepNova",
    };
  }

  const effectivePrice = product.sale_price ?? product.price;

  return {
    title: `${product.name} | ZeynepNova`,
    description: product.short_description || product.description || "ZeynepNova özel tasarım takı modeli.",
    openGraph: {
      title: `${product.name} | ZeynepNova`,
      description: product.short_description || "",
      images: product.images && product.images.length > 0 ? [{ url: product.images[0] }] : [],
    },
    alternates: {
      canonical: `/urun/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await db.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products from the same category
  const allProducts = await db.getProducts({ categorySlug: undefined });
  const relatedProducts = allProducts.filter((p) => p.id !== product.id);

  // Structured Data (Schema.org JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.short_description || product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "ZeynepNova",
    },
    offers: {
      "@type": "Offer",
      url: `https://zeynepnova.com/urun/${product.slug}`,
      priceCurrency: "TRY",
      price: product.sale_price ?? product.price,
      availability: product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen pb-16">
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </>
  );
}
