const Anthropic = require("@anthropic-ai/sdk");
const { buildSystemPrompt } = require("../utils/systemPrompt");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5";
const MAX_HISTORY_MESSAGES = 12; // keep last N messages to control token usage

/**
 * Sends the conversation to Claude, grounded in cafeData, and returns the
 * assistant's reply text.
 *
 * @param {Array<{role: 'user'|'assistant', content: string}>} messages
 * @param {Object} cafeData
 * @returns {Promise<string>}
 */
async function getChatResponse(messages, cafeData) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("MISSING_API_KEY");
  }

  const trimmedHistory = messages.slice(-MAX_HISTORY_MESSAGES);
  const systemPrompt = buildSystemPrompt(cafeData);

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 500,
    system: systemPrompt,
    messages: trimmedHistory.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock ? textBlock.text : "Sorry, I couldn't generate a response. Please contact the cafe directly.";
}

module.exports = { getChatResponse };
