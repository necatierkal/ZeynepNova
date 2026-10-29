import { db } from "@/lib/db";
import { cartService } from "@/features/cart/cartService";
import { paymentService } from "@/lib/payments";
import { emailService } from "@/lib/email";
import { CheckoutOrderSchema } from "@/lib/validation";
import { z } from "zod";

export type CheckoutInput = z.infer<typeof CheckoutOrderSchema>;

export const checkoutService = {
  /**
   * Processes end-to-end checkout, creates order in DB, and initializes iyzico checkout form
   */
  async processCheckout(input: CheckoutInput, clientIp = "127.0.0.1") {
    // 1. Validate payload with Zod
    const validated = CheckoutOrderSchema.parse(input);

    // 2. Server-side fresh recalculation of cart
    const cartCalc = await cartService.calculateCart(
      validated.items.map((it) => ({
        productId: it.product_id,
        variantId: it.variant_id,
        quantity: it.quantity,
      })),
      validated.coupon_code
    );

    if (cartCalc.hasErrors) {
      throw new Error(cartCalc.errors.join(" "));
    }

    if (cartCalc.items.length === 0) {
      throw new Error("Sepetinizde ürün bulunamadı.");
    }

    // 3. Unique order number generation
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(Math.random() * 9000 + 1000);
    const orderNumber = `ZN-${dateStr}-${randomSuffix}`;

    // 4. Create Order in Database
    const newOrder = await db.createOrder({
      order_number: orderNumber,
      status: "pending_payment",
      subtotal: cartCalc.subtotal,
      discount_amount: cartCalc.discountAmount,
      shipping_fee: cartCalc.shippingFee,
      total_amount: cartCalc.total,
      guest_email: validated.guest_email,
      guest_phone: validated.guest_phone,
      guest_name: validated.guest_name,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      shipping_address: validated.shipping_address as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      billing_address: validated.billing_address as any,
      coupon_code: cartCalc.couponCode,
      notes: validated.notes,
      items: cartCalc.items.map((it, idx) => ({
        id: `ord-item-${Date.now()}-${idx}`,
        order_id: "",
        product_id: it.product.id,
        variant_id: it.variantId || null,
        sku: it.product.sku,
        product_name: it.product.name,
        unit_price: it.unitPrice,
        quantity: it.quantity,
        total_price: it.totalPrice,
        image_url: it.product.images[0] || null,
        created_at: new Date().toISOString(),
      })),
    });

    // 5. Initialize Payment Gateway (iyzico)
    const callbackUrl =
      process.env.IYZICO_CALLBACK_URL || "http://localhost:3000/api/payments/iyzico/callback";

    const paymentResult = await paymentService.initializeCheckout({
      orderId: newOrder.id,
      orderNumber: newOrder.order_number,
      totalAmount: newOrder.total_amount,
      currency: "TRY",
      callbackUrl,
      buyer: {
        id: validated.guest_email,
        name: validated.shipping_address.first_name,
        surname: validated.shipping_address.last_name,
        email: validated.guest_email,
        phone: validated.shipping_address.phone,
        identityNumber: validated.shipping_address.corporate_tax_number || "11111111111",
        ip: clientIp,
        city: validated.shipping_address.city,
        country: validated.shipping_address.country,
        address: validated.shipping_address.address_line1,
      },
      shippingAddress: {
        contactName: `${validated.shipping_address.first_name} ${validated.shipping_address.last_name}`,
        city: validated.shipping_address.city,
        country: validated.shipping_address.country,
        address: validated.shipping_address.address_line1,
      },
      billingAddress: {
        contactName: `${validated.billing_address.first_name} ${validated.billing_address.last_name}`,
        city: validated.billing_address.city,
        country: validated.billing_address.country,
        address: validated.billing_address.address_line1,
      },
      basketItems: cartCalc.items.map((it) => ({
        id: it.product.id,
        name: it.product.name,
        category: (it.product as { category_name?: string }).category_name || "Takı",
        price: it.unitPrice * it.quantity,
      })),
    });

    // 6. Asynchronous email notification (Outbox pattern)
    emailService.sendEmail({
      to: validated.guest_email,
      subject: `Siparişiniz Alındı (#${newOrder.order_number})`,
      template: "order_confirmed",
      variables: {
        orderNumber: newOrder.order_number,
        customerName: validated.guest_name,
        totalAmount: newOrder.total_amount,
        address: `${validated.shipping_address.address_line1}, ${validated.shipping_address.district} / ${validated.shipping_address.city}`,
      },
    });

    return {
      orderId: newOrder.id,
      orderNumber: newOrder.order_number,
      totalAmount: newOrder.total_amount,
      paymentResult,
    };
  },
};
