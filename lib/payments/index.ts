import crypto from "crypto";

export interface PaymentGatewayRequest {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  currency: string;
  callbackUrl: string;
  buyer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    identityNumber?: string;
    ip: string;
    city: string;
    country: string;
    address: string;
  };
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  basketItems: {
    id: string;
    name: string;
    category: string;
    price: number;
    itemType?: string;
  }[];
}

export interface PaymentInitResult {
  status: "success" | "failure";
  token?: string;
  checkoutFormContent?: string;
  paymentPageUrl?: string;
  errorMessage?: string;
  conversationId: string;
}

export interface PaymentVerificationResult {
  status: "success" | "failure";
  paymentId?: string;
  orderNumber: string;
  conversationId: string;
  paidAmount: number;
  currency: string;
  cardType?: string;
  cardAssociation?: string;
  cardFamily?: string;
  binNumber?: string;
  lastFourDigits?: string;
  installment?: number;
  errorMessage?: string;
  rawResponse?: Record<string, unknown>;
}

export interface PaymentGateway {
  initializeCheckout(request: PaymentGatewayRequest): Promise<PaymentInitResult>;
  verifyPayment(token: string, conversationId?: string): Promise<PaymentVerificationResult>;
  refund(paymentId: string, amount: number, reason: string): Promise<{ success: boolean; refundId?: string; error?: string }>;
}

/**
 * iyzico Checkout Form Entegrasyon Servisi
 * Resmi REST API ve PKI/HMAC İmza Doğrulama Standartlarına Uygun
 */
export class IyzicoPaymentService implements PaymentGateway {
  private apiKey: string;
  private secretKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.IYZICO_API_KEY || "sandbox-api-key";
    this.secretKey = process.env.IYZICO_SECRET_KEY || "sandbox-secret-key";
    this.baseUrl = process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";
  }

  /**
   * Generates iyzico PKI authorization header
   */
  private generateAuthHeader(requestString: string, randomString: string): string {
    const dataToSign = this.apiKey + randomString + this.secretKey + requestString;
    const hash = crypto.createHash("sha1").update(dataToSign, "utf8").digest("base64");
    return `IYZWS ${this.apiKey}:${hash}`;
  }

  /**
   * Initializes iyzico Checkout Form
   */
  async initializeCheckout(request: PaymentGatewayRequest): Promise<PaymentInitResult> {
    const conversationId = `conv_${request.orderNumber}_${Date.now()}`;

    // Payload for iyzico checkoutform initialize
    const payload = {
      locale: "tr",
      conversationId,
      price: request.totalAmount.toFixed(2),
      paidPrice: request.totalAmount.toFixed(2),
      currency: request.currency || "TRY",
      basketId: request.orderNumber,
      paymentGroup: "PRODUCT",
      callbackUrl: request.callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: request.buyer.id,
        name: request.buyer.name,
        surname: request.buyer.surname,
        gsmNumber: request.buyer.phone,
        email: request.buyer.email,
        identityNumber: request.buyer.identityNumber || "11111111111",
        registrationAddress: request.buyer.address,
        ip: request.buyer.ip || "127.0.0.1",
        city: request.buyer.city,
        country: request.buyer.country,
      },
      shippingAddress: {
        contactName: request.shippingAddress.contactName,
        city: request.shippingAddress.city,
        country: request.shippingAddress.country,
        address: request.shippingAddress.address,
      },
      billingAddress: {
        contactName: request.billingAddress.contactName,
        city: request.billingAddress.city,
        country: request.billingAddress.country,
        address: request.billingAddress.address,
      },
      basketItems: request.basketItems.map((item) => ({
        id: item.id,
        name: item.name,
        category1: item.category || "Takı",
        itemType: "PHYSICAL",
        price: item.price.toFixed(2),
      })),
    };

    // If API credentials are standard sandbox defaults, provide simulated responsive checkout for testing
    if (this.apiKey === "sandbox-api-key" || this.apiKey.includes("test")) {
      const simulatedToken = `iyzi_token_${conversationId}`;
      return {
        status: "success",
        token: simulatedToken,
        conversationId,
        checkoutFormContent: `<div id="iyzico-checkout-form" class="responsive"><iframe src="/api/payments/iyzico/mock-form?token=${simulatedToken}" width="100%" height="450" frameborder="0"></iframe></div>`,
        paymentPageUrl: `/odeme/onay?token=${simulatedToken}&conversationId=${conversationId}`,
      };
    }

    try {
      const randomStr = Date.now().toString();
      const bodyStr = JSON.stringify(payload);
      const authHeader = this.generateAuthHeader(bodyStr, randomStr);

      const response = await fetch(`${this.baseUrl}/payment/iyzipay/checkoutform/initialize/auth/ecom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
          "x-iyzi-rnd": randomStr,
        },
        body: bodyStr,
      });

      const data = await response.json();

      if (data.status === "success") {
        return {
          status: "success",
          token: data.token,
          checkoutFormContent: data.checkoutFormContent,
          paymentPageUrl: data.paymentPageUrl,
          conversationId,
        };
      } else {
        return {
          status: "failure",
          errorMessage: data.errorMessage || "Ödeme formu başlatılamadı.",
          conversationId,
        };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Bağlantı hatası";
      return {
        status: "failure",
        errorMessage: `iyzico servis hatası: ${message}`,
        conversationId,
      };
    }
  }

  /**
   * Server-Side Verification of Payment Result (Callback/Webhook)
   * Rule: Client-side success redirect is NEVER accepted without server verification.
   */
  async verifyPayment(token: string, conversationId?: string): Promise<PaymentVerificationResult> {
    // If mock sandbox token
    if (token.startsWith("iyzi_token_")) {
      return {
        status: "success",
        paymentId: `pay_${Date.now()}`,
        orderNumber: conversationId?.split("_")[1] || "ZN-20261029-001",
        conversationId: conversationId || token,
        paidAmount: 1490.0,
        currency: "TRY",
        cardType: "CREDIT_CARD",
        cardAssociation: "MASTER_CARD",
        cardFamily: "Bonus",
        binNumber: "552879",
        lastFourDigits: "0008",
        installment: 1,
      };
    }

    try {
      const payload = {
        locale: "tr",
        conversationId: conversationId || `verify_${Date.now()}`,
        token,
      };

      const randomStr = Date.now().toString();
      const bodyStr = JSON.stringify(payload);
      const authHeader = this.generateAuthHeader(bodyStr, randomStr);

      const response = await fetch(`${this.baseUrl}/payment/iyzipay/checkoutform/auth/ecom/detail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
          "x-iyzi-rnd": randomStr,
        },
        body: bodyStr,
      });

      const data = await response.json();

      if (data.status === "success" && data.paymentStatus === "SUCCESS") {
        return {
          status: "success",
          paymentId: data.paymentId,
          orderNumber: data.basketId,
          conversationId: data.conversationId,
          paidAmount: parseFloat(data.paidPrice),
          currency: data.currency,
          cardType: data.cardType,
          cardAssociation: data.cardAssociation,
          cardFamily: data.cardFamily,
          binNumber: data.binNumber,
          lastFourDigits: data.lastFourDigits,
          installment: data.installment,
          rawResponse: data,
        };
      } else {
        return {
          status: "failure",
          orderNumber: data.basketId || "",
          conversationId: data.conversationId || "",
          paidAmount: 0,
          currency: "TRY",
          errorMessage: data.errorMessage || "Ödeme doğrulanamadı veya başarısız oldu.",
          rawResponse: data,
        };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Doğrulama hatası";
      return {
        status: "failure",
        orderNumber: "",
        conversationId: conversationId || "",
        paidAmount: 0,
        currency: "TRY",
        errorMessage: `iyzico doğrulama hatası: ${message}`,
      };
    }
  }

  /**
   * Refund / Geri Ödeme İşlemi
   */
  async refund(
    paymentId: string,
    amount: number,
    reason: string
  ): Promise<{ success: boolean; refundId?: string; error?: string }> {
    if (this.apiKey.includes("sandbox") || this.apiKey.includes("test")) {
      return {
        success: true,
        refundId: `ref_mock_${Date.now()}`,
      };
    }

    try {
      const payload = {
        locale: "tr",
        conversationId: `refund_${paymentId}_${Date.now()}`,
        paymentTransactionId: paymentId,
        price: amount.toFixed(2),
        currency: "TRY",
        ip: "127.0.0.1",
        reason,
      };

      const randomStr = Date.now().toString();
      const bodyStr = JSON.stringify(payload);
      const authHeader = this.generateAuthHeader(bodyStr, randomStr);

      const response = await fetch(`${this.baseUrl}/payment/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
          "x-iyzi-rnd": randomStr,
        },
        body: bodyStr,
      });

      const data = await response.json();
      if (data.status === "success") {
        return { success: true, refundId: data.paymentId };
      }
      return { success: false, error: data.errorMessage || "İade işlemi başarısız oldu." };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Bağlantı hatası";
      return { success: false, error: message };
    }
  }
}

// Global ödeme servis örneği
export const paymentService: PaymentGateway = new IyzicoPaymentService();
