import { Role } from ".";

export interface UserReq {
  email: string;
  password: string;
  name: string;
}

export interface DocumentReq {
  organisationId: string;
  title: string;
  content: string;
  embedding: number[];
}

export interface SendOtpReq {
  email: string;
  name: string;
  otp: string;
}

export interface OrgReq {
  email: string;
  name: string;
  website: string;
  tier: string;
  phone?: string;
  logoUrl?: string;
  address?: string;
  description?: string;
}

export interface VerifyOTPReq {
  email: string;
  otp: string;
}

export interface ChangePasswordReq {
  email: string;
  otp: string;
  password: string;
}

export interface LoginReq {
  email: string;
  password: string;
}

export interface JwtUserPayload {
  id: string;
  email: string;
  role: string;
  roleId: Role;
}
