import { db } from "@/lib/db";

// In-memory sliding window rate limiter
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export const securityService = {
  /**
   * Simple and effective sliding window rate limiter
   * @param key IP address or user ID + action key (e.g. "checkout:192.168.1.1")
   * @param maxRequests Maximum requests allowed within window
   * @param windowMs Window duration in milliseconds (default 60 seconds)
   */
  checkRateLimit(
    key: string,
    maxRequests = 10,
    windowMs = 60 * 1000
  ): { allowed: boolean; remaining: number; resetInMs: number } {
    const now = Date.now();
    const existing = rateLimitStore.get(key);

    if (!existing || now > existing.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1, resetInMs: windowMs };
    }

    if (existing.count >= maxRequests) {
      return { allowed: false, remaining: 0, resetInMs: existing.resetAt - now };
    }

    existing.count += 1;
    return {
      allowed: true,
      remaining: maxRequests - existing.count,
      resetInMs: existing.resetAt - now,
    };
  },

  /**
   * Basic XSS sanitization
   */
  sanitizeString(input: string): string {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  },

  /**
   * Masks sensitive strings for logging (e.g. credit card number or token)
   */
  maskSensitive(value: string): string {
    if (!value || value.length <= 4) return "****";
    return "*".repeat(value.length - 4) + value.slice(-4);
  },

  /**
   * Records an audit log entry for administrative actions
   */
  async logAdminAction(params: {
    action: string;
    entityType: string;
    entityId?: string;
    userEmail: string;
    details?: string;
  }) {
    return db.addAuditLog({
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId,
      user_email: params.userEmail,
      details: params.details,
    });
  },
};
