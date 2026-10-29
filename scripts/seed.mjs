import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  const databaseUrl = process.env.DATABASE_URL;

  console.log('🌱 ZeynepNova Başlangıç Verileri (Seed) Yükleniyor...');

  if (!databaseUrl) {
    console.warn('⚠️ DATABASE_URL bulunamadı. Yerel veriler bellekte ve dosya tabanlı olarak hazır.');
    return;
  }

  const pool = new pg.Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    const client = await pool.connect();
    const seedFile = path.join(__dirname, '../db/seed/001_initial_seed.sql');
    const sql = fs.readFileSync(seedFile, 'utf8');

    console.log('⚙️ Seed SQL çalıştırılıyor...');
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');

    client.release();
    console.log('🎉 Başlangıç verileri başarıyla yüklendi!');
  } catch (err) {
    console.error('❌ Seed sırasında hata:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSeed();
