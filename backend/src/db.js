import sqlite3 from "sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export function openDb(dbPath) {
  // Ensure parent directory exists
  mkdirSync(dirname(dbPath), { recursive: true });
  return new sqlite3.Database(dbPath);
}

export function initDb(db) {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS mascotas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        tipo TEXT NOT NULL CHECK(tipo IN ('perro','gato')),
        departamento TEXT NOT NULL,
        contacto TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
  });
}
