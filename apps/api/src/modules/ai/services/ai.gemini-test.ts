import "dotenv/config";

console.log(
  "Gemini key loaded:",
  process.env.GEMINI_API_KEY?.slice(0, 8)
);