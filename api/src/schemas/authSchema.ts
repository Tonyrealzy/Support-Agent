import { z } from "zod";

export const AuthSchema = {
  login: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "A valid email is required" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
  }),

  sendResetOtp: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "A valid email is required" }),
  }),

  changePassword: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "A valid email is required" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    otp: z
      .string({ required_error: "OTP is required" })
      .min(6, { message: "OTP must be 6 characters long" }),
  }),

  verifyOTP: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "A valid email is required" }),
    otp: z
      .string({ required_error: "OTP is required" })
      .min(6, { message: "OTP must be 6 characters long" }),
  }),

  signup: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "A valid email is required" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    name: z
      .string({ required_error: "Organisation name is required" })
      .min(3, { message: "Name must be at least 3 characters long" }),
  }),
};

export type LoginType = z.infer<typeof AuthSchema.login>;
export type SignupType = z.infer<typeof AuthSchema.signup>;
export type ChangePasswordType = z.infer<typeof AuthSchema.changePassword>;
export type SendResetOtpType = z.infer<typeof AuthSchema.sendResetOtp>;
export type VerifyOTPType = z.infer<typeof AuthSchema.verifyOTP>;
