import { db } from "@/lib/db";
import { Product } from "@/lib/db/types";

export interface CartItemInput {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

export interface ValidatedCartItem {
  product: Product & { images: string[] };
  variantId?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isAvailable: boolean;
  stockRemaining: number;
  stockError?: string;
}

export interface CartCalculationResult {
  items: ValidatedCartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  couponCode?: string | null;
  shippingFee: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  total: number;
  hasErrors: boolean;
  errors: string[];
}

export const cartService = {
  /**
   * Recalculates cart entirely on the server side using live database product prices & inventory.
   * Rule: Client prices and totals are NEVER trusted.
   */
  async calculateCart(
    items: CartItemInput[],
    couponCode?: string | null
  ): Promise<CartCalculationResult> {
    const settings = await db.getStoreSettings();
    const validatedItems: ValidatedCartItem[] = [];
    const errors: string[] = [];

    let subtotal = 0;
    let itemCount = 0;

    for (const item of items) {
      const product = await db.getProductById(item.productId);

      if (!product || !product.is_active) {
        errors.push(`Sepetinizdeki bir ürün artık satışta değil veya yayından kaldırılmış.`);
        continue;
      }

      const availableStock = product.stock_quantity;
      const isAvailable = availableStock >= item.quantity;
      let stockError: string | undefined;

      if (availableStock <= 0) {
        stockError = `"${product.name}" tükendi.`;
        errors.push(stockError);
      } else if (!isAvailable) {
        stockError = `"${product.name}" için mevcut stok: ${availableStock} adet.`;
        errors.push(stockError);
      }

      const unitPrice = product.sale_price ?? product.price;
      const requestedQty = Math.max(1, item.quantity);
      const itemTotal = unitPrice * requestedQty;

      subtotal += itemTotal;
      itemCount += requestedQty;

      validatedItems.push({
        product,
        variantId: item.variantId,
        quantity: requestedQty,
        unitPrice,
        totalPrice: itemTotal,
        isAvailable,
        stockRemaining: availableStock,
        stockError,
      });
    }

    // Coupon calculation
    let discountAmount = 0;
    let appliedCouponCode: string | null = null;
    let couponGivesFreeShipping = false;

    if (couponCode && couponCode.trim()) {
      const coupon = await db.getCouponByCode(couponCode.trim());

      if (!coupon) {
        errors.push(`"${couponCode}" geçerli bir kupon kodu değil.`);
      } else if (coupon.min_cart_amount && subtotal < coupon.min_cart_amount) {
        errors.push(
          `"${coupon.code}" kuponu en az ${coupon.min_cart_amount} ₺ tutarındaki sepetlerde geçerlidir.`
        );
      } else {
        appliedCouponCode = coupon.code;
        if (coupon.discount_type === "percentage") {
          discountAmount = (subtotal * coupon.discount_value) / 100;
          if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
            discountAmount = coupon.max_discount_amount;
          }
        } else {
          discountAmount = Math.min(subtotal, coupon.discount_value);
        }

        if (coupon.free_shipping) {
          couponGivesFreeShipping = true;
        }
      }
    }

    // Shipping Fee
    const freeShippingThreshold = settings.free_shipping_threshold;
    let shippingFee = subtotal >= freeShippingThreshold || couponGivesFreeShipping ? 0 : settings.standard_shipping_fee;
    if (subtotal === 0) shippingFee = 0;

    const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    const total = Math.max(0, subtotal - discountAmount + shippingFee);

    return {
      items: validatedItems,
      itemCount,
      subtotal,
      discountAmount,
      couponCode: appliedCouponCode,
      shippingFee,
      freeShippingThreshold,
      amountNeededForFreeShipping,
      total,
      hasErrors: errors.length > 0,
      errors,
    };
  },
};
