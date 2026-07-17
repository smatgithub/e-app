import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  // Allow boot without DB only when explicitly opted out (local stub mode)
  console.warn('DATABASE_URL is not set — DB features will fail until configured');
}

export const pool = new Pool({
  connectionString: databaseUrl,
  max: 10,
});

export async function checkDb(): Promise<{ ok: boolean; error?: string }> {
  if (!databaseUrl) {
    return { ok: false, error: 'DATABASE_URL missing' };
  }
  try {
    await pool.query('SELECT 1');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'db error' };
  }
}
