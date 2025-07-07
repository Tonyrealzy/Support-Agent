import dotenv from "dotenv";

dotenv.config();

export const config = {
  app: {
    port: process.env.PORT || 4000,
    env: process.env.NODE_ENV || "development",
  },
  db: {
    uri: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "",
    expiresIn: `${process.env.JWT_EXPIRATION || 15}Minutes`,
  },
  mail: {
    sender: process.env.MAIL_SENDER,
    smtpHost: process.env.MAIL_SMTP_HOST,
    smtpUser: process.env.MAIL_SMTP_USERNAME,
    smtpPass: process.env.MAIL_SMTP_PASSWORD,
  },
  thirdParty: {
    brevoKey: process.env.BREVO_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
  },
};
