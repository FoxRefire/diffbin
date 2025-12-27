import Database from 'better-sqlite3';

export function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      encrypted_data TEXT NOT NULL,
      iv TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_created_at ON posts(created_at);
    CREATE INDEX IF NOT EXISTS idx_expires_at ON posts(expires_at);
  `);
}

