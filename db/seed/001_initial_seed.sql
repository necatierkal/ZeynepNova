-- ============================================================================
-- ZEYNEPNOVA BAŞLANGIÇ VERİLERİ (SEED)
-- Versiyon: 1.0.0
-- ============================================================================

-- 1. KATEGORİLER
INSERT INTO categories (id, name, slug, description, display_order, is_active) VALUES
('c0000001-0000-0000-0000-000000000001', 'Kolyeler', 'kolyeler', '925 ayar gümüş ve altın kaplama zarif kolye modelleri.', 1, TRUE),
('c0000002-0000-0000-0000-000000000002', 'Küpeler', 'kupeler', 'Halka, sallantılı, inci ve baget kesim küpe tasarımları.', 2, TRUE),
('c0000003-0000-0000-0000-000000000003', 'Yüzükler', 'yuzukler', 'Zarif tektaşlar, ayarlanabilir yüzükler ve şövalye modelleri.', 3, TRUE),
('c0000004-0000-0000-0000-000000000004', 'Bileklikler', 'bileklikler', 'İtalyan ezme zincirler, kelepçeler ve su yolu bileklikler.', 4, TRUE),
('c0000005-0000-0000-0000-000000000005', 'Takı Setleri', 'taki-setleri', 'Özel günler ve hediyeler için uyumlu kolye ve küpe setleri.', 5, TRUE),
('c0000006-0000-0000-0000-000000000006', 'Aksesuarlar', 'aksesuarlar', 'Takı kutuları, parlatma bezleri ve hediye setleri.', 6, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- 2. KATEGORİ ÖZELLİK ŞABLONLARI (Filtreler için)
INSERT INTO category_attributes (category_id, attribute_name, attribute_code, input_type, options, is_filterable, is_required) VALUES
('c0000001-0000-0000-0000-000000000001', 'Materyal', 'material', 'select', '["925 Ayar Gümüş", "14K Altın Kaplama", "Rose Gold Kaplama", "Çelik"]'::jsonb, TRUE, TRUE),
('c0000001-0000-0000-0000-000000000001', 'Taş Tipi', 'stone_type', 'select', '["Zirkon", "Doğal İnci", "Safir Efektli", "Zümrüt Efektli", "Taşsız"]'::jsonb, TRUE, FALSE),
('c0000001-0000-0000-0000-000000000001', 'Zincir Uzunluğu', 'chain_length', 'select', '["40 cm", "45 cm", "50 cm", "60 cm", "Ayarlanabilir"]'::jsonb, TRUE, FALSE),
('c0000003-0000-0000-0000-000000000003', 'Yüzük Ölçüsü', 'ring_size', 'select', '["Ayarlanabilir", "11", "12", "13", "14", "15", "16", "17", "18"]'::jsonb, TRUE, TRUE);

-- 3. ROL VE YETKİ TABLOSU
INSERT INTO role_permissions (role, permission, description) VALUES
('SuperAdmin', '*', 'Tüm sistem yetkileri'),
('StoreAdmin', 'store.*', 'Mağaza ayarları, ürünler, siparişler ve içerik yönetimi'),
('ProductManager', 'products.*', 'Ürün ekleme, düzenleme, CSV içe aktarma, fiyat ve stok yönetimi'),
('ProductManager', 'categories.*', 'Kategori ekleme ve düzenleme'),
('OrderManager', 'orders.*', 'Sipariş durumları, kargo atama ve fatura kontrolü'),
('OrderManager', 'returns.*', 'İade inceleme ve onay'),
('ContentEditor', 'content.*', 'Banner, duyuru, statik sayfalar ve CMS yönetimi'),
('SupportAgent', 'customers.view', 'Müşteri bilgileri ve sipariş geçmişi görüntüleme'),
('SupportAgent', 'reviews.moderate', 'Yorumları inceleme ve onaylama'),
('ReadOnlyAnalyst', 'reports.view', 'Yalnızca satış ve envanter raporlarını okuma')
ON CONFLICT DO NOTHING;

-- 4. MAĞAZA AYARLARI
INSERT INTO store_settings (
    id, site_name, support_email, support_phone,
    company_legal_name, company_address,
    free_shipping_threshold, standard_shipping_fee,
    currency, timezone, iyzico_test_mode
) VALUES (
    's0000001-0000-0000-0000-000000000001',
    'ZeynepNova',
    'destek@zeynepnova.com',
    '+90 (212) 555 01 23',
    'ZeynepNova Takı ve Mücevherat Ltd. Şti.',
    'Nişantaşı, Abdi İpekçi Cad. No: 42, Şişli / İstanbul',
    1500.00,
    79.90,
    'TRY',
    'Europe/Istanbul',
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- 5. KUPONLAR
INSERT INTO coupons (code, discount_type, discount_value, min_cart_amount, usage_limit, is_active, free_shipping) VALUES
('ZEYNEP10', 'percentage', 10.00, 500.00, 1000, TRUE, FALSE),
('HOSGELDIN150', 'fixed_amount', 150.00, 1200.00, 500, TRUE, FALSE),
('KARGO', 'fixed_amount', 79.90, 500.00, 1000, TRUE, TRUE)
ON CONFLICT (code) DO NOTHING;

-- 6. ÖRNEK NUMUNE ÜRÜNLER (Gerçek takı verileriyle)
INSERT INTO products (
    id, category_id, sku, name, slug, short_description, description,
    price, sale_price, cost_price, stock_quantity, critical_stock_threshold,
    is_active, is_featured, is_new, material, stone_type, color
) VALUES
(
    'p0000001-0000-0000-0000-000000000001',
    'c0000001-0000-0000-0000-000000000001',
    'ZN-KLY-0001',
    'Işıltılı Baget Kesim Pırlanta Efektli Kolye',
    'isiltili-baget-kesim-kolye',
    'Zarif baget zirkon taşlı, 925 ayar gümüş ve 14K mikron altın kaplama özel tasarım kolye.',
    'Her detayı özenle tasarlanan bu kolye, zarif geometrik kesimiyle boynunuzda büyüleyici bir ışıltı yaratır. Antialerjiktir, nikel içermez.',
    1850.00, 1490.00, 650.00, 15, 3,
    TRUE, TRUE, TRUE, '925 Ayar Gümüş / 14K Altın Kaplama', 'Baget Zirkon', 'Altın'
),
(
    'p0000002-0000-0000-0000-000000000002',
    'c0000002-0000-0000-0000-000000000002',
    'ZN-KUP-0002',
    'Zarif İnci Damla Sallantılı Küpe',
    'zarif-inci-damla-kupe',
    'Doğal tatlı su incisi ile süslenmiş, hafif ve konforlu sallantılı küpe.',
    'Günlük kullanımdan özel akşamlara kadar tarzınızı asil bir dokunuşla tamamlar. 925 ayar gümüş klipsiyle hassas kulaklar için idealdir.',
    950.00, NULL, 380.00, 22, 5,
    TRUE, TRUE, TRUE, 'Doğal Tatlı Su İncisi / 925 Gümüş', 'İnci', 'Beyaz & Gümüş'
),
(
    'p0000003-0000-0000-0000-000000000003',
    'c0000003-0000-0000-0000-000000000003',
    'ZN-YUZ-0003',
    'Safir Mavi Zirkon Taşlı Ayarlanabilir Yüzük',
    'safir-mavi-zirkon-yuzuk',
    'Kraliyet mavisi safir efektli merkezi taş ve etrafını saran mikro zirkon detaylar.',
    'Her parmak ölçüsüne uygun ayarlanabilir halka tasarımı. Sevdikleriniz için harika bir hediye seçeneği.',
    1250.00, 990.00, 480.00, 8, 2,
    TRUE, TRUE, FALSE, '925 Ayar Gümüş', 'Safir Efektli Zirkon', 'Safir Mavi'
),
(
    'p0000004-0000-0000-0000-000000000004',
    'c0000004-0000-0000-0000-000000000004',
    'ZN-BLK-0004',
    'Minimalist Burgu Zincir İtalyan Bileklik',
    'minimalist-burgu-zincir-bileklik',
    'İtalyan ezme burgu örgü tekniğiyle üretilmiş, pürüzsüz dokulu 14K mikron altın kaplama bileklik.',
    'Tek başına ya da diğer bilekliklerle kombinlenerek kullanılabilir. Kararmaya karşı güçlendirilmiş vernik kaplamalıdır.',
    1400.00, 1190.00, 520.00, 12, 3,
    TRUE, TRUE, TRUE, '14K Mikron Altın Kaplama', 'Taşsız', 'Sarı Altın'
),
(
    'p0000005-0000-0000-0000-000000000005',
    'c0000005-0000-0000-0000-000000000005',
    'ZN-SET-0005',
    'Aura Koleksiyonu Kolye & Küpe Takı Seti',
    'aura-kolye-kupe-taki-seti',
    'Uyumlu baget zirkon kolye ve halka küpeden oluşan lüks hediye seti.',
    'Zarif kadife kutusunda, sertifikası ve temizleme beziyle birlikte sunulur.',
    3200.00, 2650.00, 1100.00, 5, 2,
    TRUE, TRUE, FALSE, '925 Ayar Gümüş & Zirkon', 'Zirkon', 'Gümüş'
)
ON CONFLICT (sku) DO NOTHING;

-- 7. ÜRÜN GÖRSELLERİ
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES
('p0000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', 'Işıltılı Baget Kesim Pırlanta Efektli Kolye Ana Görsel', 1, TRUE),
('p0000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80', 'Işıltılı Baget Kesim Kolye Boyunda Duruş', 2, FALSE),
('p0000002-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80', 'Zarif İnci Damla Sallantılı Küpe Ana Görsel', 1, TRUE),
('p0000003-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', 'Safir Mavi Zirkon Taşlı Yüzük Ana Görsel', 1, TRUE),
('p0000004-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1611591475152-473523dd66c4?auto=format&fit=crop&w=800&q=80', 'Minimalist Burgu Zincir İtalyan Bileklik Ana Görsel', 1, TRUE),
('p0000005-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', 'Aura Koleksiyonu Takı Seti Ana Görsel', 1, TRUE)
ON CONFLICT DO NOTHING;

-- 8. İÇERİK SAYFALARI (Hukuki Metin Taslakları)
INSERT INTO pages (slug, title, content, meta_title, meta_description, is_published) VALUES
(
    'mesafeli-satis-sozlesmesi',
    'Mesafeli Satış Sözleşmesi',
    '<h1>MESAFELİ SATIŞ SÖZLEŞMESİ (TASLAK)</h1><p><strong>MADDE 1 - TARAFLAR</strong></p><p><strong>SATICI:</strong><br>Unvanı: ZeynepNova Takı ve Mücevherat Ltd. Şti.<br>Adres: Nişantaşı, Abdi İpekçi Cad. No: 42, Şişli / İstanbul<br>E-posta: destek@zeynepnova.com<br>Mersis No: 0123456789000001</p><p><strong>ALICI (TÜKETİCİ):</strong> Sipariş formunda belirtilen müşteri.</p><p><strong>MADDE 2 - SÖZLEŞMENİN KONUSU</strong><br>İşbu Sözleşme, ALICI''nın SATICI''ya ait internet sitesi üzerinden elektronik ortamda siparişini verdiği ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini düzenler.</p><p><strong>MADDE 3 - CAYMA HAKKI</strong><br>ALICI, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren 14 (ondört) gün içinde herhangi bir gerekçe göstermeksizin cayma hakkına sahiptir.</p>',
    'Mesafeli Satış Sözleşmesi | ZeynepNova',
    'ZeynepNova internet sitesi üzerinden yapılan alışverişlerde geçerli mesafeli satış sözleşmesi şartları.',
    TRUE
),
(
    'on-bilgilendirme-formu',
    'Ön Bilgilendirme Formu',
    '<h1>ÖN BİLGİLENDİRME FORMU (TASLAK)</h1><p>İşbu form, Mesafeli Sözleşmeler Yönetmeliği uyarınca tüketicinin sipariş onayından önce bilgilendirilmesi amacıyla hazırlanmıştır.</p><p>1. Satıcı bilgileri: ZeynepNova Takı ve Mücevherat Ltd. Şti.<br>2. Ürünlerin temel özellikleri ve tüm vergiler dahil toplam satış fiyatı sipariş özetinde belirtildiği gibidir.<br>3. Kargo ücreti 1.500 TL altındaki siparişlerde standart 79,90 TL''dir.<br>4. Cayma hakkı süresi 14 gündür.</p>',
    'Ön Bilgilendirme Formu | ZeynepNova',
    'ZeynepNova alışveriş öncesi yasal ön bilgilendirme formu.',
    TRUE
),
(
    'kvkk-aydinlatma-metni',
    'KVKK Aydınlatma Metni',
    '<h1>KİŞİSEL VERİLERİN KORUNMASI AYDINLATMA METNİ (TASLAK)</h1><p>ZeynepNova olarak 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, veri sorumlusu sıfatıyla kişisel verilerinizin güvenliğine en üst düzeyde önem veriyoruz.</p><p>İşlenen verileriniz; siparişlerin teslimi, faturalandırma, yasal bildirimler ve açık rızanız bulunması halinde ticari elektronik ileti gönderimi amaçlarıyla sınırlı olarak işlenmektedir.</p>',
    'KVKK Aydınlatma Metni | ZeynepNova',
    'ZeynepNova Kişisel Verilerin Korunması ve İşlenmesi Aydınlatma Metni.',
    TRUE
),
(
    'gizlilik-politikasi',
    'Gizlilik Politikası',
    '<h1>GİZLİLİK POLİTİKASI (TASLAK)</h1><p>ZeynepNova, kullanıcılarının gizliliğini korumayı taahhüt eder. Kredi kartı ve CVV bilgileriniz sistemlerimizde kesinlikle saklanmaz, tüm işlemler 256-bit SSL ve iyzico güvenli ödeme altyapısıyla şifrelenir.</p>',
    'Gizlilik Politikası | ZeynepNova',
    'ZeynepNova gizlilik ve veri güvenliği politikası.',
    TRUE
),
(
    'cerez-politikasi',
    'Çerez (Cookie) Politikası',
    '<h1>ÇEREZ POLİTİKASI (TASLAK)</h1><p>Web sitemizde alışveriş deneyiminizi iyileştirmek, sepetinizi korumak ve güvenliğinizi sağlamak amacıyla zorunlu ve analitik çerezler kullanılmaktadır.</p>',
    'Çerez Politikası | ZeynepNova',
    'ZeynepNova çerez tercihleri ve politikası.',
    TRUE
)
ON CONFLICT (slug) DO NOTHING;
