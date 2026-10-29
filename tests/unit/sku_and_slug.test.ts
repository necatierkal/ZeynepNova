import { describe, it, expect } from "vitest";
import { slugify, generateSKU } from "@/lib/utils";

describe("Türkçe Slug ve SKU Üretim Testleri", () => {
  it("Türkçe karakterleri ve boşlukları URL dostu slug'a dönüştürmeli", () => {
    const title = "Işıltılı Safir Taşlı Gümüş Kolye & Küpe";
    const slug = slugify(title);
    expect(slug).toBe("isiltili-safir-tasli-gumus-kolye-kupe");
  });

  it("Özel karakterleri ve gereksiz tire işaretlerini temizlemeli", () => {
    const raw = "--- Altın Yüzük %100 Doğal İnci! ---";
    const slug = slugify(raw);
    expect(slug).toBe("altin-yuzuk-100-dogal-inci");
  });

  it("Kategoriye uygun standart takı SKU kodları üretmeli", () => {
    const sku1 = generateSKU("KLY", 1);
    expect(sku1).toBe("ZN-KLY-0001");

    const sku2 = generateSKU("YUZ", 42);
    expect(sku2).toBe("ZN-YUZ-0042");

    const sku3 = generateSKU("KUPELER", 125);
    expect(sku3).toBe("ZN-KUP-0125");
  });
});
