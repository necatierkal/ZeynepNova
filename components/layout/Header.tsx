"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, X, Shield } from "lucide-react";

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // In later phases, cart and wishlist counts will connect to the reactive stores
  const cartItemCount = 0;
  const wishlistItemCount = 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/arama?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navCategories = [
    { name: "Kolyeler", href: "/kategori/kolyeler" },
    { name: "Küpeler", href: "/kategori/kupeler" },
    { name: "Yüzükler", href: "/kategori/yuzukler" },
    { name: "Bileklikler", href: "/kategori/bileklikler" },
    { name: "Takı Setleri", href: "/kategori/taki-setleri" },
    { name: "Yeni Gelenler", href: "/kategori/yeni-gelenler" },
    { name: "Çok Satanlar", href: "/kategori/cok-satanlar" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-sand-50/95 backdrop-blur-md border-b border-sand-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-charcoal-700 hover:text-charcoal-900 focus:outline-none"
              aria-label="Menüyü aç"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 ml-1 text-charcoal-700 hover:text-charcoal-900 lg:hidden"
              aria-label="Arama"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-initial text-center lg:text-left">
            <Link href="/" className="inline-block group focus:outline-none">
              <span className="font-serif text-2xl sm:text-3xl tracking-widest text-charcoal-950 uppercase font-medium">
                Zeynep<span className="text-gold-600 font-light">Nova</span>
              </span>
              <span className="block text-[9px] uppercase tracking-[0.3em] text-charcoal-400 font-sans -mt-1 text-center">
                Atelier & Jewelry
              </span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-10">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Kolye, küpe, yüzük veya taş ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-xs bg-white/80 border border-sand-300 rounded-full focus:bg-white focus:outline-none focus:border-gold-600 focus:ring-1 focus:ring-gold-500/30 placeholder:text-charcoal-400 transition-all"
              />
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Admin Direct Quick Access */}
            <Link
              href="/admin"
              className="p-2 text-charcoal-600 hover:text-gold-700 rounded-full hover:bg-sand-100 transition-colors"
              title="Yönetim Paneli"
              aria-label="Yönetim Paneli"
            >
              <Shield className="w-5 h-5" />
            </Link>

            {/* Account */}
            <Link
              href="/hesabim"
              className="p-2 text-charcoal-700 hover:text-charcoal-900 rounded-full hover:bg-sand-100 transition-colors"
              title="Hesabım"
              aria-label="Hesabım"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/favorilerim"
              className="p-2 text-charcoal-700 hover:text-charcoal-900 rounded-full hover:bg-sand-100 transition-colors relative"
              title="Favorilerim"
              aria-label="Favorilerim"
            >
              <Heart className="w-5 h-5" />
              {wishlistItemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-gold-600 text-white rounded-full flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/sepet"
              className="p-2 text-charcoal-700 hover:text-charcoal-900 rounded-full hover:bg-sand-100 transition-colors relative"
              title="Alışveriş Sepeti"
              aria-label="Alışveriş Sepeti"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 ? (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-charcoal-900 text-white rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              ) : (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold-500"></span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Input Collapse */}
        {searchOpen && (
          <div className="lg:hidden pb-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Ürün adı, SKU veya kategori ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-xs bg-white border border-sand-300 rounded-full focus:outline-none focus:border-gold-600"
                autoFocus
              />
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
          </div>
        )}

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center justify-center space-x-8 py-3 border-t border-sand-200/60 text-xs font-medium uppercase tracking-wider text-charcoal-700">
          {navCategories.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:text-gold-700 hover:border-b-2 hover:border-gold-600 pb-1 transition-all duration-150"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-sand-200 space-y-2">
            {navCategories.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-charcoal-800 rounded-md hover:bg-sand-100 hover:text-gold-700"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-sand-200 mt-2 flex flex-col space-y-2 px-3 text-xs text-charcoal-600">
              <Link href="/siparis-takip" onClick={() => setMobileMenuOpen(false)}>
                Sipariş Takibi
              </Link>
              <Link href="/iletisim" onClick={() => setMobileMenuOpen(false)}>
                İletişim & Destek
              </Link>
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-gold-700 font-semibold">
                Yönetici Paneli Girişi
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
