-- ============================================================================
-- ZEYNEPNOVA ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- Versiyon: 1.0.0
-- ============================================================================

-- RLS Etkinleştirme
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_jobs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Yardımcı Güvenlik Fonksiyonları
-- ----------------------------------------------------------------------------

-- Kullanıcının belirtilen role sahip olup olmadığını kontrol eden fonksiyon
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND (role = required_role OR role = 'SuperAdmin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Herhangi bir yönetici rolüne sahip mi?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role IN (
            'SuperAdmin', 'StoreAdmin', 'ProductManager', 
            'OrderManager', 'ContentEditor', 'SupportAgent', 'ReadOnlyAnalyst'
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 1. PROFILES POLİTİKALARI
-- ----------------------------------------------------------------------------
CREATE POLICY "Kullanıcılar kendi profillerini görebilir"
ON profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 2. PRODUCTS & CATEGORIES POLİTİKALARI
-- ----------------------------------------------------------------------------
-- Müşteriler yalnızca aktif kategorileri ve ürünleri görebilir, yöneticiler hepsini görebilir
CREATE POLICY "Aktif ürünler herkese açıktır"
ON products FOR SELECT
USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Ürün yöneticileri ürünleri yönetebilir"
ON products FOR ALL
USING (public.has_role('ProductManager') OR public.has_role('StoreAdmin'));

CREATE POLICY "Aktif kategoriler herkese açıktır"
ON categories FOR SELECT
USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Kategori yöneticileri kategorileri yönetebilir"
ON categories FOR ALL
USING (public.has_role('ProductManager') OR public.has_role('StoreAdmin'));

CREATE POLICY "Ürün varyantları aktif ürünlerde herkese açıktır"
ON product_variants FOR SELECT
USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Ürün görselleri herkese açıktır"
ON product_images FOR SELECT
USING (TRUE);

-- ----------------------------------------------------------------------------
-- 3. ADRESLER POLİTİKALARI
-- ----------------------------------------------------------------------------
CREATE POLICY "Kullanıcılar yalnızca kendi adreslerini görebilir"
ON addresses FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Kullanıcılar kendi adreslerini ekleyebilir ve güncelleyebilir"
ON addresses FOR ALL
USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 4. SEPET VE FAVORİ POLİTİKALARI
-- ----------------------------------------------------------------------------
CREATE POLICY "Kullanıcılar yalnızca kendi sepetlerini görebilir"
ON carts FOR ALL
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Kullanıcılar yalnızca kendi sepet kalemlerini yönetebilir"
ON cart_items FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM carts
        WHERE carts.id = cart_items.cart_id
        AND (carts.user_id = auth.uid() OR public.is_admin())
    )
);

CREATE POLICY "Kullanıcılar kendi favorilerini yönetebilir"
ON wishlists FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi favori kalemlerini yönetebilir"
ON wishlist_items FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM wishlists
        WHERE wishlists.id = wishlist_items.wishlist_id
        AND wishlists.user_id = auth.uid()
    )
);

-- ----------------------------------------------------------------------------
-- 5. SİPARİŞ VE ÖDEME POLİTİKALARI
-- ----------------------------------------------------------------------------
CREATE POLICY "Müşteriler kendi siparişlerini görebilir"
ON orders FOR SELECT
USING (auth.uid() = user_id OR public.has_role('OrderManager') OR public.has_role('StoreAdmin'));

CREATE POLICY "Sipariş kalemleri yetkili veya sipariş sahibine açıktır"
ON order_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR public.has_role('OrderManager') OR public.has_role('StoreAdmin'))
    )
);

CREATE POLICY "Ödemeler yalnızca sipariş sahibi veya yönetici tarafından görüntülenebilir"
ON payments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = payments.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
);

-- ----------------------------------------------------------------------------
-- 6. YORUMLAR POLİTİKALARI
-- ----------------------------------------------------------------------------
CREATE POLICY "Onaylanan yorumlar herkese açıktır"
ON product_reviews FOR SELECT
USING (is_approved = TRUE OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Kullanıcılar kendi yorumlarını ekleyebilir"
ON product_reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Yöneticiler yorumları denetleyebilir"
ON product_reviews FOR UPDATE
USING (public.has_role('SupportAgent') OR public.has_role('StoreAdmin'));

-- ----------------------------------------------------------------------------
-- 7. İÇERİK VE DENETİM (CMS & AUDIT)
-- ----------------------------------------------------------------------------
CREATE POLICY "Yayınlanan sayfalar herkese açıktır"
ON pages FOR SELECT
USING (is_published = TRUE OR public.is_admin());

CREATE POLICY "İçerik editörleri sayfaları yönetebilir"
ON pages FOR ALL
USING (public.has_role('ContentEditor') OR public.has_role('StoreAdmin'));

CREATE POLICY "Yalnızca SuperAdmin denetim kayıtlarını görebilir"
ON audit_logs FOR SELECT
USING (public.has_role('SuperAdmin'));
