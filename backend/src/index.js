import express from "express";
import cors from "cors";
import { openDb, initDb } from "./db.js";
import { createSessionToken, hashPassword, hashToken, isStrongPassword, verifyPassword } from "./security.js";

const app = express();
app.disable("x-powered-by");
const PORT = Number(process.env.PORT || 3000);
const db = openDb(process.env.DB_PATH || "./data/mascotas.db");
const SESSION_DAYS = Math.max(1, Number(process.env.SESSION_DAYS || 30));
const origins = (process.env.ALLOWED_ORIGINS || "").split(",").map((v) => v.trim()).filter(Boolean);
const allowedOrigins = new Set(["http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:3000", "https://localhost", ...origins]);
await initDb(db);
const get = (sql, p = []) => new Promise((ok, no) => db.get(sql, p, (e, r) => e ? no(e) : ok(r)));
const all = (sql, p = []) => new Promise((ok, no) => db.all(sql, p, (e, r) => e ? no(e) : ok(r || [])));
const run = (sql, p = []) => new Promise((ok, no) => db.run(sql, p, function done(e) { e ? no(e) : ok({ id: this.lastID, changes: this.changes }); }));

app.use(cors({ origin(origin, cb) { !origin || allowedOrigins.has(origin) ? cb(null, true) : cb(new Error("Origen no permitido")); }, methods: ["GET","POST","PUT","DELETE","OPTIONS"], allowedHeaders: ["Content-Type","Authorization"] }));
app.use(express.json({ limit: "3mb" }));
app.use((_req, res, next) => { res.set({ "X-Content-Type-Options":"nosniff", "X-Frame-Options":"DENY", "Referrer-Policy":"no-referrer", "Cache-Control":"no-store" }); next(); });

const attempts = new Map();
function rate(req, res, next) { const k=req.ip||"unknown", now=Date.now(), a=(attempts.get(k)||[]).filter(t=>now-t<900000); if(a.length>=15) return res.status(429).json({error:"too_many_attempts"}); a.push(now); attempts.set(k,a); next(); }
const clean = (v,n=200) => String(v ?? "").trim().slice(0,n);
const email = (v) => clean(v,120).toLowerCase();
const image = (v) => { const s=String(v||""); return /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(s) && s.length<2200000 ? s : null; };
const publicUser = (u) => ({ id:u.id,email:u.email,name:u.name,department:u.department,phone:u.phone,tower:u.tower,avatar_data:u.avatar_data,bio:u.bio,role:u.role,active:Boolean(u.active ?? 1),created_at:u.created_at });
async function auth(req,res,next) {
  try { const [s,t]=String(req.headers.authorization||"").split(" "); if(s!=="Bearer"||!t) return res.status(401).json({error:"authentication_required"});
    const u=await get("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.active=1",[hashToken(t),new Date().toISOString()]);
    if(!u) return res.status(401).json({error:"invalid_session"}); req.user=u; req.tokenHash=hashToken(t); next();
  } catch(e){next(e);}
}
const admin = (req,res,next) => req.user.role==="admin" ? next() : res.status(403).json({error:"admin_required"});
function userData(b) { return { name:clean(b?.name,80), email:email(b?.email), phone:clean(b?.phone,30), tower:clean(b?.tower,40), department:clean(b?.department,20), avatar_data:image(b?.avatar_data), bio:clean(b?.bio,300) }; }
function petData(b) { return { nombre:clean(b?.nombre,80), tipo:clean(b?.tipo,20).toLowerCase(), breed:clean(b?.breed,60), birth_date:clean(b?.birth_date,10)||null, color:clean(b?.color,40), status:clean(b?.status,30)||"En casa", notes:clean(b?.notes,500), photo_data:image(b?.photo_data), is_lost:Boolean(b?.is_lost), lost_details:clean(b?.lost_details,500) }; }
const validUser = (u) => u.name.length>=3 && u.email.includes("@") && u.phone.length>=7 && u.tower && u.department;
const validPet = (p) => p.nombre.length>=2 && ["perro","gato","ave","conejo","otro"].includes(p.tipo);

app.get("/",(_q,r)=>r.json({name:"Mascotas Salitrera API",status:"ok"})); app.get("/health",(_q,r)=>r.json({ok:true}));
app.post("/auth/register",rate,async(req,res,next)=>{try{const u=userData(req.body),password=req.body?.password;if(!validUser(u)||!isStrongPassword(password))return res.status(400).json({error:"invalid_user_data"});const x=await run("INSERT INTO users (email,name,department,phone,tower,avatar_data,bio,role,password_hash) VALUES (?,?,?,?,?,?,?,'resident',?)",[u.email,u.name,u.department,u.phone,u.tower,u.avatar_data,u.bio,await hashPassword(password)]);res.status(201).json({id:x.id,...u,role:"resident",active:true});}catch(e){if(String(e.code).includes("CONSTRAINT")||e.code==="23505")return res.status(409).json({error:"email_exists"});next(e);}});
app.post("/auth/bootstrap",async(req,res,next)=>{try{const n=await get("SELECT COUNT(*) total FROM users");if(Number(n.total)>0)return res.status(409).json({error:"already_initialized"});if(!process.env.BOOTSTRAP_SECRET||req.body?.bootstrapSecret!==process.env.BOOTSTRAP_SECRET)return res.status(403).json({error:"invalid_bootstrap_secret"});const u=userData(req.body),password=req.body?.password;if(!u.name||!u.email.includes("@")||!isStrongPassword(password))return res.status(400).json({error:"invalid_user_data"});const x=await run("INSERT INTO users (email,name,role,password_hash) VALUES (?,?,'admin',?)",[u.email,u.name,await hashPassword(password)]);res.status(201).json({id:x.id,...u,role:"admin"});}catch(e){next(e);}});
app.post("/auth/login",rate,async(req,res,next)=>{try{const u=await get("SELECT * FROM users WHERE email=? AND active=1",[email(req.body?.email)]);if(!u||!(await verifyPassword(req.body?.password||"",u.password_hash)))return res.status(401).json({error:"invalid_credentials"});const token=createSessionToken(),expires=new Date(Date.now()+SESSION_DAYS*86400000).toISOString();await run("INSERT INTO sessions (user_id,token_hash,expires_at) VALUES (?,?,?)",[u.id,hashToken(token),expires]);res.json({token,user:publicUser(u)});}catch(e){next(e);}});
app.get("/auth/me",auth,(req,res)=>res.json({user:publicUser(req.user)}));
app.post("/auth/logout",auth,async(req,res,next)=>{try{await run("DELETE FROM sessions WHERE token_hash=?",[req.tokenHash]);res.json({success:true});}catch(e){next(e);}});
app.put("/auth/password",auth,async(req,res,next)=>{try{const u=await get("SELECT password_hash FROM users WHERE id=?",[req.user.id]);if(!(await verifyPassword(req.body?.currentPassword||"",u.password_hash)))return res.status(400).json({error:"invalid_current_password"});if(!isStrongPassword(req.body?.newPassword))return res.status(400).json({error:"weak_password"});await run("UPDATE users SET password_hash=? WHERE id=?",[await hashPassword(req.body.newPassword),req.user.id]);res.json({success:true});}catch(e){next(e);}});

app.get("/users",auth,async(_req,res,next)=>{try{res.json(await all("SELECT id,email,name,department,phone,tower,avatar_data,bio,role,active,created_at FROM users WHERE active=1 ORDER BY name"));}catch(e){next(e);}});
app.put("/users/me",auth,async(req,res,next)=>{try{const u=userData({...req.body,email:req.user.email});if(!validUser(u))return res.status(400).json({error:"invalid_user_data"});await run("UPDATE users SET name=?,department=?,phone=?,tower=?,avatar_data=?,bio=? WHERE id=?",[u.name,u.department,u.phone,u.tower,u.avatar_data,u.bio,req.user.id]);res.json({user:{...publicUser(req.user),...u}});}catch(e){next(e);}});
app.post("/users",auth,admin,async(req,res,next)=>{try{const u=userData(req.body),password=req.body?.password;if(!validUser(u)||!isStrongPassword(password))return res.status(400).json({error:"invalid_user_data"});const x=await run("INSERT INTO users (email,name,department,phone,tower,avatar_data,bio,role,password_hash) VALUES (?,?,?,?,?,?,?,'resident',?)",[u.email,u.name,u.department,u.phone,u.tower,u.avatar_data,u.bio,await hashPassword(password)]);res.status(201).json({id:x.id,...u,role:"resident",active:true});}catch(e){next(e);}});
app.put("/users/:id/status",auth,admin,async(req,res,next)=>{try{const active=Boolean(req.body?.active);if(Number(req.params.id)===req.user.id&&!active)return res.status(400).json({error:"cannot_disable_self"});await run("UPDATE users SET active=? WHERE id=?",[active,Number(req.params.id)]);res.json({success:true});}catch(e){next(e);}});

const petSelect="SELECT m.*,u.name owner_name,u.email owner_email,u.phone owner_phone,u.tower owner_tower,u.avatar_data owner_avatar FROM mascotas m LEFT JOIN users u ON u.id=m.user_id";
app.get("/mascotas",auth,async(_req,res,next)=>{try{res.json(await all(petSelect+" ORDER BY m.id DESC"));}catch(e){next(e);}});
app.post("/mascotas",auth,async(req,res,next)=>{try{const p=petData(req.body);if(!validPet(p))return res.status(400).json({error:"invalid_pet_data"});const ownerId=req.user.role==="admin"&&Number(req.body?.userId)||req.user.id;const owner=await get("SELECT * FROM users WHERE id=? AND active=1",[ownerId]);if(!owner)return res.status(400).json({error:"invalid_owner"});const x=await run("INSERT INTO mascotas (nombre,tipo,departamento,contacto,user_id,breed,birth_date,color,status,notes,photo_data,is_lost,lost_details) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",[p.nombre,p.tipo,owner.department||"",owner.phone||"",ownerId,p.breed,p.birth_date,p.color,p.status,p.notes,p.photo_data,p.is_lost,p.lost_details]);res.status(201).json({id:x.id,...p,user_id:ownerId});}catch(e){next(e);}});
async function ownPet(req,res,next){try{const p=await get("SELECT * FROM mascotas WHERE id=?",[Number(req.params.id)]);if(!p)return res.status(404).json({error:"not_found"});if(req.user.role!=="admin"&&Number(p.user_id)!==Number(req.user.id))return res.status(403).json({error:"forbidden"});req.pet=p;next();}catch(e){next(e);}}
app.put("/mascotas/:id",auth,ownPet,async(req,res,next)=>{try{const p=petData(req.body);if(!validPet(p))return res.status(400).json({error:"invalid_pet_data"});await run("UPDATE mascotas SET nombre=?,tipo=?,breed=?,birth_date=?,color=?,status=?,notes=?,photo_data=?,is_lost=?,lost_details=? WHERE id=?",[p.nombre,p.tipo,p.breed,p.birth_date,p.color,p.status,p.notes,p.photo_data||req.pet.photo_data,p.is_lost,p.lost_details,req.pet.id]);res.json({id:req.pet.id,...p,user_id:req.pet.user_id});}catch(e){next(e);}});
app.delete("/mascotas/:id",auth,ownPet,async(req,res,next)=>{try{await run("DELETE FROM mascotas WHERE id=?",[req.pet.id]);res.json({success:true});}catch(e){next(e);}});

app.get("/messages",auth,async(_req,res,next)=>{try{res.json(await all("SELECT m.*,u.name user_name,u.avatar_data user_avatar FROM messages m JOIN users u ON u.id=m.user_id ORDER BY m.id DESC LIMIT 100"));}catch(e){next(e);}});
app.post("/messages",auth,async(req,res,next)=>{try{const content=clean(req.body?.content,500);if(content.length<1)return res.status(400).json({error:"invalid_message"});const x=await run("INSERT INTO messages (user_id,content) VALUES (?,?)",[req.user.id,content]);res.status(201).json({id:x.id,user_id:req.user.id,user_name:req.user.name,user_avatar:req.user.avatar_data,content,created_at:new Date().toISOString()});}catch(e){next(e);}});
app.delete("/messages/:id",auth,async(req,res,next)=>{try{const m=await get("SELECT * FROM messages WHERE id=?",[Number(req.params.id)]);if(!m)return res.status(404).json({error:"not_found"});if(req.user.role!=="admin"&&Number(m.user_id)!==Number(req.user.id))return res.status(403).json({error:"forbidden"});await run("DELETE FROM messages WHERE id=?",[m.id]);res.json({success:true});}catch(e){next(e);}});

app.use((error,_req,res,_next)=>{console.error(error);res.status(500).json({error:"internal_error"});});
app.listen(PORT,()=>console.log(`API Mascotas Salitrera escuchando en puerto ${PORT}`));
