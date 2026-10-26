const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");
const { validateLoginRequest } = require("../middleware/validate");
const { requireAdminAuth } = require("../middleware/auth");
const { getCafeData, updateCafeData, replaceCafeData } = require("../services/dataService");

const router = express.Router();

// Constant-time string comparison to avoid timing attacks on login
function safeCompare(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts. Please try again later." },
});

// POST /api/admin/login
router.post("/login", loginLimiter, validateLoginRequest, (req, res) => {
  const { username, password } = req.body;

  const validUser = safeCompare(username, process.env.ADMIN_USERNAME || "");
  const validPass = safeCompare(password, process.env.ADMIN_PASSWORD || "");

  if (!validUser || !validPass) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const token = jwt.sign({ role: "admin", username }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  res.json({ token, expiresIn: "8h" });
});

// GET /api/admin/data  (full cafe data, for editing)
router.get("/data", requireAdminAuth, (req, res) => {
  res.json(getCafeData());
});

// PATCH /api/admin/data  (partial update - merges into existing data)
router.patch("/data", requireAdminAuth, (req, res) => {
  try {
    const updated = updateCafeData(req.body);
    res.json({ message: "Cafe data updated successfully.", data: updated });
  } catch (err) {
    console.error("Admin update error:", err.message);
    res.status(500).json({ error: "Failed to update cafe data." });
  }
});

// PUT /api/admin/data  (full replace - use with care, e.g. bulk menu import)
router.put("/data", requireAdminAuth, (req, res) => {
  try {
    const updated = replaceCafeData(req.body);
    res.json({ message: "Cafe data replaced successfully.", data: updated });
  } catch (err) {
    console.error("Admin replace error:", err.message);
    res.status(500).json({ error: "Failed to replace cafe data." });
  }
});

module.exports = router;
