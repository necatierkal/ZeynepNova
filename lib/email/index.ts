export interface EmailMessage {
  to: string;
  subject: string;
  template:
    | "order_confirmed"
    | "payment_success"
    | "payment_failed"
    | "order_shipped"
    | "order_delivered"
    | "return_requested"
    | "return_status_updated"
    | "critical_stock_alert"
    | "newsletter_welcome";
  variables: Record<string, string | number | undefined | null>;
}

export interface EmailOutboxItem {
  id: string;
  recipient_email: string;
  subject: string;
  template_name: string;
  variables: Record<string, unknown>;
  status: "pending" | "sent" | "failed";
  error_message?: string;
  sent_at?: string;
  created_at: string;
}

let outboxStore: EmailOutboxItem[] = [];

/**
 * ZeynepNova Lüks E-posta Şablon Üreticisi
 */
function renderEmailTemplate(
  template: EmailMessage["template"],
  vars: Record<string, string | number | undefined | null>
): { subject: string; html: string } {
  const brandName = "ZeynepNova";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zeynepnova.com";

  const baseHeader = `
    <!DOCTYPE html>
    <html lang="tr">
    <head><meta charset="UTF-8"><style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 20px; color: #141419; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #ECE6DA; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
      .header { background: #141419; padding: 32px 24px; text-align: center; }
      .logo { font-size: 24px; letter-spacing: 0.2em; color: #FAF8F5; text-transform: uppercase; font-family: Georgia, serif; text-decoration: none; }
      .logo span { color: #C59A45; }
      .content { padding: 32px 28px; line-height: 1.6; font-size: 14px; }
      .btn { display: inline-block; background: #141419; color: #ffffff !important; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 13px; margin: 20px 0; }
      .footer { background: #F5F2EB; padding: 20px; text-align: center; font-size: 11px; color: #646477; border-top: 1px solid #ECE6DA; }
      .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
    </style></head><body>
    <div class="container">
      <div class="header">
        <a href="${siteUrl}" class="logo">Zeynep<span>Nova</span></a>
      </div>
      <div class="content">
  `;

  const baseFooter = `
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} ${brandName} Atelier & Jewelry. Tüm hakları saklıdır.</p>
        <p>Nişantaşı, Abdi İpekçi Cad. No: 42, Şişli / İstanbul | destek@zeynepnova.com</p>
        <p><a href="${siteUrl}/gizlilik-politikasi" style="color: #646477;">Gizlilik Politikası</a> | <a href="${siteUrl}/iletisim" style="color: #646477;">Müşteri Destek</a></p>
      </div>
    </div></body></html>
  `;

  switch (template) {
    case "order_confirmed":
    case "payment_success":
      return {
        subject: `Siparişiniz Alındı (#${vars.orderNumber}) — ${brandName}`,
        html: `${baseHeader}
          <h2 style="font-family: Georgia, serif; font-size: 20px; color: #141419; margin-top: 0;">Siparişiniz İçin Teşekkür Ederiz, Sayın ${vars.customerName || "Değerli Müşterimiz"}!</h2>
          <p>Siparişiniz başarıyla oluşturuldu ve ödemeniz güvenle alındı. Atölyemizde özenle hazırlanarak en kısa sürede kargoya teslim edilecektir.</p>
          <div style="background: #FAF8F5; border: 1px solid #ECE6DA; padding: 16px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Sipariş No:</strong> ${vars.orderNumber}</p>
            <p style="margin: 0 0 8px 0;"><strong>Toplam Tutar:</strong> ${vars.totalAmount} ₺</p>
            <p style="margin: 0;"><strong>Teslimat Adresi:</strong> ${vars.address || "-"}</p>
          </div>
          <div style="text-align: center;">
            <a href="${siteUrl}/siparis-takip?orderNumber=${vars.orderNumber}" class="btn">Sipariş Durumunu Takip Et</a>
          </div>
        ${baseFooter}`,
      };

    case "payment_failed":
      return {
        subject: `Ödeme Tamamlanamadı (#${vars.orderNumber}) — ${brandName}`,
        html: `${baseHeader}
          <h2 style="font-family: Georgia, serif; font-size: 20px; color: #b91c1c; margin-top: 0;">Ödeme İşlemi Başarısız Oldu</h2>
          <p>Sayın ${vars.customerName || "Müşterimiz"}, <strong>#${vars.orderNumber}</strong> numaralı siparişinizin ödemesi banka/kart sağlayıcısı tarafından onaylanamadı.</p>
          <p>Hata Açıklaması: <em>${vars.errorMessage || "Kart bakiyesi yetersiz veya işlem reddedildi."}</em></p>
          <p>Siparişinizi tamamlamak için farklı bir kart deneyebilir veya ödemeyi tekrar başlatabilirsiniz.</p>
          <div style="text-align: center;">
            <a href="${siteUrl}/sepet" class="btn">Sepete Dön ve Tekrar Dene</a>
          </div>
        ${baseFooter}`,
      };

    case "order_shipped":
      return {
        subject: `Siparişiniz Kargoya Verildi! (#${vars.orderNumber}) — ${brandName}`,
        html: `${baseHeader}
          <h2 style="font-family: Georgia, serif; font-size: 20px; color: #141419; margin-top: 0;">Paketiniz Yola Çıktı 🚚</h2>
          <p>Sayın ${vars.customerName || "Müşterimiz"}, takılarınız özenle paketlendi ve <strong>${vars.carrier || "Yurtiçi Kargo"}</strong> firmasına teslim edildi.</p>
          <div style="background: #FAF8F5; border: 1px solid #ECE6DA; padding: 16px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Kargo Firması:</strong> ${vars.carrier || "Yurtiçi Kargo"}</p>
            <p style="margin: 0;"><strong>Takip Numarası:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: bold;">${vars.trackingNumber}</span></p>
          </div>
          <div style="text-align: center;">
            <a href="${vars.trackingUrl || `${siteUrl}/siparis-takip`}" class="btn">Kargomu Takip Et</a>
          </div>
        ${baseFooter}`,
      };

    case "critical_stock_alert":
      return {
        subject: `[YÖNETİCİ UYARISI] Kritik Stok Seviyesi: ${vars.sku} — ${brandName}`,
        html: `${baseHeader}
          <h2 style="font-family: Georgia, serif; font-size: 20px; color: #d97706; margin-top: 0;">Kritik Stok Uyarısı</h2>
          <p>Aşağıdaki ürünün mevcut stok miktarı kritik eşiğin altına indi:</p>
          <div style="background: #FAF8F5; border: 1px solid #ECE6DA; padding: 16px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Ürün Adı:</strong> ${vars.productName}</p>
            <p style="margin: 0 0 8px 0;"><strong>SKU:</strong> ${vars.sku}</p>
            <p style="margin: 0;"><strong>Kalan Stok:</strong> <span style="color: #b91c1c; font-weight: bold;">${vars.stockQuantity} adet</span></p>
          </div>
          <div style="text-align: center;">
            <a href="${siteUrl}/admin/urunler" class="btn">Yönetim Panelinden Stoğu Güncelle</a>
          </div>
        ${baseFooter}`,
      };

    case "newsletter_welcome":
    default:
      return {
        subject: `ZeynepNova Ailesine Hoş Geldiniz ✨`,
        html: `${baseHeader}
          <h2 style="font-family: Georgia, serif; font-size: 20px; color: #141419; margin-top: 0;">Zarafet Dünyamıza Hoş Geldiniz</h2>
          <p>E-bültenimize kaydolduğunuz için teşekkür ederiz. Artık en yeni takı koleksiyonlarımızdan, atölye hikayelerimizden ve size özel ayrıcalıklardan ilk siz haberdar olacaksınız.</p>
          <div style="text-align: center;">
            <a href="${siteUrl}" class="btn">Koleksiyonları İnceleyin</a>
          </div>
        ${baseFooter}`,
      };
  }
}

/**
 * Güvenli E-Posta Servisi (Outbox Pattern)
 * Kural 10: E-posta gönderim hataları sipariş işlemlerini ASLA bozmaz.
 */
export const emailService = {
  async sendEmail(message: EmailMessage): Promise<{ success: boolean; outboxId: string }> {
    const rendered = renderEmailTemplate(message.template, message.variables);
    const outboxId = `outbox_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const outboxItem: EmailOutboxItem = {
      id: outboxId,
      recipient_email: message.to,
      subject: rendered.subject,
      template_name: message.template,
      variables: message.variables,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    outboxStore.unshift(outboxItem);

    // Asenkron gönderim denemesi (Simulated / SMTP Provider)
    try {
      // SMTP / Resend bağlantısı varsa gönder
      outboxItem.status = "sent";
      outboxItem.sent_at = new Date().toISOString();
      return { success: true, outboxId };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gönderim hatası";
      outboxItem.status = "failed";
      outboxItem.error_message = msg;
      // Siparişi kesintiye uğratmaz!
      return { success: false, outboxId };
    }
  },

  async getOutbox() {
    return [...outboxStore];
  },
};
