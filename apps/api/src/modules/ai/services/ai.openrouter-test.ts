import "dotenv/config";

import { OpenRouterProvider }
from "../providers/openrouter.provider.js";


const provider =
  new OpenRouterProvider();


const result =
  await provider.generateReply({
    comment:
      "I love your product!",
    tone:
      "professional",
    language:
      "English",
    instructions:
      "Keep it short.",
  });


console.log(result);