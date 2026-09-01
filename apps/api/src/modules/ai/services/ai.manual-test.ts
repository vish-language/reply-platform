import { aiService } from "./ai.container.js";

const result = await aiService.generateReply({
  organizationId: "manual-test-organization",
  comment: "Your product is amazing!",
});

console.log(result);
