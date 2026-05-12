import dotenv from "dotenv";

dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/omcyclestore",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  jwt: {
    secret: process.env.JWT_SECRET || "change-me-in-production",
    expire: process.env.JWT_EXPIRE || "7d",
    cookieExpireDays: Number(process.env.JWT_COOKIE_EXPIRE_DAYS) || 7,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || "omcyclestore",
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },
  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    fromEmail: process.env.FROM_EMAIL || "noreply@omcyclestore.local",
    fromName: process.env.FROM_NAME || "Om Cycle Store",
  },
  security: {
    bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  },
  app: {
    name: process.env.APP_NAME || "Om Cycle Store",
    baseUrl: process.env.APP_BASE_URL || "http://localhost:5000",
    defaultCurrency: process.env.DEFAULT_CURRENCY || "INR",
  },
};

export default config;
