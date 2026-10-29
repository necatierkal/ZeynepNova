import { NextResponse } from "next/server";
import { securityService } from "@/lib/security";
import { emailService } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

    // Rate Limit: Max 3 newsletter requests per minute per IP
    const rateCheck = securityService.checkRateLimit(`newsletter:${ip}`, 3, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Lütfen biraz bekleyip tekrar deneyin." },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi giriniz." },
        { status: 400 }
      );
    }

    // Trigger welcome email
    await emailService.sendEmail({
      to: email,
      subject: "ZeynepNova Ailesine Hoş Geldiniz ✨",
      template: "newsletter_welcome",
      variables: {},
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
