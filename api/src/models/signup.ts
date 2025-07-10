export interface EmailVerification {
  id: string;
  userId: string;
  name: string;
  email: string;
  otp: string;
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
  retryCount: number;
}

export interface MailProps {
  username: string;
  otp: string;
  otpExpiry: number;
  appName: string;
  year: number;
}
