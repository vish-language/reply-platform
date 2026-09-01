import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ApiError(401, "Authentication header missing");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Invalid authentication token format");
  }
  const token = authHeader.substring(7);

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token");
  }
}
