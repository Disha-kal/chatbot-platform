import dotenv from "dotenv";
dotenv.config();   // ensures env is loaded BEFORE OpenAI initializes

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default openai;
