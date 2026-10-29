import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;

  console.log('🔄 ZeynepNova Veritabanı Migration İşlemi Başlatılıyor...');

  if (!databaseUrl) {
    console.warn('⚠️ DATABASE_URL ortam değişkeni tanımlı değil.');
    console.log('ℹ️ Sistem yerel depolama adaptörüyle çalışmaya devam edecek.');
    console.log('ℹ️ Canlı PostgreSQL veya Supabase bağlamak için .env dosyasına DATABASE_URL ekleyin.');
    return;
  }

  const pool = new pg.Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL veritabanına başarıyla bağlanıldı.');

    // Migration tablosunu oluştur
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const migrationsDir = path.join(__dirname, '../db/migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      if (!file.endsWith('.sql')) continue;

      const checkRes = await client.query('SELECT 1 FROM _migrations WHERE filename = $1', [file]);
      if (checkRes.rowCount > 0) {
        console.log(`⏩ Atlandı (Zaten uygulandı): ${file}`);
        continue;
      }

      console.log(`⚙️ Uygulanıyor: ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`✅ Tamamlandı: ${file}`);
    }

    client.release();
    console.log('🎉 Tüm veritabanı migration işlemleri başarıyla tamamlandı!');
  } catch (err) {
    console.error('❌ Migration sırasında hata:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
