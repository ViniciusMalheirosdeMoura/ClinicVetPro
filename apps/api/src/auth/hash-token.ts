
import { createHash } from "node:crypto";

export function hashToken(token: string) {
    const hash = createHash("sha256")
        .update(token)
        .digest("hex");

    return hash;
}