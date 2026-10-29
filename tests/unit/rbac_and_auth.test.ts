import { describe, it, expect } from "vitest";
import { hasPermission, canAccessAdmin } from "@/lib/auth";

describe("RBAC Yetkilendirme ve Güvenlik Kontrolleri", () => {
  it("SuperAdmin tüm izinlere ve yönetim paneline erişebilmeli", () => {
    expect(hasPermission("SuperAdmin", "products.manage")).toBe(true);
    expect(hasPermission("SuperAdmin", "any.nonexistent.action")).toBe(true);
    expect(canAccessAdmin("SuperAdmin")).toBe(true);
  });

  it("Customer rolü yönetim paneline erişememeli", () => {
    expect(canAccessAdmin("Customer")).toBe(false);
    expect(hasPermission("Customer", "products.manage")).toBe(false);
    expect(hasPermission("Customer", "orders.manage")).toBe(false);
  });

  it("ProductManager yalnızca ürün/katalog yetkilerine sahip olmalı", () => {
    expect(hasPermission("ProductManager", "products.manage")).toBe(true);
    expect(hasPermission("ProductManager", "categories.manage")).toBe(true);
    expect(hasPermission("ProductManager", "orders.manage")).toBe(false);
  });

  it("OrderManager yalnızca sipariş/kargo yetkilerine sahip olmalı", () => {
    expect(hasPermission("OrderManager", "orders.manage")).toBe(true);
    expect(hasPermission("OrderManager", "shipments.manage")).toBe(true);
    expect(hasPermission("OrderManager", "products.manage")).toBe(false);
  });

  it("ReadOnlyAnalyst düzenleme yapamamalı yalnızca rapor okuyabilmeli", () => {
    expect(hasPermission("ReadOnlyAnalyst", "reports.view")).toBe(true);
    expect(hasPermission("ReadOnlyAnalyst", "products.manage")).toBe(false);
    expect(hasPermission("ReadOnlyAnalyst", "orders.manage")).toBe(false);
  });
});
