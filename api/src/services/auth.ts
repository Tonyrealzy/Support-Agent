import { addMinutes, isAfter, isValid } from "date-fns";
import db from "../config/database/database";
import { ChangePasswordReq, LoginReq, UserReq } from "../models/requests";
import { hashPassword, verifyPassword } from "../utils/hash";
import { OTP_EXPIRY_MINUTES, OtpService } from "./otp";
import { User } from "../models";
import { MailService } from "./mail";
import { JwtAuth } from "../utils/jwt";
import { AppError } from "../utils/appError";

export const AuthService = {
  signUp: async (data: UserReq) => {
    const existing = await db.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new AppError("User already exists", 409);
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

    await MailService.sendResetOTPMail({ email, name: existingUser.name, otp });
    return { message: "OTP sent successfully." };
  },

  resetPassword: async (data: ChangePasswordReq) => {
    const existingUser: User = await db.user.findUnique({
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
    if (verificationExists.otp !== data.otp)
      throw new AppError("Invalid OTP", 400);

    await db.emailVerification.update({
      where: { userId: existingUser.id },
      data: { isUsed: true },
    });

    const isSimilar = await verifyPassword(
      data.password,
      existingUser.password
    );
    if (isSimilar)
      throw new AppError(
        "New password cannot be the same as the current password.",
        409
      );
    const hashedPassword = await hashPassword(data.password);

    await db.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    return { message: "Password reset successfully." };
  },

  login: async (data: LoginReq) => {
    const existingUser: User = await db.user.findUnique({
      where: { email: data.email },
    });
    if (!existingUser) {
      throw new AppError("Invalid login credentials", 400);
    }

    const isSimilar = await verifyPassword(
      data.password,
      existingUser.password
    );
    if (!isSimilar) {
      throw new AppError("Invalid login credentials", 400);
    }

    if (!existingUser.isActive) {
      throw new AppError(
        "Account not activated. Please sign up again to verify your email.",
        400
      );
    }

    await db.userSession.updateMany({
      where: { userId: existingUser.id, isValid: true },
      data: { isValid: false },
    });

    const token = JwtAuth.getSignedToken({
      id: existingUser.id,
      email: data.email,
      role: existingUser.role,
      roleId: existingUser.roleId,
    });
    const expiresAt = addMinutes(new Date(), 15);

    await db.userSession.create({
      data: { userId: existingUser.id, token, expiresAt },
    });

    return {
      message: "User logged in successfully.",
      token,
      user: {
        email: existingUser.email,
        role: existingUser.role,
      },
    };
  },
};
