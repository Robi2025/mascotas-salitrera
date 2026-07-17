import sqlite3 from "sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export function openDb(dbPath) {
  mkdirSync(dirname(dbPath), { recursive: true });
  return new sqlite3.Database(dbPath);
}

const run = (db, sql) => new Promise((resolve, reject) => db.run(sql, (error) => error ? reject(error) : resolve()));
const all = (db, sql) => new Promise((resolve, reject) => db.all(sql, (error, rows) => error ? reject(error) : resolve(rows || [])));

export async function initDb(db) {
  await run(db, "PRAGMA foreign_keys = ON");
  await run(db, "PRAGMA journal_mode = WAL");
  await run(db, `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name TEXT NOT NULL,
    department TEXT,
    role TEXT NOT NULL CHECK(role IN ('admin','resident')),
    password_hash TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  await run(db, `CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  await run(db, `CREATE TABLE IF NOT EXISTS mascotas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('perro','gato')),
    departamento TEXT NOT NULL,
    contacto TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE RESTRICT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  const columns = await all(db, "PRAGMA table_info(mascotas)");
  if (!columns.some((column) => column.name === "user_id")) {
    await run(db, "ALTER TABLE mascotas ADD COLUMN user_id INTEGER REFERENCES users(id)");
  }
  await run(db, "CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash)");
  await run(db, "CREATE INDEX IF NOT EXISTS idx_mascotas_user ON mascotas(user_id)");
  await run(db, "DELETE FROM sessions WHERE expires_at <= datetime('now')");
}
