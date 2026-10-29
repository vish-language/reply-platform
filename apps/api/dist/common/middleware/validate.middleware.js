import { ZodError } from "zod";
export const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    }
    catch (error) {
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
//# sourceMappingURL=validate.middleware.js.map