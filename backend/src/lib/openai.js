const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.MIMO_API_KEY,
  baseURL: process.env.MIMO_BASE_URL,
})

module.exports = openai
