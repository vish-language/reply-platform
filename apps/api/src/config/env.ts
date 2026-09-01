import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  PORT: process.env.PORT || "5000",

  NODE_ENV: process.env.NODE_ENV || "development",

  APP_NAME: process.env.APP_NAME || "Reply Platform API",

  DB_HOST: getEnv("DB_HOST"),

  DB_PORT: getEnv("DB_PORT"),

  DB_USER: getEnv("DB_USER"),

  DB_PASSWORD: getEnv("DB_PASSWORD"),

  DB_NAME: getEnv("DB_NAME"),

  JWT_SECRET: getEnv("JWT_SECRET"),

  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN"),

  DATABASE_URL: getEnv("DATABASE_URL"),

  REDIS_URL: getEnv("REDIS_URL"),

  OPENROUTER_API_KEY: getEnv("OPENROUTER_API_KEY"),

  RAZORPAY_KEY_ID: getEnv("RAZORPAY_KEY_ID"),

  RAZORPAY_KEY_SECRET: getEnv("RAZORPAY_KEY_SECRET"),

  RAZORPAY_WEBHOOK_SECRET: getEnv("RAZORPAY_WEBHOOK_SECRET"),

  RESEND_API_KEY: getEnv("RESEND_API_KEY"),

  EMAIL_FROM: getEnv("EMAIL_FROM"),

  FRONTEND_URL: getEnv("FRONTEND_URL"),
};
