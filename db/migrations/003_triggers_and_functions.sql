-- ============================================================================
-- ZEYNEPNOVA VERİTABANI TETİKLEYİCİLERİ VE FONKSİYONLARI
-- Versiyon: 1.0.0
-- ============================================================================

-- Otomatik Güncellenen Zaman Damgası Fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at Tetikleyicilerini Bağla
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_payments_updated_at ON payments;
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Stok Hareketi Eklendiğinde Ürün Ana Stok Miktarını Güncelleyen Tetikleyici
CREATE OR REPLACE FUNCTION sync_product_stock_on_movement()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET stock_quantity = NEW.new_quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_product_stock ON inventory_movements;
CREATE TRIGGER trg_sync_product_stock AFTER INSERT ON inventory_movements
FOR EACH ROW EXECUTE FUNCTION sync_product_stock_on_movement();
