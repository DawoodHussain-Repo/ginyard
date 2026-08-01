/**
 * Dynamic Mongoose Schema Inspector.
 * Programmatically inspects the 6 core Mongoose models:
 * Client, Invoice, Quote, Expense, Item, Payment.
 * Extracts field names, types, and enums directly at runtime.
 * Guarantees zero schema drift between Mongoose models and AI prompt context.
 */

const mongoose = require('mongoose');

function generateCompactSchemaSummary() {
  const modelNames = ['Client', 'Invoice', 'Quote', 'Expense', 'Item', 'Payment'];
  const summaries = [];

  for (const name of modelNames) {
    try {
      if (!mongoose.models[name]) continue;
      const model = mongoose.model(name);
      const paths = model.schema.paths;
      const fields = [];

      for (const [pathKey, pathObj] of Object.entries(paths)) {
        if (['__v', '_id', 'removed', 'isClient'].includes(pathKey)) continue;
        let instance = pathObj.instance || 'String';
        if (pathObj.enumValues && pathObj.enumValues.length > 0) {
          instance += ` [${pathObj.enumValues.join('|')}]`;
        }
        fields.push(`${pathKey}: ${instance}`);
      }
      summaries.push(`- ${name}: { ${fields.join(', ')} }`);
    } catch (e) {
      // Model not registered yet
    }
  }

  return summaries.length > 0
    ? `\n### Auto-Generated Database Model Schemas:\n` + summaries.join('\n')
    : '';
}

module.exports = { generateCompactSchemaSummary };
