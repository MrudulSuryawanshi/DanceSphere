import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";
import { requireAuth, allowRoles } from "./middleware.js";
dotenv.config();
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));
const asyncRoute = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
const safeUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
});
app.get("/api/health", (req, res) =>
  res.json({ ok: true, service: "DanceSphere API" }),
);
app.post(
  "/api/auth/register",
  asyncRoute(async (req, res) => {
    const { name, email, password, role = "student" } = req.body;
    if (!name || !email || !password || password.length < 8)
      return res
        .status(400)
        .json({
          message:
            "Name, email and a password of at least 8 characters are required",
        });
    if (!["student", "owner"].includes(role))
      return res
        .status(400)
        .json({
          message:
            "Public registration is only available for students and owners",
        });
    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email=?",
      [email.toLowerCase()],
    );
    if (existing.length)
      return res
        .status(409)
        .json({ message: "An account with this email already exists" });
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      "INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)",
      [name.trim(), email.toLowerCase(), hash, role],
    );
    const user = {
      id: result.insertId,
      name: name.trim(),
      email: email.toLowerCase(),
      role,
    };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.status(201).json({ user, token });
  }),
);
app.post(
  "/api/auth/login",
  asyncRoute(async (req, res) => {
    const { email, password, role } = req.body;
    const [rows] = await pool.execute("SELECT * FROM users WHERE email=?", [
      String(email || "").toLowerCase(),
    ]);
    const u = rows[0];
    if (
      !u ||
      !(await bcrypt.compare(password || "", u.password_hash)) ||
      (role && u.role !== role)
    )
      return res
        .status(401)
        .json({ message: "Email, password or role is incorrect" });
    const user = safeUser(u);
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.json({ user, token });
  }),
);
app.get(
  "/api/auth/me",
  requireAuth,
  asyncRoute(async (req, res) => {
    const [rows] = await pool.execute(
      "SELECT id,name,email,role FROM users WHERE id=?",
      [req.user.id],
    );
    if (!rows.length)
      return res.status(404).json({ message: "User not found" });
    res.json({ user: rows[0] });
  }),
);
app.get(
  "/api/cities",
  asyncRoute(async (req, res) => {
    const [rows] = await pool.execute(
      "SELECT id,name FROM cities ORDER BY name",
    );
    res.json(rows);
  }),
);
app.get(
  "/api/categories",
  asyncRoute(async (req, res) => {
    const [rows] = await pool.execute(
      "SELECT id,name,description FROM categories ORDER BY name",
    );
    res.json(rows);
  }),
);
app.get(
  "/api/classes",
  asyncRoute(async (req, res) => {
    const { city, category, q, sort = "featured", maxFee } = req.query;
    let sql = `SELECT c.id,c.name,c.description,c.fee,c.level,c.timing,c.duration,c.age_group AS age,c.image_url AS image,c.status,c.instructor,s.name AS studio,ci.name AS city,ca.name AS category FROM dance_classes c JOIN studios s ON c.studio_id=s.id JOIN cities ci ON c.city_id=ci.id JOIN categories ca ON c.category_id=ca.id WHERE c.status='approved'`;
    const values = [];
    if (city && city !== "All cities") {
      sql += " AND ci.name=?";
      values.push(city);
    }
    if (category && category !== "All styles") {
      sql += " AND ca.name=?";
      values.push(category);
    }
    if (q) {
      sql +=
        " AND (c.name LIKE ? OR s.name LIKE ? OR c.instructor LIKE ? OR ca.name LIKE ? OR ci.name LIKE ?)";
      for (let i = 0; i < 5; i++) values.push(`%${q}%`);
    }
    if (maxFee) {
      sql += " AND c.fee<=?";
      values.push(Number(maxFee));
    }
    const sorts = {
      "fee-low": "c.fee ASC",
      "fee-high": "c.fee DESC",
      name: "c.name ASC",
      featured: "c.created_at DESC",
    };
    sql += ` ORDER BY ${sorts[sort] || sorts.featured}`;
    const [rows] = await pool.execute(sql, values);
    res.json(rows);
  }),
);
app.get(
  "/api/classes/:id",
  asyncRoute(async (req, res) => {
    const [rows] = await pool.execute(
      `SELECT c.id,c.name,c.description,c.fee,c.level,c.timing,c.duration,c.age_group AS age,c.image_url AS image,c.status,c.instructor,s.name AS studio,ci.name AS city,ca.name AS category FROM dance_classes c JOIN studios s ON c.studio_id=s.id JOIN cities ci ON c.city_id=ci.id JOIN categories ca ON c.category_id=ca.id WHERE c.id=? AND c.status='approved'`,
      [req.params.id],
    );
    if (!rows.length)
      return res.status(404).json({ message: "Class not found" });
    res.json(rows[0]);
  }),
);
app.post(
  "/api/classes",
  requireAuth,
  allowRoles("owner", "admin"),
  asyncRoute(async (req, res) => {
    const {
      name,
      description,
      fee,
      level = "Beginner",
      timing,
      duration = "60 min",
      age = "16+",
      image,
      city,
      category,
      instructor,
    } = req.body;
    if (
      !name ||
      !description ||
      !Number.isFinite(Number(fee)) ||
      Number(fee) <= 0 ||
      !city ||
      !category
    )
      return res
        .status(400)
        .json({
          message:
            "Name, description, positive fee, city and category are required",
        });
    let studioId;
    if (req.user.role === "owner") {
      const [s] = await pool.execute(
        "SELECT id FROM studios WHERE owner_id=?",
        [req.user.id],
      );
      if (!s.length)
        return res
          .status(400)
          .json({ message: "Create a studio profile before adding classes" });
      studioId = s[0].id;
    } else {
      studioId = Number(req.body.studioId);
    }
    const [[ci]] = await pool.execute("SELECT id FROM cities WHERE name=?", [
      city,
    ]);
    const [[ca]] = await pool.execute(
      "SELECT id FROM categories WHERE name=?",
      [category],
    );
    if (!ci || !ca)
      return res.status(400).json({ message: "Unknown city or category" });
    const [r] = await pool.execute(
      "INSERT INTO dance_classes(studio_id,city_id,category_id,name,description,fee,level,timing,duration,age_group,instructor,image_url,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        studioId,
        ci.id,
        ca.id,
        name,
        description,
        Number(fee),
        level,
        timing,
        duration,
        age,
        instructor || null,
        image || null,
        "pending",
      ],
    );
    res
      .status(201)
      .json({
        id: r.insertId,
        status: "pending",
        message: "Class submitted for review",
      });
  }),
);
app.put(
  "/api/classes/:id",
  requireAuth,
  allowRoles("owner", "admin"),
  asyncRoute(async (req, res) => {
    const [owned] = await pool.execute(
      "SELECT c.id,c.studio_id,s.owner_id FROM dance_classes c JOIN studios s ON c.studio_id=s.id WHERE c.id=?",
      [req.params.id],
    );
    if (!owned.length)
      return res.status(404).json({ message: "Class not found" });
    if (req.user.role === "owner" && owned[0].owner_id !== req.user.id)
      return res
        .status(403)
        .json({ message: "You can only edit your own studio classes" });
    const b = req.body;
    const [[ci]] = await pool.execute("SELECT id FROM cities WHERE name=?", [
      b.city,
    ]);
    const [[ca]] = await pool.execute(
      "SELECT id FROM categories WHERE name=?",
      [b.category],
    );
    if (!ci || !ca)
      return res.status(400).json({ message: "Unknown city or category" });
    await pool.execute(
      "UPDATE dance_classes SET city_id=?,category_id=?,name=?,description=?,fee=?,level=?,timing=?,duration=?,age_group=?,instructor=?,image_url=?,status=? WHERE id=?",
      [
        ci.id,
        ca.id,
        b.name,
        b.description,
        Number(b.fee),
        b.level || "Beginner",
        b.timing,
        b.duration || "60 min",
        b.age || "16+",
        b.instructor || null,
        b.image || null,
        req.user.role === "admin" ? b.status || "pending" : "pending",
        req.params.id,
      ],
    );
    res.json({
      message: "Class updated",
      status: req.user.role === "admin" ? b.status || "pending" : "pending",
    });
  }),
);
app.delete(
  "/api/classes/:id",
  requireAuth,
  allowRoles("owner", "admin"),
  asyncRoute(async (req, res) => {
    const [rows] = await pool.execute(
      "SELECT c.id,s.owner_id FROM dance_classes c JOIN studios s ON c.studio_id=s.id WHERE c.id=?",
      [req.params.id],
    );
    if (!rows.length)
      return res.status(404).json({ message: "Class not found" });
    if (req.user.role === "owner" && rows[0].owner_id !== req.user.id)
      return res
        .status(403)
        .json({ message: "You can only delete your own classes" });
    await pool.execute("DELETE FROM dance_classes WHERE id=?", [req.params.id]);
    res.json({ message: "Class deleted" });
  }),
);
app.post(
  "/api/enquiries",
  asyncRoute(async (req, res) => {
    const { classId, name, email, message } = req.body;
    if (
      !classId ||
      !name ||
      !email ||
      !message ||
      String(message).trim().length < 5
    )
      return res
        .status(400)
        .json({
          message:
            "Class, name, valid email and a message of at least 5 characters are required",
        });
    const [r] = await pool.execute(
      "INSERT INTO enquiries(class_id,name,email,message,status) VALUES(?,?,?,?,?)",
      [
        classId,
        String(name).trim(),
        String(email).toLowerCase(),
        String(message).trim(),
        "new",
      ],
    );
    res.status(201).json({ id: r.insertId, message: "Enquiry submitted" });
  }),
);
app.get(
  "/api/enquiries/my",
  requireAuth,
  asyncRoute(async (req, res) => {
    const [rows] = await pool.execute(
      "SELECT e.id,e.name,e.email,e.message,e.status,e.created_at,c.name AS class_name FROM enquiries e JOIN dance_classes c ON c.id=e.class_id WHERE e.email=? ORDER BY e.created_at DESC",
      [req.user.email],
    );
    res.json(rows);
  }),
);
app.get(
  "/api/owner/enquiries",
  requireAuth,
  allowRoles("owner"),
  asyncRoute(async (req, res) => {
    const [rows] = await pool.execute(
      "SELECT e.id,e.name,e.email,e.message,e.status,e.created_at,c.name AS class_name FROM enquiries e JOIN dance_classes c ON c.id=e.class_id JOIN studios s ON s.id=c.studio_id WHERE s.owner_id=? ORDER BY e.created_at DESC",
      [req.user.id],
    );
    res.json(rows);
  }),
);
app.patch(
  "/api/owner/enquiries/:id",
  requireAuth,
  allowRoles("owner"),
  asyncRoute(async (req, res) => {
    const { status } = req.body;
    if (!["new", "contacted", "closed"].includes(status))
      return res.status(400).json({ message: "Invalid enquiry status" });
    const [r] = await pool.execute(
      "UPDATE enquiries e JOIN dance_classes c ON e.class_id=c.id JOIN studios s ON c.studio_id=s.id SET e.status=? WHERE e.id=? AND s.owner_id=?",
      [status, req.params.id, req.user.id],
    );
    if (!r.affectedRows)
      return res
        .status(404)
        .json({ message: "Enquiry not found for your studio" });
    res.json({ message: "Enquiry status updated" });
  }),
);
app.get(
  "/api/admin/stats",
  requireAuth,
  allowRoles("admin"),
  asyncRoute(async (req, res) => {
    const [[users]] = await pool.execute("SELECT COUNT(*) AS total FROM users");
    const [[studios]] = await pool.execute(
      "SELECT COUNT(*) AS total FROM studios",
    );
    const [[classes]] = await pool.execute(
      "SELECT COUNT(*) AS total FROM dance_classes",
    );
    const [[pending]] = await pool.execute(
      "SELECT COUNT(*) AS total FROM dance_classes WHERE status='pending'",
    );
    res.json({
      users: users.total,
      studios: studios.total,
      classes: classes.total,
      pending: pending.total,
    });
  }),
);
app.get(
  "/api/admin/users",
  requireAuth,
  allowRoles("admin"),
  asyncRoute(async (req, res) => {
    const [rows] = await pool.execute(
      "SELECT id,name,email,role,created_at FROM users ORDER BY created_at DESC",
    );
    res.json(rows);
  }),
);
app.patch(
  "/api/admin/classes/:id/approval",
  requireAuth,
  allowRoles("admin"),
  asyncRoute(async (req, res) => {
    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status))
      return res
        .status(400)
        .json({ message: "Status must be approved, rejected or pending" });
    const [r] = await pool.execute(
      "UPDATE dance_classes SET status=? WHERE id=?",
      [status, req.params.id],
    );
    if (!r.affectedRows)
      return res.status(404).json({ message: "Class not found" });
    res.json({ message: "Listing status updated", status });
  }),
);
app.use((req, res) => res.status(404).json({ message: "API route not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({
      message:
        "Unexpected server error. Check server logs and database configuration.",
    });
});
const port = Number(process.env.PORT || 3000);
app.listen(port, () =>
  console.log(`DanceSphere API listening on http://localhost:${port}`),
);
