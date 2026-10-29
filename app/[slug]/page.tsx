import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ChevronRight, AlertCircle, Shield } from "lucide-react";

interface StaticPageProps {
  params: Promise<{ slug: string }>;
}

const STATIC_PAGES: Record<
  string,
  {
    title: string;
    isLegal: boolean;
    content: string;
  }
> = {
  hakkimizda: {
    title: "Hakkımızda",
    isLegal: false,
    content: `
      <h2>Zarafetin ve İnce İşçiliğin Buluşma Noktası: ZeynepNova</h2>
      <p>ZeynepNova, modern kadınların zarafetini ve kendine özgü ışıltısını yansıtmak amacıyla kurulan bağımsız bir Türk takı markasıdır. Tasarımlarımızda geçmişin zamansız estetiğini, günümüzün minimalist ve modern çizgileriyle harmanlıyoruz.</p>
      <p>Koleksiyonlarımızdaki her bir parça; 925 ayar gümüş, 14K mikron altın kaplama ve özenle seçilmiş AAA kalite zirkon ile doğal tatlı su incileri kullanılarak usta ellerde titizlikle üretilir.</p>
      <h3>Felsefemiz</h3>
      <p>Bizim için takı yalnızca bir aksesuar değil; anılarınızı, duygularınızı ve kendinize verdiğiniz değeri taşıyan özel bir semboldür. Bu nedenle tüm ürünlerimizde antialerjik, nikel içermeyen ve uzun ömürlü koruyucu kaplamalar tercih ediyoruz.</p>
    `,
  },
  iletisim: {
    title: "İletişim & Müşteri Hizmetleri",
    isLegal: false,
    content: `
      <h2>Bizimle İletişime Geçin</h2>
      <p>Siparişleriniz, ürünlerimiz veya özel hediye taleplerinizle ilgili her türlü soru için destek ekibimiz size yardımcı olmaktan mutluluk duyacaktır.</p>
      <div style="background: #F5F2EB; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <p><strong>Müşteri Hizmetleri E-Posta:</strong> destek@zeynepnova.com</p>
        <p><strong>Telefon / WhatsApp Destek:</strong> +90 (212) 555 01 23</p>
        <p><strong>Çalışma Saatleri:</strong> Hafta içi 09:00 - 18:00 (Europe/Istanbul)</p>
        <p><strong>Atölye & Merkez Ofis:</strong> Nişantaşı, Abdi İpekçi Cad. No: 42, Şişli / İstanbul</p>
      </div>
    `,
  },
  "sikca-sorulan-sorular": {
    title: "Sıkça Sorulan Sorular",
    isLegal: false,
    content: `
      <h3>1. Ürünleriniz kararır mı?</h3>
      <p>Ürünlerimiz 925 ayar gümüş üzerine yüksek mikronlu altın veya rodyum koruyucu vernik kaplamalıdır. Kimyasal maddelerden (parfüm, deterjan, çamaşır suyu vb.) korunduğu sürece parlaklığını çok uzun yıllar korur.</p>
      <h3>2. Kargo ücreti ne kadar?</h3>
      <p>1.500 ₺ ve üzeri tüm siparişlerde kargo <strong>tamamen ücretsizdir</strong>. Bu tutarın altındaki siparişlerde standart sabit kargo bedeli 79,90 TL'dir.</p>
      <h3>3. Siparişim ne zaman kargoya verilir?</h3>
      <p>Hafta içi saat 14:00'e kadar verilen siparişler aynı gün veya en geç 1-2 iş günü içerisinde sigortalı olarak kargoya teslim edilir.</p>
      <h3>4. İade süresi kaç gündür?</h3>
      <p>Ürününüzü teslim aldığınız tarihten itibaren 14 gün içerisinde kullanılmamış ve orijinal hediye kutusunda olmak koşuluyla iade edebilirsiniz.</p>
    `,
  },
  "kargo-ve-teslimat": {
    title: "Kargo ve Teslimat Bilgileri",
    isLegal: false,
    content: `
      <h2>Sigortalı ve Özenli Gönderim</h2>
      <p>ZeynepNova'dan verilen tüm siparişler, taşıma esnasında oluşabilecek hasarlara karşı sigortalı olarak gönderilir. Tüm ürünlerimiz özel ZeynepNova hediye kutusunda ve darbeye dayanıklı korumalı ambalajlarda kargolanır.</p>
      <p>Siparişiniz kargoya verildiğinde SMS ve e-posta ile kargo takip numaranız iletilir.</p>
    `,
  },
  "iade-ve-degisim": {
    title: "İade ve Değişim Koşulları",
    isLegal: false,
    content: `
      <h2>14 Gün Koşulsuz İade Garantisi</h2>
      <p>6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında, siparişinizi teslim aldığınız tarihten itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin iade edebilirsiniz.</p>
      <p>İade talebinizi web sitemizdeki İade Talebi formundan veya destek@zeynepnova.com adresine yazarak başlatabilirsiniz.</p>
    `,
  },
  "mesafeli-satis-sozlesmesi": {
    title: "Mesafeli Satış Sözleşmesi (Taslak)",
    isLegal: true,
    content: `
      <h2>MADDE 1 - TARAFLAR</h2>
      <p><strong>SATICI:</strong> ZeynepNova Takı ve Mücevherat Ltd. Şti.<br>Adres: Nişantaşı, Abdi İpekçi Cad. No: 42, Şişli / İstanbul<br>E-posta: destek@zeynepnova.com | Mersis No: 0123456789000001</p>
      <p><strong>ALICI:</strong> Siparişi veren müşteri.</p>
      <h2>MADDE 2 - KONU</h2>
      <p>İşbu Sözleşme, ALICI'nın SATICI'ya ait www.zeynepnova.com internet sitesinden elektronik ortamda siparişini yaptığı ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini düzenler.</p>
      <h2>MADDE 3 - CAYMA HAKKI</h2>
      <p>ALICI, sözleşme konusu ürünün kendisine tesliminden itibaren 14 (ondört) gün içinde cayma hakkına sahiptir.</p>
    `,
  },
  "on-bilgilendirme-formu": {
    title: "Ön Bilgilendirme Formu (Taslak)",
    isLegal: true,
    content: `
      <h2>1. SATICI BİLGİLERİ</h2>
      <p>Unvanı: ZeynepNova Takı ve Mücevherat Ltd. Şti.<br>E-posta: destek@zeynepnova.com</p>
      <h2>2. SÖZLEŞME KONUSU ÜRÜN VE BEDEL</h2>
      <p>Ürünlerin cinsi, miktarı, KDV dahil satış bedeli ve kargo ücreti sipariş özetinde belirtildiği gibidir.</p>
    `,
  },
  "kvkk-aydinlatma-metni": {
    title: "KVKK Aydınlatma Metni (Taslak)",
    isLegal: true,
    content: `
      <h2>Kişisel Verilerin Korunması ve İşlenmesi</h2>
      <p>6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, ZeynepNova olarak veri sorumlusu sıfatıyla verilerinizin güvenliğine azami özen gösteriyoruz.</p>
      <p>Verileriniz siparişin ifası, faturalandırma ve yasal bildirimler kapsamında işlenmektedir.</p>
    `,
  },
  "gizlilik-politikasi": {
    title: "Gizlilik Politikası",
    isLegal: true,
    content: `
      <h2>Veri Güvenliği ve Gizlilik</h2>
      <p>ZeynepNova, kullanıcılarının kişisel bilgilerini gizli tutmayı taahhüt eder. Kredi kartı ve CVV numaraları sunucularımızda saklanmaz, işlemler 256-Bit SSL şifrelemeyle yürütülür.</p>
    `,
  },
  "cerez-politikasi": {
    title: "Çerez (Cookie) Politikası",
    isLegal: true,
    content: `
      <h2>Çerez Tercihleri</h2>
      <p>Sitemizde sepetinizi korumak ve güvenliğinizi sağlamak amacıyla zorunlu çerezler kullanılmaktadır.</p>
    `,
  },
};

export default async function StaticContentPage({ params }: StaticPageProps) {
  const { slug } = await params;
  const page = STATIC_PAGES[slug];

  if (!page) {
    notFound();
  }

  return (
    <>
      <AnnouncementBar />
      <Header />

      <main className="min-h-screen pb-20 bg-sand-50">
        <div className="bg-sand-100/70 border-b border-sand-200 py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-charcoal-400 mb-3" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-charcoal-800">
                Ana Sayfa
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-charcoal-300" />
              <span className="text-charcoal-800 font-medium">{page.title}</span>
            </nav>

            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-medium">
              {page.title}
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {page.isLegal && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Yasal Uyarı (Taslak Metin):</strong> Bu hukuki metin taslak olarak oluşturulmuştur.
                Canlı e-ticaret faaliyetine başlamadan önce şirketinizin resmi avukatı veya mali müşaviri
                tarafından güncel mevzuat ve ETBİS yükümlülüklerine göre incelenmesi gerekmektedir.
              </div>
            </div>
          )}

          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-sand-200 shadow-soft">
            <div
              className="prose prose-sm max-w-none text-charcoal-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
