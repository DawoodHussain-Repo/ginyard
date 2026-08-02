/**
 * Chat orchestration service.
 * Handles the full Groq tool-calling loop:
 *   user message → LLM → tool calls → execute → feed results back → final response
 */

const Groq = require('groq-sdk');
const { TOOL_DEFINITIONS } = require('./toolDefinitions');
const { executeTool } = require('./toolExecutor');
const { generateCompactSchemaSummary } = require('./mongooseSchemaReflect');

const BASE_SYSTEM_PROMPT = `You are Ledgerly AI, an intelligent financial assistant for a business accounting system.

## Your Role
- Help users understand their finances by answering questions with REAL data from their accounting system.
- Propose database actions (Invoices, Quotes, Expenses, Clients) with visual user confirmation modals.
- Provide clear, concise financial insights.

## Critical Rules
1. **EVERY number in your response MUST come from a tool call result.** Never estimate, approximate, round differently, or hallucinate financial figures. If you don't have the data, say so and offer to look it up.
2. When presenting financial data, use clear formatting with currency symbols ($ or PKR) and proper number formatting.
3. Keep responses concise but informative. Use bullet points for lists.
4. If a question is ambiguous, ask for clarification rather than guessing.
5. You are an observational/data-driven assistant. Do NOT give prescriptive investment or tax advice. Stick to reporting what the data shows.
6. When discussing trends (up/down), always state the specific numbers you're comparing.

## Entity Relationships & Business Rules
1. **Client Lookup & Deduplication**: An Invoice or Quote references a Client by name/ID. Always check if a Client exists by name before proposing a new Client record to prevent duplicate entries.
2. **Currencies & Default Rates**: Amounts are in the workspace base currency (default PKR or USD) unless explicitly specified. Tax defaults to 0% unless specified.
3. **Multi-Step Action Chaining**:
   - Worked Example 1: User says: "Create a new client Acme Corp and quote them for 15 fertilizer bags at 1000 PKR" -> Call \`propose_create_quote\` with client_name: "Acme Corp", items: [{ itemName: "Fertilizer bag", quantity: 15, price: 1000 }]. The system will auto-check client existence and present a preview modal.
   - Worked Example 2: User says: "Spent $340 at Fiverr for logo design yesterday" -> Call \`propose_create_expense\` with vendor: "Fiverr", amount: 340, category: "Professional Services".

## Available Tools
You have access to financial data tools. Use them to answer questions about expenses, income, cash flow, overdue invoices, top vendors, and to propose invoice/quote/client/expense creations. Always call the appropriate tool.`;

async function chat(userMessage, conversationHistory = [], adminId) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const candidateModels = Array.from(
    new Set([
      process.env.GROQ_MODEL,
      'llama-3.3-70b-versatile',
      'llama-3.1-70b-versatile',
      'llama-3.1-8b-instant',
      'gemma2-9b-it',
    ])
  ).filter(Boolean);

  const fullSystemPrompt = BASE_SYSTEM_PROMPT + generateCompactSchemaSummary();

  // Build message list with capped recent conversation history (last 6 messages)
  const messages = [{ role: 'system', content: fullSystemPrompt }];

  if (conversationHistory && conversationHistory.length > 0) {
    const recentHistory = conversationHistory.slice(-6);
    messages.push(...recentHistory);
  }

  messages.push({ role: 'user', content: userMessage });

  const toolCallsMade = [];
  const maxIterations = 5;
  let actionProposal = null;

  const getCompletion = async (reqMessages) => {
    let lastError = null;
    for (const modelCandidate of candidateModels) {
      try {
        return await groq.chat.completions.create({
          model: modelCandidate,
          messages: reqMessages,
          tools: TOOL_DEFINITIONS,
          tool_choice: 'auto',
          temperature: 0.1,
          max_tokens: 1024,
        });
      } catch (err) {
        lastError = err;
        if (err.status === 429 || err.message?.includes('rate_limit') || err.code === 'rate_limit_exceeded') {
          console.warn(`Groq model ${modelCandidate} hit rate limit. Trying next candidate model...`);
          continue;
        }
        if (err.status === 400 && (err.code === 'model_decommissioned' || err.message?.includes('decommissioned'))) {
          console.warn(`Groq model ${modelCandidate} is decommissioned. Trying next candidate model...`);
          continue;
        }
        throw err;
      }
    }
    throw lastError;
  };

  for (let i = 0; i < maxIterations; i++) {
    const response = await getCompletion(messages);

    const choice = response.choices[0];
    const message = choice.message;

    // If the model wants to call tools, execute them and loop
    if (message.tool_calls && message.tool_calls.length > 0) {
      // Add assistant's message (with tool_calls) to the conversation
      messages.push({
        role: 'assistant',
        content: message.content || '',
        tool_calls: message.tool_calls.map((tc) => ({
          id: tc.id,
          type: 'function',
          function: {
            name: tc.function.name,
            arguments: tc.function.arguments,
          },
        })),
      });

      // Execute each tool
      for (const toolCall of message.tool_calls) {
        const toolName = toolCall.function.name;
        let args = {};
        try {
          args = JSON.parse(toolCall.function.arguments);
        } catch (e) {
          // If arguments can't be parsed, pass empty object
        }

        toolCallsMade.push(toolName);

        const result = await executeTool(toolName, args, adminId);

        try {
          const parsedResult = JSON.parse(result);
          if (parsedResult && parsedResult.requires_approval) {
            actionProposal = parsedResult;
          }
        } catch (e) {
          // Non-json output
        }

        // Add tool result to conversation
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: result,
        });
      }

      // Continue loop — model will see tool results
      continue;
    }

    // No tool calls — this is the final response
    return {
      response: message.content || "I couldn't generate a response. Please try again.",
      tool_calls_made: toolCallsMade,
      action_proposal: actionProposal,
    };
  }

  // Hit iteration limit
  return {
    response:
      "I made several data lookups but couldn't fully answer your question. Please try rephrasing.",
    tool_calls_made: toolCallsMade,
    action_proposal: actionProposal,
  };
}

module.exports = { chat };
