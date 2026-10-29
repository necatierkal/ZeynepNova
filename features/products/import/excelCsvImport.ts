import Papa from "papaparse";
import * as XLSX from "xlsx";
import { db } from "@/lib/db";
import { CsvProductRowSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";

export interface ParsedImportRow {
  rowNumber: number;
  data: Record<string, unknown>;
  isValid: boolean;
  errors: string[];
  parsedProduct?: {
    sku: string;
    name: string;
    category: string;
    price: number;
    sale_price?: number | null;
    stock_quantity: number;
    color?: string | null;
    material?: string | null;
    stone_type?: string | null;
    description?: string | null;
    short_description?: string | null;
    is_active: boolean;
    images: string[];
  };
}

export interface ImportPreviewResult {
  filename: string;
  totalRows: number;
  validRowsCount: number;
  invalidRowsCount: number;
  rows: ParsedImportRow[];
}

export interface ImportExecutionResult {
  total: number;
  created: number;
  updated: number;
  failed: number;
  errors: { row: number; sku?: string; error: string }[];
}

export const excelCsvImportService = {
  /**
   * Generates a sample CSV template content with standard headers
   */
  generateTemplateCsv(): string {
    const headers = [
      "sku",
      "name",
      "category",
      "short_description",
      "description",
      "price",
      "sale_price",
      "stock_quantity",
      "color",
      "material",
      "stone_type",
      "size",
      "weight",
      "is_active",
      "image_urls",
    ];

    const sampleRow = [
      "ZN-KLY-0099",
      "Özel Tasarım Zümrüt Efektli Kolye",
      "Kolyeler",
      "925 ayar gümüş zümrüt efektli zarif kolye",
      "Antialerjik özel kaplama, el işçiliği zümrüt kesim kolye.",
      "1650.00",
      "1390.00",
      "20",
      "Zümrüt Yeşili",
      "925 Ayar Gümüş",
      "Zirkon",
      "45 cm",
      "3.8",
      "true",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
    ];

    return Papa.unparse([headers, sampleRow]);
  },

  /**
   * Generates an Excel (.xlsx) buffer with sample headers and data
   */
  generateTemplateXlsx(): Uint8Array {
    const data = [
      {
        sku: "ZN-KLY-0099",
        name: "Özel Tasarım Zümrüt Efektli Kolye",
        category: "Kolyeler",
        short_description: "925 ayar gümüş zümrüt efektli zarif kolye",
        description: "Antialerjik özel kaplama, el işçiliği zümrüt kesim kolye.",
        price: 1650.0,
        sale_price: 1390.0,
        stock_quantity: 20,
        color: "Zümrüt Yeşili",
        material: "925 Ayar Gümüş",
        stone_type: "Zirkon",
        size: "45 cm",
        weight: 3.8,
        is_active: "true",
        image_urls: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ürünler");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    return new Uint8Array(buffer);
  },

  /**
   * Parses CSV or Excel raw text/buffer and performs strict validation
   */
  parseAndValidate(
    fileContent: string | ArrayBuffer,
    fileType: "csv" | "excel",
    filename: string
  ): ImportPreviewResult {
    let rawRows: Record<string, unknown>[] = [];

    if (fileType === "csv") {
      const parsed = Papa.parse<Record<string, unknown>>(fileContent as string, {
        header: true,
        skipEmptyLines: "greedy",
        dynamicTyping: true,
      });
      rawRows = parsed.data;
    } else {
      const workbook = XLSX.read(fileContent, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
    }

    const seenSkus = new Set<string>();
    const rows: ParsedImportRow[] = [];

    let rowNum = 1; // 1-based data row
    for (const raw of rawRows) {
      rowNum++;
      const errors: string[] = [];

      // Validate with Zod
      const parseResult = CsvProductRowSchema.safeParse(raw);

      if (!parseResult.success) {
        for (const issue of parseResult.error.issues) {
          errors.push(`${issue.path.join(".")}: ${issue.message}`);
        }
      }

      const sku = String(raw.sku || "").trim().toUpperCase();
      if (sku) {
        if (seenSkus.has(sku)) {
          errors.push(`Mükerrer SKU: '${sku}' dosya içinde birden fazla satırda geçiyor.`);
        } else {
          seenSkus.add(sku);
        }
      }

      if (parseResult.success && errors.length === 0) {
        const d = parseResult.data;
        rows.push({
          rowNumber: rowNum,
          data: raw,
          isValid: true,
          errors: [],
          parsedProduct: {
            sku: d.sku.trim().toUpperCase(),
            name: d.name.trim(),
            category: d.category.trim(),
            price: d.price,
            sale_price: d.sale_price,
            stock_quantity: d.stock_quantity,
            color: d.color,
            material: d.material,
            stone_type: d.stone_type,
            description: d.description,
            short_description: d.short_description,
            is_active: d.is_active,
            images: d.image_urls,
          },
        });
      } else {
        rows.push({
          rowNumber: rowNum,
          data: raw,
          isValid: false,
          errors,
        });
      }
    }

    const validRowsCount = rows.filter((r) => r.isValid).length;
    const invalidRowsCount = rows.length - validRowsCount;

    return {
      filename,
      totalRows: rows.length,
      validRowsCount,
      invalidRowsCount,
      rows,
    };
  },

  /**
   * Executes the import using the chosen strategy:
   * - 'create_only': only insert new SKUs, skip existing
   * - 'update_only': only update existing SKUs, skip non-existent
   * - 'create_and_update': update if exists, otherwise create new
   */
  async executeImport(
    preview: ImportPreviewResult,
    strategy: "create_only" | "update_only" | "create_and_update"
  ): Promise<ImportExecutionResult> {
    const categories = await db.getCategories();
    let created = 0;
    let updated = 0;
    let failed = 0;
    const executionErrors: { row: number; sku?: string; error: string }[] = [];

    // Filter valid rows only
    const validRows = preview.rows.filter((r) => r.isValid && r.parsedProduct);

    for (const r of validRows) {
      const p = r.parsedProduct!;

      try {
        const existing = await db.getProductBySku(p.sku);

        // Find or map category
        let category = categories.find(
          (c) => c.name.toLocaleLowerCase("tr-TR") === p.category.toLocaleLowerCase("tr-TR")
        );

        if (!category && categories.length > 0) {
          category = categories[0];
        }

        if (existing) {
          if (strategy === "create_only") {
            // Skip
            continue;
          }

          // Update existing
          await db.updateProduct(existing.id, {
            name: p.name,
            price: p.price,
            sale_price: p.sale_price,
            stock_quantity: p.stock_quantity,
            material: p.material || existing.material,
            stone_type: p.stone_type || existing.stone_type,
            color: p.color || existing.color,
            description: p.description || existing.description,
            short_description: p.short_description || existing.short_description,
            is_active: p.is_active,
            images: p.images.length > 0 ? p.images : existing.images,
          });
          updated++;
        } else {
          if (strategy === "update_only") {
            // Skip
            continue;
          }

          // Create new
          await db.createProduct({
            sku: p.sku,
            name: p.name,
            slug: slugify(p.name) + "-" + Math.floor(Math.random() * 900 + 100),
            category_id: category?.id,
            category_name: category?.name,
            price: p.price,
            sale_price: p.sale_price,
            stock_quantity: p.stock_quantity,
            material: p.material || "925 Ayar Gümüş",
            stone_type: p.stone_type || "Zirkon",
            color: p.color || "Altın",
            description: p.description || p.name,
            short_description: p.short_description || p.name,
            is_active: p.is_active,
            images: p.images.length > 0 ? p.images : ["/placeholder-jewelry.jpg"],
          });
          created++;
        }
      } catch (err: unknown) {
        failed++;
        const msg = err instanceof Error ? err.message : "İçe aktarma hatası";
        executionErrors.push({ row: r.rowNumber, sku: p.sku, error: msg });
      }
    }

    return {
      total: validRows.length,
      created,
      updated,
      failed,
      errors: executionErrors,
    };
  },
};
