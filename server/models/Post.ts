import db from '../db/connection';

export interface PostData {
  id: string;
  encrypted_data: string;
  iv: string;
  created_at: string;
  expires_at: string | null;
}

export class Post {
  static create(data: {
    id: string;
    encrypted_data: string;
    iv: string;
    expires_at?: Date | null;
  }): PostData {
    const stmt = db.prepare(`
      INSERT INTO posts (id, encrypted_data, iv, expires_at)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(
      data.id,
      data.encrypted_data,
      data.iv,
      data.expires_at ? data.expires_at.toISOString() : null
    );
    
    return this.findById(data.id)!;
  }

  static findById(id: string): PostData | null {
    const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
    const row = stmt.get(id) as PostData | undefined;
    return row || null;
  }

  static deleteExpired(): number {
    const stmt = db.prepare('DELETE FROM posts WHERE expires_at IS NOT NULL AND expires_at < datetime("now")');
    const result = stmt.run();
    return result.changes;
  }
}

