import { NextResponse } from "next/server";
import { checkoutService } from "@/features/checkout/checkoutService";
import { securityService } from "@/lib/security";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

    // Rate Limiting Check: max 5 checkout attempts per IP per minute
    const rateCheck = securityService.checkRateLimit(`checkout:${ip}`, 5, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Çok fazla deneme yaptınız. Lütfen bir dakika sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = await checkoutService.processCheckout(body, ip);

    return NextResponse.json({
      success: true,
      orderNumber: result.orderNumber,
      orderId: result.orderId,
      totalAmount: result.totalAmount,
      paymentUrl: result.paymentResult.paymentPageUrl,
      token: result.paymentResult.token,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sipariş işleme hatası";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
