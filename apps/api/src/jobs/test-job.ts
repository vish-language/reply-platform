import { aiReplyQueue } from "./queues/ai-reply.queue.js";

const commentId = "cmsobdfof0000mci9zmwehc98";

await aiReplyQueue.add("generate-reply", {
  commentId,
});

await aiReplyQueue.add("generate-reply", {
  commentId,
});

console.log("Two jobs added");

process.exit(0);