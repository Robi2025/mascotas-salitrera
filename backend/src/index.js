import express from "express";
import cors from "cors";

import { openDb, initDb } from "./db.js";

const app = express();

const envAllowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  // Capacitor WebView origin (Android/iOS).
  "http://localhost",
  ...envAllowedOrigins,
];

const corsOptions = {
  origin(origin, callback) {
    // Allow no-origin requests (curl, some webviews).
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("CORS policy: origin no permitido"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get("/", (_req, res) => {
  res.send("API Mascotas Salitrera funcionando");
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
    res.json(rows || []);
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
  stmt.run([nombre, tipo, departamento, contacto], function onInsert(err) {
    if (err) return res.status(500).json({ error: "db_error" });
    return res
      .status(201)
      .json({ id: this.lastID, nombre, tipo, departamento, contacto });
  });
  stmt.finalize();
});

app.put("/mascotas/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, departamento, contacto } = req.body || {};

  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).json({ error: "invalid_id" });
  }
  if (!nombre || !tipo || !departamento || !contacto) {
    return res.status(400).json({ error: "missing_fields" });
  }
  if (tipo !== "perro" && tipo !== "gato") {
    return res.status(400).json({ error: "invalid_tipo" });
  }

  db.get("SELECT id FROM mascotas WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: "db_error" });
    if (!row) return res.status(404).json({ error: "not_found" });

    const stmt = db.prepare(
      "UPDATE mascotas SET nombre = ?, tipo = ?, departamento = ?, contacto = ? WHERE id = ?"
    );
    stmt.run(
      [nombre, tipo, departamento, contacto, id],
      function onUpdate(updateErr) {
        if (updateErr) return res.status(500).json({ error: "db_error" });
        return res.json({
          id: Number(id),
          nombre,
          tipo,
          departamento,
          contacto,
        });
      }
    );
    stmt.finalize();
  });
});

app.delete("/mascotas/:id", (req, res) => {
  const { id } = req.params;

  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).json({ error: "invalid_id" });
  }

  db.get("SELECT id FROM mascotas WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: "db_error" });
    if (!row) return res.status(404).json({ error: "not_found" });

    const stmt = db.prepare("DELETE FROM mascotas WHERE id = ?");
    stmt.run([id], function onDelete(deleteErr) {
      if (deleteErr) return res.status(500).json({ error: "db_error" });
      return res.json({ success: true, id: Number(id) });
    });
    stmt.finalize();
  });
});

app.listen(PORT, () => {
  console.log("==========================================");
  console.log("API Mascotas Salitrera escuchando");
  console.log(`http://localhost:${PORT}`);
  console.log("CORS local habilitado para:");
  console.log("- http://127.0.0.1:5500");
  console.log("- http://localhost:5500");
  console.log("- http://localhost (Android)");
  if (envAllowedOrigins.length > 0) {
    console.log("- Origenes extra desde ALLOWED_ORIGINS:");
    envAllowedOrigins.forEach((origin) => console.log(`  - ${origin}`));
  }
  console.log("==========================================");
});
