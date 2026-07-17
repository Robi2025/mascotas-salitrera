import express from "express";
import cors from "cors";
import { openDb, initDb } from "./db.js";
import { createSessionToken, hashPassword, hashToken, isStrongPassword, verifyPassword } from "./security.js";

const app = express();
app.disable("x-powered-by");
const PORT = Number(process.env.PORT || 3000);
const DB_PATH = process.env.DB_PATH || "./data/mascotas.db";
const SESSION_DAYS = Math.max(1, Number(process.env.SESSION_DAYS || 30));
const isProduction = process.env.NODE_ENV === "production";
const origins = (process.env.ALLOWED_ORIGINS || "").split(",").map((v) => v.trim()).filter(Boolean);
const allowedOrigins = new Set(["http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:3000", "https://localhost", ...origins]);
const db = openDb(DB_PATH);
await initDb(db);

const dbGet = (sql, params = []) => new Promise((resolve, reject) => db.get(sql, params, (error, row) => error ? reject(error) : resolve(row)));
const dbAll = (sql, params = []) => new Promise((resolve, reject) => db.all(sql, params, (error, rows) => error ? reject(error) : resolve(rows || [])));
const dbRun = (sql, params = []) => new Promise((resolve, reject) => db.run(sql, params, function done(error) { error ? reject(error) : resolve({ id: this.lastID, changes: this.changes }); }));

app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.has(origin)) return callback(null, true);
  callback(new Error("Origen no permitido"));
}, methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json({ limit: "32kb" }));
app.use((_req, res, next) => {
  res.set({ "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY", "Referrer-Policy": "no-referrer", "Cache-Control": "no-store" });
  if (isProduction) res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});

const attempts = new Map();
function loginRateLimit(req, res, next) {
  const key = req.ip || "unknown";
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter((time) => now - time < 15 * 60_000);
  if (recent.length >= 10) return res.status(429).json({ error: "too_many_attempts" });
  recent.push(now); attempts.set(key, recent); next();
}

async function requireAuth(req, res, next) {
  try {
    const [scheme, token] = String(req.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token) return res.status(401).json({ error: "authentication_required" });
    const tokenHash = hashToken(token);
    const user = await dbGet(`SELECT u.id, u.email, u.name, u.department, u.role, u.active FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ? AND u.active = 1`, [tokenHash, new Date().toISOString()]);
    if (!user) return res.status(401).json({ error: "invalid_session" });
    req.user = user; req.sessionTokenHash = tokenHash; next();
  } catch (error) { next(error); }
}
function requireAdmin(req, res, next) { if (req.user.role !== "admin") return res.status(403).json({ error: "admin_required" }); next(); }
function normalizeEmail(value) { return String(value || "").trim().toLowerCase(); }
function clean(value, max) { return String(value || "").trim().slice(0, max); }
function publicUser(user) { return { id: user.id, email: user.email, name: user.name, department: user.department, role: user.role, active: Boolean(user.active ?? 1) }; }
function validatePet(body) {
  const pet = { nombre: clean(body?.nombre, 80), tipo: clean(body?.tipo, 10), departamento: clean(body?.departamento, 20), contacto: clean(body?.contacto, 30) };
  return pet.nombre.length >= 2 && ["perro", "gato"].includes(pet.tipo) && pet.departamento && pet.contacto ? pet : null;
}

app.get("/", (_req, res) => res.json({ name: "Mascotas Salitrera API", status: "ok" }));
app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/auth/bootstrap", async (req, res, next) => {
  try {
    const count = await dbGet("SELECT COUNT(*) AS total FROM users");
    if (count.total > 0) return res.status(409).json({ error: "already_initialized" });
    if (!process.env.BOOTSTRAP_SECRET || req.body?.bootstrapSecret !== process.env.BOOTSTRAP_SECRET) return res.status(403).json({ error: "invalid_bootstrap_secret" });
    const email = normalizeEmail(req.body?.email); const name = clean(req.body?.name, 80); const password = req.body?.password;
    if (!email.includes("@") || !name || !isStrongPassword(password)) return res.status(400).json({ error: "invalid_user_data" });
    const result = await dbRun("INSERT INTO users (email, name, role, password_hash) VALUES (?, ?, 'admin', ?)", [email, name, await hashPassword(password)]);
    res.status(201).json({ id: result.id, email, name, role: "admin" });
  } catch (error) { next(error); }
});

app.post("/auth/login", loginRateLimit, async (req, res, next) => {
  try {
    const user = await dbGet("SELECT * FROM users WHERE email = ? AND active = 1", [normalizeEmail(req.body?.email)]);
    if (!user || !(await verifyPassword(req.body?.password || "", user.password_hash))) return res.status(401).json({ error: "invalid_credentials" });
    const token = createSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000).toISOString();
    await dbRun("INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)", [user.id, hashToken(token), expiresAt]);
    attempts.delete(req.ip || "unknown"); res.json({ token, user: publicUser(user) });
  } catch (error) { next(error); }
});
app.get("/auth/me", requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));
app.post("/auth/logout", requireAuth, async (req, res, next) => { try { await dbRun("DELETE FROM sessions WHERE token_hash = ?", [req.sessionTokenHash]); res.json({ success: true }); } catch (error) { next(error); } });
app.put("/auth/password", requireAuth, async (req, res, next) => {
  try {
    const record = await dbGet("SELECT password_hash FROM users WHERE id = ?", [req.user.id]);
    if (!(await verifyPassword(req.body?.currentPassword || "", record.password_hash))) return res.status(400).json({ error: "invalid_current_password" });
    if (!isStrongPassword(req.body?.newPassword)) return res.status(400).json({ error: "weak_password" });
    await dbRun("UPDATE users SET password_hash = ? WHERE id = ?", [await hashPassword(req.body.newPassword), req.user.id]);
    await dbRun("DELETE FROM sessions WHERE user_id = ? AND token_hash <> ?", [req.user.id, req.sessionTokenHash]);
    res.json({ success: true });
  } catch (error) { next(error); }
});

app.get("/users", requireAuth, requireAdmin, async (_req, res, next) => { try { res.json(await dbAll("SELECT id, email, name, department, role, active, created_at FROM users ORDER BY name")); } catch (error) { next(error); } });
app.post("/users", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email); const name = clean(req.body?.name, 80); const department = clean(req.body?.department, 20); const password = req.body?.password; const role = req.body?.role === "admin" ? "admin" : "resident";
    if (!email.includes("@") || !name || (role === "resident" && !department) || !isStrongPassword(password)) return res.status(400).json({ error: "invalid_user_data" });
    const result = await dbRun("INSERT INTO users (email, name, department, role, password_hash) VALUES (?, ?, ?, ?, ?)", [email, name, department || null, role, await hashPassword(password)]);
    res.status(201).json({ id: result.id, email, name, department, role, active: true });
  } catch (error) { if (error.code === "SQLITE_CONSTRAINT") return res.status(409).json({ error: "email_exists" }); next(error); }
});
app.put("/users/:id/status", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id); const active = Boolean(req.body?.active);
    if (id === req.user.id && !active) return res.status(400).json({ error: "cannot_disable_self" });
    const result = await dbRun("UPDATE users SET active = ? WHERE id = ?", [active, id]);
    if (!result.changes) return res.status(404).json({ error: "not_found" });
    if (!active) await dbRun("DELETE FROM sessions WHERE user_id = ?", [id]);
    res.json({ success: true, active: Boolean(active) });
  } catch (error) { next(error); }
});

app.get("/mascotas", requireAuth, async (req, res, next) => {
  try {
    const admin = req.user.role === "admin";
    const sql = `SELECT m.*, u.name AS owner_name, u.email AS owner_email FROM mascotas m LEFT JOIN users u ON u.id = m.user_id ${admin ? "" : "WHERE m.user_id = ?"} ORDER BY m.id DESC`;
    res.json(await dbAll(sql, admin ? [] : [req.user.id]));
  } catch (error) { next(error); }
});
app.post("/mascotas", requireAuth, async (req, res, next) => {
  try {
    const pet = validatePet(req.body); if (!pet) return res.status(400).json({ error: "invalid_pet_data" });
    const ownerId = req.user.role === "admin" && Number(req.body?.userId) ? Number(req.body.userId) : req.user.id;
    const owner = await dbGet("SELECT id, department FROM users WHERE id = ? AND active = 1", [ownerId]);
    if (!owner) return res.status(400).json({ error: "invalid_owner" });
    if (req.user.role === "resident") pet.departamento = req.user.department;
    const result = await dbRun("INSERT INTO mascotas (nombre, tipo, departamento, contacto, user_id) VALUES (?, ?, ?, ?, ?)", [pet.nombre, pet.tipo, pet.departamento, pet.contacto, ownerId]);
    res.status(201).json({ id: result.id, ...pet, user_id: ownerId });
  } catch (error) { next(error); }
});
async function ownedPet(req, res, next) {
  try {
    const pet = await dbGet("SELECT * FROM mascotas WHERE id = ?", [Number(req.params.id)]);
    if (!pet) return res.status(404).json({ error: "not_found" });
    if (req.user.role !== "admin" && pet.user_id !== req.user.id) return res.status(403).json({ error: "forbidden" });
    req.pet = pet; next();
  } catch (error) { next(error); }
}
app.put("/mascotas/:id", requireAuth, ownedPet, async (req, res, next) => {
  try {
    const pet = validatePet(req.body); if (!pet) return res.status(400).json({ error: "invalid_pet_data" });
    if (req.user.role === "resident") pet.departamento = req.user.department;
    await dbRun("UPDATE mascotas SET nombre = ?, tipo = ?, departamento = ?, contacto = ? WHERE id = ?", [pet.nombre, pet.tipo, pet.departamento, pet.contacto, req.pet.id]);
    res.json({ id: req.pet.id, ...pet, user_id: req.pet.user_id });
  } catch (error) { next(error); }
});
app.delete("/mascotas/:id", requireAuth, ownedPet, async (req, res, next) => { try { await dbRun("DELETE FROM mascotas WHERE id = ?", [req.pet.id]); res.json({ success: true, id: req.pet.id }); } catch (error) { next(error); } });

app.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ error: "internal_error" }); });
app.listen(PORT, () => console.log(`API Mascotas Salitrera escuchando en puerto ${PORT}`));
