import React from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
import { ArrowRight, Sparkles, Diamond, ShieldCheck, HeartHandshake } from "lucide-react";

// Initial showcase data for premium jewelry
const initialProducts = [
  {
    id: "prod-1",
    name: "Işıltılı Baget Kesim Pırlanta Efektli Kolye",
    slug: "isiltili-baget-kesim-kolye",
    sku: "ZN-KLY-0001",
    categoryName: "Kolyeler",
    price: 1850,
    salePrice: 1490,
    stockQuantity: 15,
    material: "925 Ayar Gümüş / 14K Altın Kaplama",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
    ],
    isNew: true,
  },
  {
    id: "prod-2",
    name: "Zarif İnci Damla Sallantılı Küpe",
    slug: "zarif-inci-damla-kupe",
    sku: "ZN-KUP-0002",
    categoryName: "Küpeler",
    price: 950,
    salePrice: null,
    stockQuantity: 22,
    material: "Doğal Tatlı Su İncisi",
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    ],
    isNew: true,
  },
  {
    id: "prod-3",
    name: "Safir Mavi Zirkon Taşlı Ayarlanabilir Yüzük",
    slug: "safir-mavi-zirkon-yuzuk",
    sku: "ZN-YUZ-0003",
    categoryName: "Yüzükler",
    price: 1250,
    salePrice: 990,
    stockQuantity: 8,
    material: "925 Ayar Gümüş",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
    ],
    isNew: false,
  },
  {
    id: "prod-4",
    name: "Minimalist Burgu Zincir İtalyan Bileklik",
    slug: "minimalist-burgu-zincir-bileklik",
    sku: "ZN-BLK-0004",
    categoryName: "Bileklikler",
    price: 1400,
    salePrice: 1190,
    stockQuantity: 12,
    material: "14K Mikron Altın Kaplama",
    images: [
      "https://images.unsplash.com/photo-1611591475152-473523dd66c4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80",
    ],
    isNew: true,
  },
  {
    id: "prod-5",
    name: "Aura Koleksiyonu Kolye & Küpe Takı Seti",
    slug: "aura-kolye-kupe-taki-seti",
    sku: "ZN-SET-0005",
    categoryName: "Takı Setleri",
    price: 3200,
    salePrice: 2650,
    stockQuantity: 5,
    material: "925 Ayar Gümüş & Zirkon",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
    isNew: false,
  },
  {
    id: "prod-6",
    name: "Zümrüt Yeşili Baget Taşlı Halka Küpe",
    slug: "zumrut-yesili-baget-halka-kupe",
    sku: "ZN-KUP-0006",
    categoryName: "Küpeler",
    price: 1100,
    salePrice: null,
    stockQuantity: 18,
    material: "925 Ayar Gümüş",
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
    isNew: true,
  },
  {
    id: "prod-7",
    name: "Kuzey Yıldızı Madalyon Kolye",
    slug: "kuzey-yildizi-madalyon-kolye",
    sku: "ZN-KLY-0007",
    categoryName: "Kolyeler",
    price: 1650,
    salePrice: 1390,
    stockQuantity: 14,
    material: "14K Altın Kaplama",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611591475152-473523dd66c4?auto=format&fit=crop&w=800&q=80",
    ],
    isNew: false,
  },
  {
    id: "prod-8",
    name: "Geniş Bombeli Parlak Şövalye Yüzük",
    slug: "genis-bombeli-sovalye-yuzuk",
    sku: "ZN-YUZ-0008",
    categoryName: "Yüzükler",
    price: 1350,
    salePrice: 1150,
    stockQuantity: 9,
    material: "925 Ayar Gümüş",
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    ],
    isNew: false,
  },
];

const featuredCategories = [
  {
    name: "Kolyeler",
    slug: "kolyeler",
    desc: "Zarif zincirler ve göz alıcı madalyonlar",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Küpeler",
    slug: "kupeler",
    desc: "Halka, sallantılı ve inci küpe tasarımları",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Yüzükler",
    slug: "yuzukler",
    desc: "Ayarlanabilir ve tektaş tasarım yüzükler",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Bileklikler",
    slug: "bileklikler",
    desc: "Şık kelepçeler ve ince zincir bileklikler",
    image: "https://images.unsplash.com/photo-1611591475152-473523dd66c4?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Takı Setleri",
    slug: "taki-setleri",
    desc: "Özel günler ve hediyeler için uyumlu setler",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
  },
];

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-sand-100 via-sand-50 to-sand-100 border-b border-sand-200/80 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100/80 border border-gold-300 text-gold-900 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                2026 Yeni Koleksiyon
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-charcoal-950 tracking-tight leading-[1.15]">
                Işıltınızı Zarafetle <br />
                <span className="italic text-gold-700 font-light">Taçlandırın</span>
              </h1>

              <p className="text-sm sm:text-base text-charcoal-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
                ZeynepNova&apos;nın usta ellerde şekillenen 925 ayar gümüş ve altın kaplama tasarımlarıyla
                her anınıza kalıcı bir zarafet katın.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/kategori/yeni-gelenler"
                  className="w-full sm:w-auto h-12 px-8 rounded-full bg-charcoal-900 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-gold-700 transition-all shadow-md active:scale-95"
                >
                  Koleksiyonu Keşfet
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/kategori/cok-satanlar"
                  className="w-full sm:w-auto h-12 px-8 rounded-full border border-sand-300 bg-white/70 backdrop-blur-sm text-charcoal-800 font-medium text-sm flex items-center justify-center hover:bg-white hover:border-gold-500 transition-all"
                >
                  Çok Satanlar
                </Link>
              </div>

              {/* Highlights below buttons */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-sand-200/80 text-left">
                <div>
                  <div className="font-serif text-lg font-bold text-charcoal-900">925 Ayar</div>
                  <div className="text-[11px] text-charcoal-500">Gümüş & Altın Kaplama</div>
                </div>
                <div>
                  <div className="font-serif text-lg font-bold text-charcoal-900">%100</div>
                  <div className="text-[11px] text-charcoal-500">Güvenli Alışveriş</div>
                </div>
                <div>
                  <div className="font-serif text-lg font-bold text-charcoal-900">Hızlı</div>
                  <div className="text-[11px] text-charcoal-500">Sigortalı Gönderim</div>
                </div>
              </div>
            </div>

            {/* Hero Visual Collage */}
            <div className="relative flex justify-center items-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80"
                  alt="ZeynepNova Özel Tasarım Kolye"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-gold-300 font-medium">
                    Atölye Seçkisi
                  </span>
                  <h3 className="font-serif text-xl font-medium mt-1">Saf Zarafet, Kusursuz Detay</h3>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-4 sm:left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-sand-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-700">
                  <Diamond className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-charcoal-900">Özel Hediye Kutusu</p>
                  <p className="text-[10px] text-charcoal-500">Her siparişte zarif paketleme</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories Grid */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-700 font-sans">
              Kategorileri Keşfedin
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-medium mt-2">
              Stilinizin Tamamlayıcı Parçaları
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-2">
              Günlük şıklıktan özel davetlere kadar her anınıza eşlik edecek zarif tasarımlar.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-sand-200 shadow-soft hover:shadow-card transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent flex flex-col justify-end p-4 text-white">
                  <h3 className="font-serif text-base font-medium group-hover:text-gold-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-sand-200/80 line-clamp-1 mt-0.5">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Products Showcase: New & Trending */}
        <section className="py-16 bg-white border-y border-sand-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 pb-4 border-b border-sand-200">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
                  Öne Çıkan Ürünler
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-medium mt-1">
                  En Çok İlgi Gören Tasarımlar
                </h2>
              </div>
              <Link
                href="/kategori/yeni-gelenler"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-800 hover:text-gold-700 transition-colors mt-3 sm:mt-0"
              >
                Tümünü İncele <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {initialProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* Brand Philosophy & Story Banner */}
        <section className="py-20 bg-sand-100/70">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <span className="text-xs uppercase tracking-widest text-gold-700 font-semibold">
              ZeynepNova Felsefesi
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-medium leading-relaxed">
              &ldquo;Zarafet, göze çarpmak değil; akılda kalmaktır.&rdquo;
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
              ZeynepNova olarak her tasarımda zarafeti, inceliği ve kalıcı estetiği hedefliyoruz.
              Seçkin gümüş ve altın işçiliğimiz, tarzınıza sessiz ama etkileyici bir asalet katmak için tasarlandı.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 max-w-3xl mx-auto text-center">
              <div className="p-4 bg-white rounded-2xl border border-sand-200/80 shadow-soft">
                <Diamond className="w-6 h-6 text-gold-600 mx-auto mb-2" />
                <h3 className="font-serif font-medium text-sm text-charcoal-900">Seçkin Taşlar</h3>
                <p className="text-xs text-charcoal-500 mt-1">Işıltısını koruyan AAA kalite zirkon ve doğal inciler.</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-sand-200/80 shadow-soft">
                <ShieldCheck className="w-6 h-6 text-gold-600 mx-auto mb-2" />
                <h3 className="font-serif font-medium text-sm text-charcoal-900">Antialerjik Kaplama</h3>
                <p className="text-xs text-charcoal-500 mt-1">Cilde dost, nikel içermeyen koruyucu katman.</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-sand-200/80 shadow-soft">
                <HeartHandshake className="w-6 h-6 text-gold-600 mx-auto mb-2" />
                <h3 className="font-serif font-medium text-sm text-charcoal-900">Ömür Boyu Bakım</h3>
                <p className="text-xs text-charcoal-500 mt-1">Takılarınızın ışıltısını koruması için rehberlik ve destek.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
