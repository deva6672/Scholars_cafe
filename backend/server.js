require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const chatRoutes = require("./routes/chat");
const adminRoutes = require("./routes/admin");
const publicRoutes = require("./routes/public");

const app = express();
const PORT = process.env.PORT || 5001;

// ---- Security & parsing middleware ----
app.use(helmet());
app.use(express.json({ limit: "100kb" }));

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

const isDevelopment = process.env.NODE_ENV !== "production";

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || isDevelopment) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

// Global rate limiter (in addition to the stricter one on /api/chat)
const globalLimiter = rateLimit({
  windowMs: (Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", globalLimiter);

// ---- Routes ----
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "The Scholars Cafe Chatbot API" });
});

app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", publicRoutes);

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ---- Global error handler ----
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "Origin not allowed." });
  }
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`✅ The Scholars Cafe Chatbot API running on port ${PORT}`);
});
