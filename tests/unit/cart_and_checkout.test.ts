import { describe, it, expect } from "vitest";
import { cartService } from "@/features/cart/cartService";

describe("Sepet ve Checkout Sunucu Tarafı Hesaplama Motoru", () => {
  it("Geçerli ürünlerle sepet tutarını ve ücretsiz kargoyu doğru hesaplamalı", async () => {
    // 1 adet p0000001 (1490 TL) + kargo (79.90 TL) = 1569.90 TL
    const res = await cartService.calculateCart([
      { productId: "p0000001-0000-0000-0000-000000000001", quantity: 1 },
    ]);

    expect(res.subtotal).toBe(1490);
    expect(res.shippingFee).toBe(79.9);
    expect(res.total).toBe(1569.9);
    expect(res.hasErrors).toBe(false);
  });

  it("1.500 TL üzeri sepetlerde kargonun ücretsiz (0 TL) olduğunu doğrulamalı", async () => {
    // 2 adet p0000001 = 2980 TL (>= 1500 TL) -> kargo 0 TL
    const res = await cartService.calculateCart([
      { productId: "p0000001-0000-0000-0000-000000000001", quantity: 2 },
    ]);

    expect(res.subtotal).toBe(2980);
    expect(res.shippingFee).toBe(0);
    expect(res.amountNeededForFreeShipping).toBe(0);
    expect(res.total).toBe(2980);
  });

  it("ZEYNEP10 kuponunu %10 indirim olarak sepetten doğru düşmeli", async () => {
    const res = await cartService.calculateCart(
      [{ productId: "p0000001-0000-0000-0000-000000000001", quantity: 2 }],
      "ZEYNEP10"
    );

    // subtotal = 2980, %10 = 298 TL, max_discount_amount = 500
    expect(res.subtotal).toBe(2980);
    expect(res.discountAmount).toBe(298);
    expect(res.total).toBe(2980 - 298);
  });

  it("Stokta olmayan veya aşırı talep edilen ürünlerde hata bildirmeli", async () => {
    const res = await cartService.calculateCart([
      { productId: "p0000001-0000-0000-0000-000000000001", quantity: 99999 },
    ]);

    expect(res.hasErrors).toBe(true);
    expect(res.errors.some((e) => e.includes("mevcut stok"))).toBe(true);
  });
});
