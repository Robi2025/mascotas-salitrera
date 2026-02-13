import express from "express";import cors from "cors";

import { openDb, initDb } from "./db.js";

const app = express();
app.use(cors({
  origin: "http://127.0.0.1:5500",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API Mascotas Salitrera funcionando 🐶🐱");
});

const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || "./data/mascotas.db";

const db = openDb(DB_PATH);
initDb(db);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/mascotas", (_req, res) => {
  db.all("SELECT * FROM mascotas ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: "db_error" });
    res.json(rows);
  });
});

app.post("/mascotas", (req, res) => {
  const { nombre, tipo, departamento, contacto } = req.body || {};
  if (!nombre || !tipo || !departamento || !contacto) {
    return res.status(400).json({ error: "missing_fields" });
  }
  if (tipo !== "perro" && tipo !== "gato") {
    return res.status(400).json({ error: "invalid_tipo" });
  }
  const stmt = db.prepare(
    "INSERT INTO mascotas (nombre, tipo, departamento, contacto) VALUES (?, ?, ?, ?)"
  );
  stmt.run([nombre, tipo, departamento, contacto], function (err) {
    if (err) return res.status(500).json({ error: "db_error" });
    res.status(201).json({ id: this.lastID, nombre, tipo, departamento, contacto });
  });
  stmt.finalize();
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
