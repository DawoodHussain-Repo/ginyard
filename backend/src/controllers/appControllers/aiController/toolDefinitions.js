/**
 * Combined Groq tool definitions.
 * Modularized under tools/ for clean separation of concerns (< 250 LOC rule).
 */

const { QUERY_TOOL_DEFINITIONS } = require('./tools/queryDefinitions');
const { CREATE_PROPOSAL_DEFINITIONS } = require('./tools/createProposalDefinitions');
const { UPDATE_PROPOSAL_DEFINITIONS } = require('./tools/updateProposalDefinitions');

const TOOL_DEFINITIONS = [
  ...QUERY_TOOL_DEFINITIONS,
  ...CREATE_PROPOSAL_DEFINITIONS,
  ...UPDATE_PROPOSAL_DEFINITIONS,
];

module.exports = { TOOL_DEFINITIONS };
