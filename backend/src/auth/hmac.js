import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.EMAIL_SECRET_KEY;

export const hashEmailHMAC = (email) => {
    return crypto
        .createHmac("sha256", secretKey)
        .update(email)
        .digest("hex");
};
