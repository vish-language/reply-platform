import crypto from "crypto";
export function generateInvitationToken() {
    return crypto.randomBytes(32).toString("hex");
}
//# sourceMappingURL=invitation-token.js.map