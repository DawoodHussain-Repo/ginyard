/**
 * Natural language transaction parser.
 * Takes plain English like "Paid $340 to Fiverr for logo design yesterday"
 * and extracts structured transaction data using Groq.
 */

const Groq = require('groq-sdk');

function buildParsePrompt() {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  return `You are a transaction parser. Given a natural language description of a financial transaction, extract the following fields into a JSON object:

- "type": either "expense" or "income"
- "vendor": the company or person involved (for expenses, who was paid; for income, who paid)
- "amount": the dollar amount as a number (no $ sign)
- "category": one of: "Software & Subscriptions", "Marketing", "Office Supplies", "Travel", "Professional Services", "Utilities", "Equipment", "Miscellaneous"
- "date": the date in YYYY-MM-DD format. "Today" means ${today}. "Yesterday" means ${yesterday}. Interpret relative dates accordingly.
- "description": a brief description of what the transaction was for

If any field cannot be determined from the input, use null for that field.
Always respond with ONLY the JSON object, no additional text.

Examples:
Input: "Paid $340 to Fiverr for logo design yesterday"
Output: {"type": "expense", "vendor": "Fiverr", "amount": 340, "category": "Professional Services", "date": "${yesterday}", "description": "Logo design"}

Input: "Received $2000 from Acme Corp for consulting work on June 15"
Output: {"type": "income", "vendor": "Acme Corp", "amount": 2000, "category": "Professional Services", "date": "2024-06-15", "description": "Consulting work"}

Input: "Spent $49.99 on Notion subscription"
Output: {"type": "expense", "vendor": "Notion", "amount": 49.99, "category": "Software & Subscriptions", "date": "${today}", "description": "Notion subscription"}`;
}

async function parseTransaction(text) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const response = await groq.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: buildParsePrompt() },
      { role: 'user', content: text },
    ],
    temperature: 0.0,
    max_tokens: 512,
  });

  let content = (response.choices[0].message.content || '').trim();

  // Strip markdown code fences if present
  if (content.startsWith('```')) {
    content = content.split('\n').slice(1).join('\n');
  }
  if (content.endsWith('```')) {
    content = content.slice(0, -3);
  }
  content = content.trim();

  try {
    return JSON.parse(content);
  } catch (e) {
    return { error: 'Could not parse transaction', raw_response: content };
  }
}

module.exports = { parseTransaction };
