import express from "express";import cors from "cors";

import { openDb, initDb } from "./db.js";

const app = express();

// ====== CORS CONFIGURACIÓN ======
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ];
    
    // En desarrollo, permitir sin origin (requests desde archivo local)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: origin no permitido"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// ====== LOGGING MIDDLEWARE ======
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ====== RUTAS PRUEBA ======
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
  stmt.run([nombre, tipo, departamento, contacto], function (err) {
    if (err) return res.status(500).json({ error: "db_error" });
    res.status(201).json({ id: this.lastID, nombre, tipo, departamento, contacto });
  });
  stmt.finalize();
});

// ====== PUT /mascotas/:id - ACTUALIZAR MASCOTA ======
app.put("/mascotas/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, departamento, contacto } = req.body || {};

  // Validación
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "invalid_id" });
  }
  if (!nombre || !tipo || !departamento || !contacto) {
    return res.status(400).json({ error: "missing_fields" });
  }
  if (tipo !== "perro" && tipo !== "gato") {
    return res.status(400).json({ error: "invalid_tipo" });
  }

  // Verificar que mascota existe
  db.get("SELECT id FROM mascotas WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: "db_error" });
    if (!row) return res.status(404).json({ error: "not_found" });

    // Actualizar
    const stmt = db.prepare(
      "UPDATE mascotas SET nombre = ?, tipo = ?, departamento = ?, contacto = ? WHERE id = ?"
    );
    stmt.run([nombre, tipo, departamento, contacto, id], function (err) {
      if (err) return res.status(500).json({ error: "db_error" });
      res.json({ id: parseInt(id), nombre, tipo, departamento, contacto });
    });
    stmt.finalize();
  });
});

// ====== DELETE /mascotas/:id - ELIMINAR MASCOTA ======
app.delete("/mascotas/:id", (req, res) => {
  const { id } = req.params;

  // Validación
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "invalid_id" });
  }

  // Verificar que mascota existe
  db.get("SELECT id FROM mascotas WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: "db_error" });
    if (!row) return res.status(404).json({ error: "not_found" });

    // Eliminar
    const stmt = db.prepare("DELETE FROM mascotas WHERE id = ?");
    stmt.run([id], function (err) {
      if (err) return res.status(500).json({ error: "db_error" });
      res.json({ success: true, id: parseInt(id) });
    });
    stmt.finalize();
  });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  API Mascotas Salitrera escuchando        ║
║  🚀 http://localhost:${PORT}              ║
║  ✅ CORS habilitado para:                 ║
║     - http://127.0.0.1:5500               ║
║     - http://localhost:5500               ║
╚════════════════════════════════════════════╝
  `);
});
