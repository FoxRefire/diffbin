import Database from 'better-sqlite3';
import path from 'path';
import { mkdirSync } from 'fs';
import { initSchema } from './schema';

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'diffbin.db');

// Ensure data directory exists
const dbDir = path.dirname(dbPath);
try {
  mkdirSync(dbDir, { recursive: true });
} catch (error) {
  // Directory might already exist
}

const db = new Database(dbPath);

// Initialize schema
initSchema(db);

export default db;

