// FALCON Database Schema Initializer
// Reads schema.sql and applies it to the connected PostgreSQL instance
// Idempotent: uses IF NOT EXISTS so re-running is safe

import { readFileSync } from 'fs';
import { join } from 'path';
import { pool } from './pool';

export async function applySchema(): Promise<void> {
  const schemaPath = join(__dirname, '../../src/server/database/schema.sql');
  const sql = readFileSync(schemaPath, 'utf-8');
  await pool.query(sql);
  console.log('[FALCON DB] Schema applied successfully.');
}
