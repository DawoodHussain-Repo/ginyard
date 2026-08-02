/**
 * Helper utility functions for tool execution date parsing and formatting.
 */

function parseDate(dateStr, defaultOffsetDays) {
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
  }
  const d = new Date();
  d.setDate(d.getDate() + defaultOffsetDays);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

module.exports = {
  parseDate,
  endOfDay,
};
