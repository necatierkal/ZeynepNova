import { describe, it, expect } from "vitest";
import { paymentService } from "@/lib/payments";

describe("iyzico Ödeme Entegrasyonu ve Callback Doğrulama", () => {
  it("iyzico Checkout Form isteğini başarıyla başlatmalı ve token üretmeli", async () => {
    const initRes = await paymentService.initializeCheckout({
      orderId: "ord-test-01",
      orderNumber: "ZN-20261029-9999",
      totalAmount: 1490.0,
      currency: "TRY",
      callbackUrl: "http://localhost:3000/api/payments/iyzico/callback",
      buyer: {
        id: "buyer-01",
        name: "Ayşe",
        surname: "Yılmaz",
        email: "ayse@example.com",
        phone: "05325551234",
        ip: "127.0.0.1",
        city: "İstanbul",
        country: "Türkiye",
        address: "Bağdat Cad. No: 1",
      },
      shippingAddress: {
        contactName: "Ayşe Yılmaz",
        city: "İstanbul",
        country: "Türkiye",
        address: "Bağdat Cad. No: 1",
      },
      billingAddress: {
        contactName: "Ayşe Yılmaz",
        city: "İstanbul",
        country: "Türkiye",
        address: "Bağdat Cad. No: 1",
      },
      basketItems: [
        {
          id: "p1",
          name: "Gümüş Kolye",
          category: "Kolyeler",
          price: 1490.0,
        },
      ],
    });

    expect(initRes.status).toBe("success");
    expect(initRes.token).toBeDefined();
    expect(initRes.conversationId).toContain("ZN-20261029-9999");
  });

  it("Sunucu tarafında ödeme token doğrulamasını gerçekleştirmeli", async () => {
    const mockToken = "iyzi_token_conv_ZN-20261029-9999_123456";
    const verification = await paymentService.verifyPayment(mockToken, "conv_ZN-20261029-9999_123456");

    expect(verification.status).toBe("success");
    expect(verification.paidAmount).toBe(1490.0);
    expect(verification.orderNumber).toBe("ZN-20261029-9999");
  });

  it("Geçersiz veya yetkisiz token ile yapılan doğrulamalarda başarısız durum dönmeli", async () => {
    // A non-mock failing token
    const verification = await paymentService.verifyPayment("invalid-token-123", "conv-fail");
    expect(verification.status).toBe("failure");
    expect(verification.errorMessage).toBeDefined();
  });
});
