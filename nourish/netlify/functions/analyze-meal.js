const { analyzePhoto, netlifyHandler } = require('../../server/meal-ai');
exports.handler = netlifyHandler(analyzePhoto);
