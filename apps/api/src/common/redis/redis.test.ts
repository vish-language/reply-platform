import { redis } from "./redis.client.js";

async function test() {
  const result = await redis.ping();

  console.log("Redis:", result);

  await redis.quit();
}

test();