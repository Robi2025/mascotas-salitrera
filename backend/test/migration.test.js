import test from "node:test";
import assert from "node:assert/strict";
import sqlite3 from "sqlite3";
import { initDb } from "../src/db.js";

const run = (db, sql) => new Promise((resolve, reject) => db.run(sql, (error) => error ? reject(error) : resolve()));
const all = (db, sql) => new Promise((resolve, reject) => db.all(sql, (error, rows) => error ? reject(error) : resolve(rows)));

test("legacy pet table gains ownership column and index", async () => {
  const db = new sqlite3.Database(":memory:");
  await run(db, "CREATE TABLE mascotas (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, tipo TEXT NOT NULL, departamento TEXT NOT NULL, contacto TEXT NOT NULL, created_at TEXT)");
  await initDb(db);
  const columns = await all(db, "PRAGMA table_info(mascotas)");
  const indexes = await all(db, "PRAGMA index_list(mascotas)");
  assert.ok(columns.some((column) => column.name === "user_id"));
  assert.ok(indexes.some((index) => index.name === "idx_mascotas_user"));
  await new Promise((resolve, reject) => db.close((error) => error ? reject(error) : resolve()));
});
