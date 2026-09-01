import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export function errorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof ApiError) {
        return ApiResponse.error(
            res,
            err.message,
            err.statusCode,
            err.errors
        );
    }

    console.error(err);

    return ApiResponse.error(
        res,
        "Internal Server Error",
        500
    );
}