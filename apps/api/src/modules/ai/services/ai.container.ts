import { AIService } from "./ai.service.js";
import { OpenRouterProvider } from "../providers/openrouter.provider.js";

const provider = new OpenRouterProvider();

export const aiService = new AIService(provider);
