import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import type { AccessTokenPayload } from "../types/auth.js";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

function getJwtExpiresIn(): StringValue {
  return (process.env.JWT_EXPIRES_IN ?? "15m") as StringValue;
}

export const generateAccessToken = (payload: {
  userId: string;
  organizationId: string;
}) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, getJwtSecret());

  if (typeof payload === "string" || !("userId" in payload)) {
    throw new Error("Invalid access token payload");
  }

  return payload as AccessTokenPayload;
}
