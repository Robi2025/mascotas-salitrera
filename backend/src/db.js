import sqlite3 from "sqlite3";
import pg from "pg";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

function postgresSql(sql) {
  let position = 0;
  return sql.replace(/\?/g, () => `$${++position}`).replace(/active = 1/g, "active = TRUE");
}

class PostgresCompat {
  constructor(connectionString) {
    this.isPostgres = true;
    this.pool = new pg.Pool({ connectionString, max: 5 });
  }
  get(sql, params, callback) {
    this.pool.query(postgresSql(sql), params).then((result) => callback(null, result.rows[0])).catch(callback);
  }
  all(sql, params, callback) {
    this.pool.query(postgresSql(sql), params).then((result) => callback(null, result.rows)).catch(callback);
  }
  run(sql, params, callback = () => {}) {
    let query = postgresSql(sql);
    if (/^\s*INSERT\s+/i.test(query) && !/\sRETURNING\s/i.test(query)) query += " RETURNING id";
    this.pool.query(query, params).then((result) => callback.call({ lastID: result.rows[0]?.id, changes: result.rowCount }, null)).catch((error) => callback.call({}, error));
  }
}

export function openDb(dbPath) {
  if (process.env.DATABASE_URL) return new PostgresCompat(process.env.DATABASE_URL);
  mkdirSync(dirname(dbPath), { recursive: true });
  return new sqlite3.Database(dbPath);
}

const run = (db, sql, params = []) => new Promise((resolve, reject) => db.run(sql, params, function done(error) { error ? reject(error) : resolve({ id: this.lastID, changes: this.changes }); }));
const all = (db, sql) => new Promise((resolve, reject) => db.all(sql, [], (error, rows) => error ? reject(error) : resolve(rows || [])));

export async function initDb(db) {
  if (db.isPostgres) {
    await run(db, `CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
      department TEXT, role TEXT NOT NULL CHECK(role IN ('admin','resident')),
      password_hash TEXT NOT NULL, active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await run(db, `CREATE TABLE IF NOT EXISTS sessions (
      id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE, expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await run(db, `CREATE TABLE IF NOT EXISTS mascotas (
      id BIGSERIAL PRIMARY KEY, nombre TEXT NOT NULL,
      tipo TEXT NOT NULL CHECK(tipo IN ('perro','gato')), departamento TEXT NOT NULL,
      contacto TEXT NOT NULL, user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await run(db, "CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash)");
    await run(db, "CREATE INDEX IF NOT EXISTS idx_mascotas_user ON mascotas(user_id)");
    await run(db, "DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP");
    return;
  }
  await run(db, "PRAGMA foreign_keys = ON");
  await run(db, "PRAGMA journal_mode = WAL");
  await run(db, `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE COLLATE NOCASE, name TEXT NOT NULL, department TEXT, role TEXT NOT NULL CHECK(role IN ('admin','resident')), password_hash TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT (datetime('now')))`);
  await run(db, `CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, token_hash TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')))`);
  await run(db, `CREATE TABLE IF NOT EXISTS mascotas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, tipo TEXT NOT NULL CHECK(tipo IN ('perro','gato')), departamento TEXT NOT NULL, contacto TEXT NOT NULL, user_id INTEGER REFERENCES users(id) ON DELETE RESTRICT, created_at TEXT NOT NULL DEFAULT (datetime('now')))`);
  const columns = await all(db, "PRAGMA table_info(mascotas)");
  if (!columns.some((column) => column.name === "user_id")) await run(db, "ALTER TABLE mascotas ADD COLUMN user_id INTEGER REFERENCES users(id)");
  await run(db, "CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash)");
  await run(db, "CREATE INDEX IF NOT EXISTS idx_mascotas_user ON mascotas(user_id)");
  await run(db, "DELETE FROM sessions WHERE expires_at <= datetime('now')");
}
