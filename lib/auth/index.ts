import { UserRole } from "@/lib/db/types";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

// 7 Adet Rolün İzin Matrisi
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SuperAdmin: ["*"],
  StoreAdmin: [
    "products.view",
    "products.manage",
    "categories.manage",
    "orders.view",
    "orders.manage",
    "customers.view",
    "content.manage",
    "reports.view",
    "settings.manage",
    "imports.manage",
  ],
  ProductManager: [
    "products.view",
    "products.manage",
    "categories.manage",
    "imports.manage",
    "inventory.manage",
  ],
  OrderManager: [
    "orders.view",
    "orders.manage",
    "returns.manage",
    "shipments.manage",
    "customers.view",
  ],
  ContentEditor: ["content.manage", "pages.manage", "banners.manage"],
  SupportAgent: ["customers.view", "orders.view", "reviews.moderate", "returns.view"],
  ReadOnlyAnalyst: ["reports.view", "orders.view", "products.view"],
  Customer: ["profile.manage", "orders.own.view", "reviews.create"],
};

/**
 * Checks if a user role has a specific permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  if (role === "SuperAdmin") return true;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes("*") || permissions.includes(permission);
}

/**
 * Checks if role can access admin panel
 */
export function canAccessAdmin(role: UserRole): boolean {
  return role !== "Customer";
}

/**
 * Mock active admin session for testing/development
 */
let currentMockSession: AuthUser = {
  id: "admin-user-01",
  email: "admin@zeynepnova.com",
  full_name: "Zeynep Nova Yönetici",
  role: "SuperAdmin",
};

export const authService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    return currentMockSession;
  },

  async setMockRole(role: UserRole) {
    currentMockSession.role = role;
  },

  async login(email: string, role: UserRole = "StoreAdmin"): Promise<AuthUser> {
    currentMockSession = {
      id: `usr-${Date.now()}`,
      email,
      full_name: email.split("@")[0],
      role,
    };
    return currentMockSession;
  },

  async logout(): Promise<void> {
    currentMockSession = {
      id: "guest",
      email: "guest@zeynepnova.com",
      full_name: "Misafir Kullanıcı",
      role: "Customer",
    };
  },
};
