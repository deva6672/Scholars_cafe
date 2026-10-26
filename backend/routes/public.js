const express = require("express");
const { getCafeData } = require("../services/dataService");

const router = express.Router();

// Full public cafe info (menu, hours, contact, etc) - used to render the
// website landing page and quick-reply buttons without needing the AI.
router.get("/cafe-info", (req, res) => {
  try {
    const data = getCafeData();
    res.json(data);
  } catch (err) {
    console.error("Failed to load cafe data:", err.message);
    res.status(500).json({ error: "Could not load cafe information." });
  }
});

module.exports = router;
