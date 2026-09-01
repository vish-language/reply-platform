import "express";

import type { AccessTokenPayload } from "../common/types/auth.js";
import type { Membership } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    user: AccessTokenPayload;
    membership: Membership;
    rawBody?: Buffer;
  }
}

export {};
