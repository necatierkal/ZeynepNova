import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FileSpreadsheet,
  ShoppingCart,
  Boxes,
  TicketPercent,
  RotateCcw,
  BarChart3,
  Settings,
  Shield,
  ExternalLink,
  PlusCircle,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: "Genel Bakış", href: "/admin", icon: LayoutDashboard },
    { name: "Ürün Yönetimi", href: "/admin/urunler", icon: Package },
    { name: "Yeni Ürün Sihirbazı", href: "/admin/urunler/yeni", icon: PlusCircle },
    { name: "Excel/CSV İçe Aktar", href: "/admin/urunler/ice-aktar", icon: FileSpreadsheet },
    { name: "Siparişler", href: "/admin/siparisler", icon: ShoppingCart },
    { name: "Stok & Envanter", href: "/admin/stok", icon: Boxes },
    { name: "Kupon & İndirimler", href: "/admin/kuponlar", icon: TicketPercent },
    { name: "İade Talepleri", href: "/admin/iadeler", icon: RotateCcw },
    { name: "Raporlar & Analitik", href: "/admin/raporlar", icon: BarChart3 },
    { name: "Mağaza Ayarları", href: "/admin/ayarlar", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-sand-100/60 flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <aside className="w-full md:w-64 bg-charcoal-950 text-white flex-shrink-0 flex flex-col justify-between border-r border-charcoal-800">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-charcoal-800 flex items-center justify-between">
            <Link href="/admin" className="block">
              <span className="font-serif text-xl tracking-widest text-white uppercase font-medium">
                Zeynep<span className="text-gold-500 font-light">Nova</span>
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-charcoal-400 font-sans mt-0.5">
                Yönetici Paneli
              </span>
            </Link>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Sistem Aktif" />
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-charcoal-300 hover:text-white hover:bg-charcoal-850 hover:bg-charcoal-900 transition-colors"
                >
                  <Icon className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Store Link */}
        <div className="p-4 border-t border-charcoal-800 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-charcoal-300 hover:text-white bg-charcoal-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-gold-500" /> Mağazayı Görüntüle
            </span>
            <span className="text-[10px] text-charcoal-500 font-mono">↗</span>
          </Link>

          <div className="px-3.5 py-2 bg-charcoal-900 rounded-xl flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gold-600 text-white flex items-center justify-center font-bold text-xs">
              ZN
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate">SuperAdmin</p>
              <p className="text-[10px] text-charcoal-400 truncate">admin@zeynepnova.com</p>
            </div>
            <Shield className="w-4 h-4 text-gold-500" />
          </div>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 min-w-0 p-6 sm:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
