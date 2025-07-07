import nodemailer from "nodemailer";
import { config } from "../config";
import logger from "../logger";

let transporter = nodemailer.createTransport({
  host: config.mail.smtpHost,
  port: 587,
  secure: false,
  auth: {
    user: config.mail.smtpUser,
    pass: config.mail.smtpPass,
  },
});

export const sendMail = async (
  subject: string,
  to: string,
  textContent: string
) => {
  try {
    let info = await transporter.sendMail({
      from: config.mail.sender,
      to: to, // list of receivers
      subject: subject, // Subject line
      text: textContent, // plain text body
    });
    logger.info("Mail sent: %s", info.messageId);
  } catch (error) {
    logger.error("Error sending Mail: %s", error);
  }
};
