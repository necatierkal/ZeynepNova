# ZeynepNova — Premium Takı E-Ticaret Platformu

ZeynepNova, Türkiye pazarında satış yapacak, modern, zarif, güvenli, mobil uyumlu ve uçtan uca çalışan profesyonel bir takı e-ticaret platformudur.

Bu proje; yalnızca bir tasarım prototipi değil; gerçek ürünlerin listelendiği, sepete ekleme ve satın alma süreçlerinin sunucu tarafında doğrulandığı, iyzico güvenli ödeme altyapısıyla entegre, sipariş ve stokların yönetildiği, Excel/CSV ile toplu ürün aktarımının yapılabildiği **üretime hazır** tam kapsamlı bir sistemdir.

---

## 💎 Temel Özellikler

- **Müşteri Mağazası:**
  - Kırık beyaz, açık bej ve ölçülü altın tonlarıyla ZeynepNova'ya özgü premium tasarım dili.
  - Hiyerarşik kategoriler: Kolyeler, Küpeler, Yüzükler, Bileklikler, Takı Setleri, Aksesuarlar.
  - Dinamik filtreleme: Materyal (925 Ayar Gümüş, 14K Altın Kaplama), Taş Tipi (Zirkon, Doğal İnci, Safir), Fiyat Aralığı ve Stok durumu.
  - Türkçe uyumlu hızlı arama ve popüler etiketler.
  - Çoklu fotoğraflı ürün galerisi, varyant seçimi, bakım talimatları, paket içeriği.
  - Güvenli sepet, kupon kodu motoru (% indirim veya sabit tutar) ve 1.500 ₺ üzeri ücretsiz kargo baremi.
  - Misafir alışverişi veya üyelikli alışveriş desteği.
  - Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu onay adımları.
  - Gerçek zamanlı sipariş ve kargo takip ekranı (`/siparis-takip`).

- **Yönetici Paneli (`/admin`):**
  - **Genel Bakış Dashboard:** Toplam ciro, sipariş durumları (hazırlanacak, kargoda, teslim edilen), kritik stok uyarıları, sistem entegrasyon sağlık durumu.
  - **9 Adımlı Kolay Ürün Sihirbazı:** Otomatik SKU üretimi, kategori seçimi, fiyat/maliyet girişi, varyantlar, fotoğraflar ve SEO başlıkları ile adım adım ürün ekleme.
  - **Excel / CSV Toplu Ürün Aktarımı:** Şablon indirme, dosya ön izleme, Zod veri doğrulaması, hatalı satırları açıkça listeleme ve içe aktarma stratejisi (`create_and_update`, `update_only`, `create_only`).
  - **Sipariş Yönetimi:** Sipariş durumlarını güncelleme (hazırlanıyor, kargoya verildi), kargo takip numarası atama ve CSV dışa aktarma.
  - **Stok Takibi:** Kritik seviyeye inen ürünler ve biten stokların anlık raporu.
  - **Kupon Yönetimi:** Yüzdesel veya sabit tutarlı kupon tanımlama ve kullanım limitleri.
  - **İade Talepleri:** Müşteri cayma hakkı taleplerini inceleme ve onay/ret süreci.
  - **Mağaza Ayarları:** Şirket resmi unvanı, MERSİS no, kargo baremleri ve iyzico ortam ayarları.

- **Güvenlik & Güvenilirlik:**
  - iyzico Checkout Form ile 256-bit SSL ödeme altyapısı (Sandbox ve Canlı mod desteği).
  - Sunucu tarafında fiyat ve stok kontrolü (tarayıcıdan gelen sahte fiyatlara izin verilmez).
  - Çift ödeme bildirimlerini engelleyen **Idempotency** kontrolü.
  - Kredi kartı ve CVV numaraları sunucuda asla saklanmaz.
  - Rate Limiting ile sipariş ve form doldurma spam koruması.
  - E-posta Outbox deseni: E-posta servis hataları sipariş akışını asla kesintiye uğratmaz.

---

## 🚀 Hızlı Başlangıç (1 Dakikada Çalıştırma)

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Ortam Değişkenlerini Hazırlayın
Projeyle birlikte gelen `.env.local` dosyası yerel testler için hazır durumdadır. İncelemek isterseniz:
```bash
cp .env.example .env.local
```

### 3. Testleri Çalıştırın
```bash
npm run test
```
Tüm 25 birim ve entegrasyon testi otomatik olarak çalışır ve doğrulanır.

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Tarayıcınızda açın:
- 🛍️ **Müşteri Mağazası:** [http://localhost:3000](http://localhost:3000)
- 🛡️ **Yönetici Paneli:** [http://localhost:3000/admin](http://localhost:3000/admin)
- 📦 **Sipariş Takibi:** [http://localhost:3000/siparis-takip](http://localhost:3000/siparis-takip)
- 📑 **Excel/CSV Aktarımı:** [http://localhost:3000/admin/urunler/ice-aktar](http://localhost:3000/admin/urunler/ice-aktar)

---

## 📁 Proje Klasör Mimarisi

```
ZeynepNova/
├── app/                      # Next.js 15 App Router Sayfaları ve API Rotaları
│   ├── (storefront)/         # Ana sayfa, kategoriler, ürün detay, sepet, checkout
│   ├── admin/                # Yönetici Paneli (Dashboard, Sihirbaz, İçe Aktar, Siparişler vb.)
│   └── api/                  # Checkout, iyzico Callback, Newsletter API'leri
├── components/               # Yeniden kullanılabilir UI, Layout ve Header/Footer bileşenleri
├── features/                 # Modüler İş Mantığı Katmanı
│   ├── products/             # Ürün yönetimi, 9 adımlı sihirbaz ve Excel/CSV motoru
│   ├── cart/                 # Sunucu doğrulamalı sepet hesaplama servisi
│   ├── checkout/             # Sipariş oluşturma ve ödeme başlatma orkestratörü
│   ├── orders/               # Sipariş yaşam döngüsü ve kargo takibi
│   └── promotions/           # Kupon ve indirim hesaplama motoru
├── lib/                      # Altyapı ve Servis Adaptörleri
│   ├── auth/                 # RBAC yetkilendirme (7 Yönetici Rolü)
│   ├── db/                   # PostgreSQL bağlantısı ve dayanıklı veri repository'si
│   ├── payments/             # iyzico Checkout Form, HMAC-SHA256 ve Callback doğrulayıcı
│   ├── email/                # Lüks HTML e-posta şablonları ve Outbox kuyruğu
│   ├── storage/              # Görsel doğrulama (MIME, boyut) ve depolama
│   ├── security/             # Rate limit, XSS sanitizasyonu ve Audit log
│   └── validation/           # Zod şemaları (ürün, sepet, adres, CSV satırları)
├── db/
│   ├── migrations/           # 38 Tablolu PostgreSQL DDL, RLS ve Tetikleyici SQL dosyaları
│   └── seed/                 # Başlangıç takı ürünleri, kategoriler ve mağaza ayarları
├── tests/                    # Vitest Birim ve Entegrasyon Testleri
│   ├── unit/                 # Fiyat, kupon, SKU, slug ve CSV aktarım testleri
│   └── integration/          # iyzico ödeme başlatma ve callback testleri
└── docs/                     # Belgeler
    ├── DEPLOYMENT.md         # Bulut hosting, Vercel/Supabase dağıtımı ve yedekleme kılavuzu
    └── LEGAL_LAUNCH_CHECKLIST.md # Türkiye ETBİS, KVKK ve Mesafeli Satış yasal kontrol listesi
```

---

## 🗄️ Veritabanı Şeması ve Migration İşlemleri

Proje, 38 tablodan oluşan tam kapsamlı bir ilişkisel PostgreSQL şemasına sahiptir (`db/migrations/001_initial_schema.sql`).

Canlı bir PostgreSQL veya Supabase veritabanına bağlanmak için:
```bash
# 1. .env dosyanıza DATABASE_URL ekleyin:
# DATABASE_URL=postgresql://postgres:[SIFRE]@[HOST]:5432/postgres

# 2. Migration'ları uygulayın:
npm run db:migrate

# 3. Başlangıç verilerini yükleyin:
npm run db:seed
```

---

## 🛡️ Yönetici Rolleri ve Yetkiler (RBAC)

Sistemde sunucu tarafında denetlenen 7 farklı yönetici rolü bulunur:
1. **SuperAdmin:** Tüm sisteme, ayarlara ve denetim kayıtlarına sınırsız erişim.
2. **StoreAdmin:** Mağaza operasyonları, ürünler, siparişler ve içerik yönetimi.
3. **ProductManager:** Ürün ekleme, düzenleme, Excel/CSV içe aktarma, fiyat ve stok yönetimi.
4. **OrderManager:** Siparişler, kargo takip numarası atama ve iade inceleme.
5. **ContentEditor:** Bannerlar, duyuru metinleri ve CMS içerik sayfaları.
6. **SupportAgent:** Müşteri sipariş geçmişi ve ürün yorumlarını onaylama.
7. **ReadOnlyAnalyst:** Yalnızca satış ve envanter raporlarını görüntüleme.

---

## 📜 Lisans & Telif Hakkı

© 2026 ZeynepNova Atelier & Jewelry. Tüm hakları saklıdır.
