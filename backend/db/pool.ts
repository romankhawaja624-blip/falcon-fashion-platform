// FALCON Production PostgreSQL Connection Pool
// Uses real `pg` driver with environment-variable configuration
// Parameterized queries protect against SQL injection

import { Pool, PoolClient } from 'pg';

// --- Connection Pool ---
// All config comes from environment variables — never hardcoded
const pool = new Pool({
  host:     process.env.PGHOST     || 'localhost',
  port:     parseInt(process.env.PGPORT || '5432', 10),
  user:     process.env.PGUSER     || 'falcon_user',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || 'falcon_atelier_db',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  // Log server-side only — never expose to client
  console.error('[FALCON DB] Unexpected pool error:', err.message);
});

export interface QueryResult<T = Record<string, unknown>> {
  rows: T[];
  rowCount: number;
}

/** Parameterized query — safe from SQL injection */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<QueryResult<T>> {
  const result = await pool.query(sql, params);
  return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 };
}

/** Atomic transaction: auto-commits on success, auto-rolls back on error */
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/** Health-check: verifies the pool can reach PostgreSQL */
export async function checkConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

/** Gracefully close the database connection pool */
export async function closePool(): Promise<void> {
  await pool.end();
}

export { pool };
