# ZeynepNova — Kurulum, Hosting ve Üretime Dağıtım (Deployment) Kılavuzu

Bu belge, ZeynepNova e-ticaret platformunun yerel geliştirme ortamında çalıştırılması, veritabanı migration süreçleri ve bulut sunucularına canlı dağıtım adımlarını açıklar.

---

## 1. Mimari ve Önerilen Hosting Sağlayıcıları

ZeynepNova sistemi; Next.js 15 SSR, dinamik API Route'ları, sunucu tarafı iyzico ödeme callback'leri ve PostgreSQL ilişkisel veritabanı kullandığı için aşağıdaki yönetilen bulut mimarisi önerilir:

### Önerilen Canlı Altyapı
1. **Uygulama Sunucusu (Frontend + Backend):** Vercel (Pro $20/ay veya Hobby $0) ya da Railway ($5/ay)
2. **Veritabanı:** Supabase Managed PostgreSQL (Ücretsiz Paket $0 veya Pro $25/ay)
3. **DNS & CDN:** Cloudflare (Ücretsiz SSL, DDoS koruması ve önbellekleme)
4. **E-Posta Servisi:** Resend / Brevo (Aylık 3.000 e-postaya kadar ücretsiz)

### Tahmini Aylık Başlangıç Maliyeti
| Servis | Sağlayıcı | Başlangıç / Düşük Trafik | Büyüme Dönemi |
|---|---|---|---|
| Next.js SSR & API | Vercel / Railway | 0 - 5 $ / ay | 20 $ / ay |
| PostgreSQL Veritabanı | Supabase | 0 $ / ay | 25 $ / ay |
| Dosya Depolama (Storage) | Supabase Storage | 0 $ (1GB dahil) | 5 $ / ay |
| E-Posta Gönderimi | Resend | 0 $ (3.000 e-posta/ay) | 20 $ / ay |
| SSL & DNS & WAF | Cloudflare | 0 $ / ay | 0 $ / ay |
| **TOPLAM TAHMİNİ MALİYET** | | **0 - 5 $ / ay (~170 - 200 TL)** | **~70 $ / ay** |

---

## 2. Yerel Kurulum Adımları (Local Development)

### Gereksinimler
- Node.js v20 veya üzeri (Sistemde v24.22.1 kuruludur)
- Git (Sistemde kuruludur)
- npm veya pnpm

### Adım 1: Depoyu Klonlayın ve Bağımlılıkları Yükleyin
```bash
git clone <repo-url>
cd ZeynepNova
npm install
```

### Adım 2: Ortam Değişkenlerini Tanımlayın
```bash
cp .env.example .env.local
```
`.env.local` dosyasını açıp ilgili değerleri yapılandırın.

### Adım 3: Veritabanı Migration ve Başlangıç Verilerini Çalıştırın
```bash
# PostgreSQL şemasını ve RLS politikalarını uygular
npm run db:migrate

# Başlangıç kategorilerini, örnek ürünleri ve ayarları yükler
npm run db:seed
```

### Adım 4: Testleri Çalıştırın
```bash
# Tüm birim ve entegrasyon testlerini çalıştırır
npm run test

# TypeScript tip denetimi yapar
npm run type-check
```

### Adım 5: Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Tarayıcınızda `http://localhost:3000` adresine giderek mağazayı, `http://localhost:3000/admin` adresine giderek yönetim panelini kullanabilirsiniz.

---

## 3. Üretime Dağıtım (Production Deployment - Vercel / Railway)

### Vercel ile Otomatik Dağıtım (Önerilen)
1. GitHub veya GitLab deponuza projeyi push edin.
2. [Vercel](https://vercel.com) paneline giriş yapıp **"Add New Project"** seçeneğini tıklayın.
3. `ZeynepNova` deposunu seçin.
4. **Environment Variables** bölümüne `.env.example` içindeki tüm değişkenleri canlı değerleriyle girin:
   - `DATABASE_URL`: Supabase Connection Pooler bağlantı dizesi
   - `IYZICO_BASE_URL`: `https://api.iyzipay.com`
   - `IYZICO_API_KEY`: Canlı iyzico API anahtarı
   - `IYZICO_SECRET_KEY`: Canlı iyzico Gizli anahtarı
   - `IYZICO_CALLBACK_URL`: `https://zeynepnova.com/api/payments/iyzico/callback`
   - `NEXT_PUBLIC_SITE_URL`: `https://zeynepnova.com`
5. **Deploy** butonuna tıklayın.

---

## 4. Canlı iyzico Ödeme Geçiş Kontrol Listesi
- [ ] iyzico panelinden **Canlı Mod** onayının alındığından emin olun.
- [ ] `IYZICO_BASE_URL` değişkeninin `https://api.iyzipay.com` olduğundan emin olun.
- [ ] Gerçek bir kredi kartı ile 1 TL'lik canlı test siparişi verin.
- [ ] Ödeme onayından sonra siparişin yönetim panelinde `paid` (Ödendi) durumuna geçtiğini ve stok miktarının 1 düştüğünü doğrulayın.
- [ ] iyzico panelinden bu test siparişinin iadesini gerçekleştirip sistemde iade akışını teyit edin.

---

## 5. Veritabanı Yedekleme ve Geri Yükleme Prosedürü

### Otomatik Günlük Yedekler
Supabase kullanılıyorsa, veritabanı her gün UTC 00:00'da otomatik olarak yedeklenir. 

### Manuel Yedek Alma (pg_dump)
```bash
pg_dump "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" -F c -b -v -f "zeynepnova_backup_$(date +%Y%m%d).dump"
```

### Yedekten Geri Yükleme (pg_restore)
```bash
pg_restore -v -d "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" "zeynepnova_backup_20261029.dump"
```

---

## 6. Geri Alma (Rollback) Prosedürü
Canlıya alınan yeni bir kod sürümünde beklenmeyen bir hata oluşursa:
1. **Vercel Paneli:** **Deployments** sekmesine gidin.
2. Önceki çalışan başarılı derlemenin sağındaki **"..."** menüsünden **"Promote to Production"** seçeneğini tıklayın.
3. Sistem kesintisiz olarak 5 saniye içinde önceki kararlı sürüme geri döner.
