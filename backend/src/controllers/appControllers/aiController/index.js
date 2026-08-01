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
const chatHandler = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Message is required',
      });
    }

    const result = await chat(message, history);

    return res.status(200).json({
      success: true,
      result: {
        response: result.response,
        tool_calls_made: result.tool_calls_made || [],
      },
      message: 'Chat processed successfully',
    });
  } catch (err) {
    console.error('AI Chat Error:', err);
    return res.status(500).json({
      success: false,
      result: null,
      message: `Chat processing failed: ${err.message}`,
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
    const result = await generateInsights();

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
