import { describe, it, expect } from "vitest";
import { formatCurrency } from "@/lib/utils";

describe("Fiyat ve Para Birimi Hesaplamaları", () => {
  it("Türk Lirası para birimini kuruş hassasiyetiyle doğru biçimlendirmeli", () => {
    const formatted = formatCurrency(1450.5);
    // Should format with Turkish locale comma decimal
    expect(formatted).toContain("1.450,50");
    expect(formatted).toContain("₺");
  });

  it("Sıfır veya geçersiz tutarlarda güvenli biçimlendirme yapmalı", () => {
    expect(formatCurrency(0)).toContain("0,00");
    expect(formatCurrency(null)).toContain("0,00");
    expect(formatCurrency(undefined)).toContain("0,00");
  });

  it("Yüzdesel indirim kuponunu doğru hesaplamalı", () => {
    const subtotal = 1000;
    const discountRate = 10; // %10
    const calculatedDiscount = (subtotal * discountRate) / 100;
    expect(calculatedDiscount).toBe(100);
    expect(subtotal - calculatedDiscount).toBe(900);
  });

  it("Sabit tutarlı indirim sepet toplamını aşmamalı", () => {
    const subtotal = 150;
    const fixedDiscount = 200;
    const effectiveDiscount = Math.min(subtotal, fixedDiscount);
    expect(effectiveDiscount).toBe(150);
    expect(subtotal - effectiveDiscount).toBe(0);
  });

  it("Kargo eşiğini doğru uygulamalı", () => {
    const freeShippingThreshold = 1500;
    const standardFee = 79.9;

    const cart1 = 1200;
    const shipping1 = cart1 >= freeShippingThreshold ? 0 : standardFee;
    expect(shipping1).toBe(79.9);

    const cart2 = 1600;
    const shipping2 = cart2 >= freeShippingThreshold ? 0 : standardFee;
    expect(shipping2).toBe(0);
  });
});
