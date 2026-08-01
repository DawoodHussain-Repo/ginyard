const express = require('express');
const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const aiController = require('@/controllers/appControllers/aiController');

// POST /api/ai/chat — main conversation endpoint
router.route('/ai/chat').post(catchErrors(aiController.chatHandler));

// POST /api/ai/parse-transaction — NL → structured data
router.route('/ai/parse-transaction').post(catchErrors(aiController.parseTransactionHandler));

// GET /api/ai/insights — proactive financial insights
router.route('/ai/insights').get(catchErrors(aiController.insightsHandler));

module.exports = router;
