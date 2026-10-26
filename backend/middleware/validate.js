const MAX_MESSAGE_LENGTH = 800;
const MAX_HISTORY_ITEMS = 40;

function validateChatRequest(req, res, next) {
  const { message, history } = req.body;

  if (typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "A non-empty 'message' string is required." });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      error: `Message too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`,
    });
  }

  if (history !== undefined) {
    if (!Array.isArray(history)) {
      return res.status(400).json({ error: "'history' must be an array." });
    }
    if (history.length > MAX_HISTORY_ITEMS) {
      return res.status(400).json({ error: "Conversation history too long." });
    }
    for (const item of history) {
      if (
        !item ||
        typeof item.content !== "string" ||
        !["user", "assistant"].includes(item.role) ||
        item.content.length > MAX_MESSAGE_LENGTH
      ) {
        return res.status(400).json({ error: "Invalid message in conversation history." });
      }
    }
  }

  // basic sanitization: strip null bytes
  req.body.message = message.replace(/\0/g, "").trim();
  next();
}

function validateLoginRequest(req, res, next) {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }
  next();
}

module.exports = { validateChatRequest, validateLoginRequest };
