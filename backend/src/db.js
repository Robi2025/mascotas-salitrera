import sqlite3 from "sqlite3";
import pg from "pg";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

function postgresSql(sql) {
  let position = 0;
  return sql.replace(/\?/g, () => `$${++position}`).replace(/active = 1/g, "active = TRUE");
}
class PostgresCompat {
  constructor(connectionString) { this.isPostgres = true; this.pool = new pg.Pool({ connectionString, max: 5 }); }
  get(sql, params, callback) { this.pool.query(postgresSql(sql), params).then((r) => callback(null, r.rows[0])).catch(callback); }
  all(sql, params, callback) { this.pool.query(postgresSql(sql), params).then((r) => callback(null, r.rows)).catch(callback); }
  run(sql, params, callback = () => {}) {
    let query = postgresSql(sql);
    if (/^\s*INSERT\s+/i.test(query) && !/\sRETURNING\s/i.test(query)) query += " RETURNING id";
    this.pool.query(query, params).then((r) => callback.call({ lastID: r.rows[0]?.id, changes: r.rowCount }, null)).catch((e) => callback.call({}, e));
  }
}
export function openDb(dbPath) {
  if (process.env.DATABASE_URL) return new PostgresCompat(process.env.DATABASE_URL);
  mkdirSync(dirname(dbPath), { recursive: true });
  return new sqlite3.Database(dbPath);
}
const run = (db, sql, params = []) => new Promise((resolve, reject) => db.run(sql, params, function done(error) { error ? reject(error) : resolve({ id: this.lastID, changes: this.changes }); }));
const all = (db, sql) => new Promise((resolve, reject) => db.all(sql, [], (error, rows) => error ? reject(error) : resolve(rows || [])));
async function addPostgresColumns(db, table, columns) {
  for (const [name, definition] of columns) await run(db, `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${name} ${definition}`);
}
async function addSqliteColumns(db, table, columns) {
  const existing = await all(db, `PRAGMA table_info(${table})`);
  for (const [name, definition] of columns) if (!existing.some((c) => c.name === name)) await run(db, `ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`);
}
const userColumns = [["phone", "TEXT"], ["tower", "TEXT"], ["avatar_data", "TEXT"], ["bio", "TEXT"]];
const petColumns = [
  ["breed", "TEXT"], ["birth_date", "TEXT"], ["color", "TEXT"], ["status", "TEXT DEFAULT 'En casa'"],
  ["notes", "TEXT"], ["photo_data", "TEXT"], ["is_lost", "BOOLEAN DEFAULT FALSE"], ["lost_details", "TEXT"]
];
export async function initDb(db) {
  if (db.isPostgres) {
    await run(db, `CREATE TABLE IF NOT EXISTS users (id BIGSERIAL PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, department TEXT, role TEXT NOT NULL CHECK(role IN ('admin','resident')), password_hash TEXT NOT NULL, active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await addPostgresColumns(db, "users", userColumns);
    await run(db, `CREATE TABLE IF NOT EXISTS sessions (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, token_hash TEXT NOT NULL UNIQUE, expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await run(db, `CREATE TABLE IF NOT EXISTS mascotas (id BIGSERIAL PRIMARY KEY, nombre TEXT NOT NULL, tipo TEXT NOT NULL, departamento TEXT NOT NULL, contacto TEXT NOT NULL, user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT, created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await addPostgresColumns(db, "mascotas", petColumns);
    await run(db, `CREATE TABLE IF NOT EXISTS messages (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, content TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
  } else {
    await run(db, "PRAGMA foreign_keys = ON"); await run(db, "PRAGMA journal_mode = WAL");
    await run(db, `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE COLLATE NOCASE, name TEXT NOT NULL, department TEXT, role TEXT NOT NULL CHECK(role IN ('admin','resident')), password_hash TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT (datetime('now')))`);
    await addSqliteColumns(db, "users", userColumns);
    await run(db, `CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, token_hash TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')))`);
    await run(db, `CREATE TABLE IF NOT EXISTS mascotas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, tipo TEXT NOT NULL, departamento TEXT NOT NULL, contacto TEXT NOT NULL, user_id INTEGER REFERENCES users(id) ON DELETE RESTRICT, created_at TEXT NOT NULL DEFAULT (datetime('now')))`);
    await addSqliteColumns(db, "mascotas", [["user_id", "INTEGER REFERENCES users(id)"], ...petColumns.map(([n, d]) => [n, n === "is_lost" ? "INTEGER DEFAULT 0" : d])]);
    await run(db, `CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, content TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')))`);
  }
  await run(db, "CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash)");
  await run(db, "CREATE INDEX IF NOT EXISTS idx_mascotas_user ON mascotas(user_id)");
  await run(db, "CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at)");
  await run(db, db.isPostgres ? "DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP" : "DELETE FROM sessions WHERE expires_at <= datetime('now')");
}
