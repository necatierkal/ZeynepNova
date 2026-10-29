import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProductInputSchema } from "@/lib/validation";
import { securityService } from "@/lib/security";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validated = ProductInputSchema.parse(body);

    const newProduct = await db.createProduct({
      sku: validated.sku,
      name: validated.name,
      slug: body.slug,
      category_id: validated.category_id,
      category_name: body.category_name,
      price: validated.price,
      sale_price: validated.sale_price,
      cost_price: validated.cost_price,
      stock_quantity: validated.stock_quantity,
      critical_stock_threshold: validated.critical_stock_threshold,
      material: validated.material,
      stone_type: validated.stone_type,
      color: validated.color,
      size: validated.size,
      weight_grams: validated.weight_grams,
      short_description: validated.short_description,
      description: validated.description,
      care_instructions: validated.care_instructions,
      package_contents: validated.package_contents,
      images: validated.images.length > 0 ? validated.images : ["/placeholder-jewelry.jpg"],
      is_active: validated.is_active,
      is_featured: validated.is_featured,
      is_new: validated.is_new,
    });

    // Record Audit Log
    await securityService.logAdminAction({
      action: "product.create",
      entityType: "product",
      entityId: newProduct.id,
      userEmail: "admin@zeynepnova.com",
      details: `Yeni ürün oluşturuldu: ${newProduct.name} (${newProduct.sku})`,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Ürün oluşturulamadı";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
