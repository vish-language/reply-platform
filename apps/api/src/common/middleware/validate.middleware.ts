import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate =
    (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation Failed",
                    errors: error.issues,
                });
            }

            next(error);
        }
    };