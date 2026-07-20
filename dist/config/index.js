import dotenv from "dotenv";
import path from "path";
dotenv.config({
    path: path.join(process.cwd(), ".env")
});
export default {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV || "development",
    database_url: process.env.DATABASE_URL,
    app_url: process.env.APP_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwtAccessExpiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || "1d"),
    jwtRefreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d"),
    // stripe_product_price_id: process.env.STRIPE_PRODUCT_PRICE_ID!,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    stripe_success_url: process.env.STRIPE_SUCCESS_URL,
    stripe_cancel_url: process.env.STRIPE_CANCEL_URL,
};
//# sourceMappingURL=index.js.map