/**
 * AI Controller — Express route handlers for all AI endpoints.
 * Lives inside the IDURAR backend, uses the same auth middleware.
 */

const { chat } = require('./chatService');
const { parseTransaction } = require('./parser');
const { generateInsights } = require('./insights');

/**
 * POST /api/ai/chat
 * Body: { message: string, history: [{ role, content }] }
 */
const logger = require('@/utils/logger');

const chatHandler = async (req, res) => {
  try {
    let userMessage = req.body.message;
    let history = req.body.history || [];

    if (Array.isArray(req.body.messages) && req.body.messages.length > 0) {
      const lastMsg = req.body.messages[req.body.messages.length - 1];
      if (!userMessage) userMessage = lastMsg?.content;
      history = req.body.messages.slice(0, -1);
    }

    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Message is required',
      });
    }

    const adminId = req.admin?._id;
    const result = await chat(userMessage, history, adminId);

    return res.status(200).json({
      success: true,
      result: {
        response: result.response,
        tool_calls_made: result.tool_calls_made || [],
        action_proposal: result.action_proposal || null,
      },
      message: 'Chat processed successfully',
    });
  } catch (err) {
    logger.error('AI Chat Controller Error: %s', err.stack || err.message || JSON.stringify(err));
    return res.status(200).json({
      success: false,
      result: {
        response: 'The AI assistant is temporarily busy or rate-limited. Please try rephrasing your prompt or try again in a moment.',
        tool_calls_made: [],
        action_proposal: null,
      },
      message: 'The AI service is temporarily busy. Please try again in a moment.',
    });
  }
};

/**
 * POST /api/ai/parse-transaction
 * Body: { text: string }
 */
const parseTransactionHandler = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Transaction text is required',
      });
    }

    const result = await parseTransaction(text);

    return res.status(200).json({
      success: true,
      result,
      message: 'Transaction parsed successfully',
    });
  } catch (err) {
    console.error('AI Parse Error:', err);
    return res.status(500).json({
      success: false,
      result: null,
      message: `Transaction parsing failed: ${err.message}`,
    });
  }
};

/**
 * GET /api/ai/insights
 */
const insightsHandler = async (req, res) => {
  try {
    const adminId = req.admin?._id;
    const result = await generateInsights(adminId);

    return res.status(200).json({
      success: true,
      result,
      message: 'Insights generated successfully',
    });
  } catch (err) {
    console.error('AI Insights Error:', err);
    return res.status(500).json({
      success: false,
      result: null,
      message: `Insights generation failed: ${err.message}`,
    });
  }
};

module.exports = {
  chatHandler,
  parseTransactionHandler,
  insightsHandler,
};
