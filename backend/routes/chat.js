const express = require("express");
const rateLimit = require("express-rate-limit");
const { validateChatRequest } = require("../middleware/validate");
const { getChatResponse } = require("../services/aiService");
const { getCafeData } = require("../services/dataService");

const router = express.Router();

// Stricter limiter just for the AI endpoint (protects your API budget)
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages sent too quickly. Please wait a moment and try again." },
});

router.post("/", chatLimiter, validateChatRequest, async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    const cafeData = getCafeData();

    const messages = [...history, { role: "user", content: message }];
    const reply = await getChatResponse(messages, cafeData);

    return res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err.message);

    if (err.message === "MISSING_API_KEY") {
      return res.status(503).json({
        reply:
          "Our chatbot isn't fully set up yet. Please contact The Scholars Cafe directly for now — we're sorry for the inconvenience!",
        error: "AI service not configured.",
      });
    }

    return res.status(500).json({
      reply:
        "Sorry, something went wrong on our end. Please try again in a moment, or contact The Scholars Cafe directly for immediate help.",
      error: "Internal server error.",
    });
  }
});

module.exports = router;
