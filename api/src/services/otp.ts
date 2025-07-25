import { addMinutes, isAfter } from "date-fns";
import db from "../config/database/database";
import { User } from "../models";
import { MailService } from "./mail";
import { VerifyOTPReq } from "../models/requests";
import { AppError } from "../utils/appError";

export const OTP_EXPIRY_MINUTES = 10;
export const MAX_RETRIES = 5;

export const OtpService = {
  generateOtp: () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  sendOtp: async (email: string) => {
    const otp = OtpService.generateOtp();
    const expiresAt = addMinutes(new Date(), OTP_EXPIRY_MINUTES);
    const existingUser: User = await db.user.findUnique({
      where: { email: email },
    });
    if (!existingUser) {
      throw new AppError("User not found", 404);
    }
    await db.emailVerification.upsert({
      where: { email },
      update: {
        name: existingUser.name,
        userId: existingUser.id,
        otp,
        email,
        expiresAt,
        isUsed: false,
        retryCount: 0,
      },
      create: {
        name: existingUser.name,
        userId: existingUser.id,
        otp,
        email,
        expiresAt,
      },
    });

    await MailService.sendOTPMail({ email, name: existingUser.name, otp });
    return { message: "OTP sent successfully." };
  },

  verifyOtp: async (data: VerifyOTPReq) => {
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });
    if (!existingUser) {
      throw new AppError("User not found", 404);
    }

    const verificationExists = await db.emailVerification.findUnique({
      where: { email: data.email },
    });
    if (!verificationExists) throw new AppError("No OTP request found", 404);
    if (verificationExists.isUsed) throw new AppError("OTP already used", 400);
    if (isAfter(new Date(), verificationExists.expiresAt))
      throw new AppError("OTP expired", 400);
    if (verificationExists.otp !== data.otp) throw new AppError("Invalid OTP", 400);

    await db.emailVerification.update({
      where: { userId: existingUser.id },
      data: { isUsed: true },
    });

    await db.user.update({
      where: { id: existingUser.id },
      data: { isActive: true },
    });

    return { message: "Email verified successfully." };
  },

  resendOtp: async (email: string) => {
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      throw new AppError("User not found", 404);
    }

    const otpRecord = await db.emailVerification.findUnique({
      where: { email },
    });
    if (!otpRecord) {
      return await OtpService.sendOtp(email);
    }
    if (otpRecord.retryCount >= MAX_RETRIES)
      throw new AppError("Retry limit reached", 429);

    const otp = OtpService.generateOtp();
    const expiresAt = addMinutes(new Date(), OTP_EXPIRY_MINUTES);

    await db.emailVerification.update({
      where: { userId: existingUser.id },
      data: {
        otp,
        expiresAt,
        retryCount: otpRecord.retryCount + 1,
        isUsed: false,
      },
    });

    await MailService.sendOTPMail({ email, name: existingUser.name, otp });
    return { message: "OTP resent" };
  },
};
