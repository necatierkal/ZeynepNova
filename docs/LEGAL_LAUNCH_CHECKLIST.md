# ZeynepNova — Türkiye E-Ticaret Hukuki ve Ticari Canlıya Geçiş Kontrol Listesi

Bu belge, ZeynepNova takı markasının Türkiye'de 6502 sayılı Tüketicinin Korunması Hakkında Kanun, Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ve KVKK mevzuatına tam uyumlu olarak canlı satışa başlamadan önce tamamlaması gereken adımları içerir.

---

## 1. ETBİS (Elektronik Ticaret Bilgi Sistemi) Kaydı
- [ ] **Kayıt ve Bildirim:** Ticaret Bakanlığı ETBİS sistemine (etbis.eticaret.gov.tr) e-Devlet üzerinden kayıt yapılmalı.
- [ ] **Kayıtlı Bilgiler:** Alan adı (`zeynepnova.com`), vergi kimlik numarası, MERSİS numarası, KEP adresi ve banka hesap bilgileri sisteme işlenmeli.
- [ ] **ETBİS Karekodu:** Bakanlıktan alınan ETBİS QR kodu mağaza footer alanına yerleştirilmeli.

---

## 2. Şirket ve Fatura Bilgileri
- [ ] **Yasal Unvan:** Vergi levhasındaki şirket unvanı site ayarlarında doğrulanmalı.
- [ ] **MERSİS ve Vergi No:** Tüm mesafeli satış sözleşmelerinde ve e-fatura entegrasyonlarında doğru görünmeli.
- [ ] **E-Arşiv / E-Fatura Entegrasyonu:** Her siparişte otomatik e-arşiv fatura kesilmesi için muhasebe yazılımı (Paraşüt, KolayBi, Mikro vb.) bağlantısı kurulmalı.

---

## 3. Tüketici Hakları ve Zorunlu Yasal Metinler
Sistemde hazır taslak olarak bulunan şu sayfalar şirketinizin mali müşaviri veya hukuk danışmanı ile son kontrolden geçirilmelidir:
- [ ] **Ön Bilgilendirme Formu:** Satıcı iletişim, ürün bedeli, kargo ve cayma hakkı detayları doğrulanmalı.
- [ ] **Mesafeli Satış Sözleşmesi:** Sipariş öncesinde müşteriye onaylatılan metin güncel yönetmeliğe göre teyit edilmeli.
- [ ] **14 Gün Cayma Hakkı Bilgilendirmesi:** Hijyen kuralları hariç (küpelerde ambalajı açılmamış olma kuralı gibi) 14 gün iade süreci şeffaf biçimde belirtilmeli.
- [ ] **Gizlilik ve Güvenlik Politikası:** 256-bit SSL ve iyzico güvenli ödeme açıklaması yer almalı.
- [ ] **Çerez (Cookie) Aydınlatma Metni:** Zorunlu ve analitik çerezler açıklanmalı.

---

## 4. KVKK (Kişisel Verilerin Korunması Kanunu)
- [ ] **Aydınlatma Yükümlülüğü:** Müşterilerin sipariş verirken okuyabileceği KVKK Aydınlatma Metni yayında olmalı.
- [ ] **Açık Rıza:** Pazarlama, SMS ve e-bülten gönderimleri için siparişten ayrı ve önceden işaretlenmemiş rıza kutuları kullanılmalı.
- [ ] **VERBİS Kaydı:** Yıllık ciro ve çalışan sayısı limitlerine göre VERBİS kaydı gerekliliği mali müşavirle teyit edilmeli.

---

## 5. İYS (İleti Yönetim Sistemi) Entegrasyonu
- [ ] **Pazarlama İzinleri:** Kampanya, SMS veya toplu e-posta gönderilecek tüm müşteri izinleri İYS sistemine (iys.org.tr) yüklenmeli.
- [ ] **Reddetme Hakkı:** Gönderilen her pazarlama iletisinde ücretsiz çıkış (unsubscribe) linki bulunmalı.

---

## 6. Ödeme Kuruluşu (iyzico) Canlı Onayı
- [ ] **Canlı Başvuru:** iyzico panelinden canlı hesap başvurusu yapılmalı.
- [ ] **Site İnceleme Şartları:** Sitede SSL sertifikası, iyzico logoları, iletişim bilgileri, iptal/iade şartları ve mesafeli satış sözleşmesi eksiksiz bulunmalı.
- [ ] **Canlı API Anahtarları:** Onay sonrası `.env` dosyasındaki `IYZICO_API_KEY` ve `IYZICO_SECRET_KEY` canlı değerlerle güncellenmeli ve `IYZICO_BASE_URL=https://api.iyzipay.com` yapılmalıdır.
