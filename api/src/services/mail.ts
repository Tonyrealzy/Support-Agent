import { sendMail } from "../config/mail/mailer";
import {
  renderAccountConfirmationEmail,
  renderPasswordResetEmail,
} from "../config/mail/renderTemplate";
import { SendOtpReq } from "../models/requests";
import { OTP_EXPIRY_MINUTES } from "./otp";

export const MailService = {
  sendOTPMail: async (data: SendOtpReq) => {
    const confirmAcctContent = renderAccountConfirmationEmail({
      username: data.name,
      otp: data.otp,
      otpExpiry: OTP_EXPIRY_MINUTES,
      appName: "Support Agent",
      year: new Date().getFullYear(),
    });
    return await sendMail(
      "Confirm Your Account",
      data.email,
      confirmAcctContent
    );
  },

  sendResetOTPMail: async (data: SendOtpReq) => {
    const confirmAcctContent = renderPasswordResetEmail({
      username: data.name,
      otp: data.otp,
      otpExpiry: OTP_EXPIRY_MINUTES,
      appName: "Support Agent",
      year: new Date().getFullYear(),
    });
    return await sendMail("Password Reset OTP", data.email, confirmAcctContent);
  },
};
