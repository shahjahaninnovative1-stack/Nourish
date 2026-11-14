const { parseText, netlifyHandler } = require('../../server/meal-ai');
exports.handler = netlifyHandler(parseText);
