import { NextResponse } from "next/server";
import { paymentService } from "@/lib/payments";
import { db } from "@/lib/db";
import { emailService } from "@/lib/email";

// Set to track processed idempotency keys to avoid duplicate stock/order manipulations
const processedTokens = new Set<string>();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const token = formData.get("token") as string;
    const conversationId = formData.get("conversationId") as string;

    if (!token) {
      return NextResponse.json({ status: "failure", message: "Token eksik." }, { status: 400 });
    }

    // Idempotency check: Do not re-process if already verified
    if (processedTokens.has(token)) {
      return NextResponse.redirect(new URL(`/odeme/onay?token=${token}`, request.url));
    }

    // Server-side verification with iyzico API
    const verification = await paymentService.verifyPayment(token, conversationId);

    if (verification.status === "success") {
      processedTokens.add(token);

      // Find order and update status to 'paid'
      const order = await db.getOrderByNumber(verification.orderNumber);
      if (order) {
        await db.updateOrderStatus(
          order.id,
          "paid",
          `iyzico ödemesi başarıyla tamamlandı. Payment ID: ${verification.paymentId}`
        );

        // Notify customer via email
        if (order.guest_email) {
          emailService.sendEmail({
            to: order.guest_email,
            subject: `Ödemeniz Alındı (#${order.order_number})`,
            template: "payment_success",
            variables: {
              orderNumber: order.order_number,
              customerName: order.guest_name || "Değerli Müşterimiz",
              totalAmount: order.total_amount,
            },
          });
        }
      }

      return NextResponse.redirect(
        new URL(`/odeme/onay?orderNumber=${verification.orderNumber}&status=success`, request.url)
      );
    } else {
      // Payment Failed: Record status
      if (verification.orderNumber) {
        const order = await db.getOrderByNumber(verification.orderNumber);
        if (order) {
          await db.updateOrderStatus(
            order.id,
            "cancelled",
            `Ödeme başarısız: ${verification.errorMessage}`
          );
        }
      }

      return NextResponse.redirect(
        new URL(
          `/odeme/onay?orderNumber=${verification.orderNumber}&status=failed&error=${encodeURIComponent(
            verification.errorMessage || "Ödeme onaylanamadı"
          )}`,
          request.url
        )
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Callback hatası";
    return NextResponse.json({ status: "error", error: message }, { status: 500 });
  }
}
