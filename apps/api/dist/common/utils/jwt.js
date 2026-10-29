import jwt from "jsonwebtoken";
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return secret;
}
function getJwtExpiresIn() {
    return (process.env.JWT_EXPIRES_IN ?? "15m");
}
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
export function verifyAccessToken(token) {
    const payload = jwt.verify(token, getJwtSecret());
    if (typeof payload === "string" || !("userId" in payload)) {
        throw new Error("Invalid access token payload");
    }
    return payload;
}
//# sourceMappingURL=jwt.js.map