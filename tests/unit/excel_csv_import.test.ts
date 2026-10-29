import { describe, it, expect } from "vitest";
import { excelCsvImportService } from "@/features/products/import/excelCsvImport";

describe("Excel/CSV Toplu Ürün İçe Aktarma Motoru", () => {
  it("Standart CSV şablonunu doğru başlıklarla üretmeli", () => {
    const csv = excelCsvImportService.generateTemplateCsv();
    expect(csv).toContain("sku");
    expect(csv).toContain("name");
    expect(csv).toContain("price");
    expect(csv).toContain("stock_quantity");
  });

  it("Standart Excel (.xlsx) şablonunu binary buffer olarak üretmeli", () => {
    const xlsxBuffer = excelCsvImportService.generateTemplateXlsx();
    expect(xlsxBuffer).toBeInstanceOf(Uint8Array);
    expect(xlsxBuffer.length).toBeGreaterThan(100);
  });

  it("Geçerli bir CSV içeriğini hatasız ayrıştırmalı", () => {
    const validCsv = `sku,name,category,price,stock_quantity,material,is_active\nZN-KLY-0088,Saf Gümüş İnci Kolye,Kolyeler,1450.00,10,925 Gümüş,true`;
    const preview = excelCsvImportService.parseAndValidate(validCsv, "csv", "test.csv");

    expect(preview.totalRows).toBe(1);
    expect(preview.validRowsCount).toBe(1);
    expect(preview.invalidRowsCount).toBe(0);
    expect(preview.rows[0].isValid).toBe(true);
    expect(preview.rows[0].parsedProduct?.sku).toBe("ZN-KLY-0088");
  });

  it("Negatif fiyat ve geçersiz stok içeren satırları tespit edip hata vermeli", () => {
    const invalidCsv = `sku,name,category,price,stock_quantity\nZN-BAD-0001,Hatalı Ürün,Kolyeler,-150,-5`;
    const preview = excelCsvImportService.parseAndValidate(invalidCsv, "csv", "invalid.csv");

    expect(preview.invalidRowsCount).toBe(1);
    expect(preview.rows[0].isValid).toBe(false);
    expect(preview.rows[0].errors.some((e) => e.includes("Fiyat") || e.includes("Stok"))).toBe(true);
  });

  it("Dosya içindeki mükerrer SKU kayıtlarını yakalamalı", () => {
    const duplicateCsv = `sku,name,category,price,stock_quantity\nZN-DUP-01,Ürün 1,Kolyeler,100,5\nZN-DUP-01,Ürün 2,Küpeler,200,10`;
    const preview = excelCsvImportService.parseAndValidate(duplicateCsv, "csv", "dup.csv");

    expect(preview.rows[0].isValid).toBe(true);
    expect(preview.rows[1].isValid).toBe(false);
    expect(preview.rows[1].errors.some((e) => e.includes("Mükerrer SKU"))).toBe(true);
  });
});
