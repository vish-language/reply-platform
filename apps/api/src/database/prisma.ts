import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { env } from "../config/env.js";

const adapter = new PrismaMariaDb({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,

  connectionLimit: 5,
});

export const prisma = new PrismaClient({
  adapter,
});



