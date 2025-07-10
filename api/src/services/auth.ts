import { addMinutes, isAfter } from "date-fns";
import db from "../config/database/database";
import { ChangePasswordReq, UserReq } from "../models/requests";
import { hashPassword, verifyPassword } from "../utils/hash";
import { OTP_EXPIRY_MINUTES, OtpService } from "./otp";
import { User } from "../models";
import { MailService } from "./mail";

export const AuthService = {
  signUp: async (data: UserReq) => {
    const existing = await db.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(data.password);
    await db.user.create({
      data: { ...data, password: hashedPassword, roleId: 1, role: "ADMIN" },
    });

    await OtpService.sendOtp(data.email);
    return { message: "User created. OTP sent to email." };
  },

  sendResetOtp: async (email: string) => {
    const otp = OtpService.generateOtp();
    const expiresAt = addMinutes(new Date(), OTP_EXPIRY_MINUTES);
    const existingUser: User = await db.user.findUnique({
      where: { email: email },
    });
    if (!existingUser) {
      throw new Error("User not found");
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

    await MailService.sendResetOTPMail({ email, name: existingUser.name, otp });
    return { message: "OTP sent successfully." };
  },

  resetPassword: async (data: ChangePasswordReq) => {
    const existingUser: User = await db.user.findUnique({
      where: { email: data.email },
    });
    if (!existingUser) {
      throw new Error("User not found");
    }

    const verificationExists = await db.emailVerification.findUnique({
      where: { email: data.email },
    });
    if (!verificationExists) throw new Error("No OTP request found");
    if (verificationExists.isUsed) throw new Error("OTP already used");
    if (isAfter(new Date(), verificationExists.expiresAt))
      throw new Error("OTP expired");
    if (verificationExists.otp !== data.otp) throw new Error("Invalid OTP");

    await db.emailVerification.update({
      where: { userId: existingUser.id },
      data: { isUsed: true },
    });

    const isSimilar = await verifyPassword(
      data.password,
      existingUser.password
    );
    if (isSimilar)
      throw new Error(
        "New password cannot be the same as the current password."
      );
    const hashedPassword = await hashPassword(data.password);

    await db.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    return { message: "Password reset successfully." };
  },

  login: async () => {},
};
