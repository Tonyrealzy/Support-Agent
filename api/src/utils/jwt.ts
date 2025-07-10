import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { config } from "../config/config";
import { JwtUserPayload } from "../models/requests";

const JWT_SECRET = config.jwt.secret;

export const JwtAuth = {
  // Sign basically the organisationID, role, organisationEmail and any other unique field
  signedToken: (
    payload: JwtUserPayload,
    options: SignOptions = {
      expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
    }
  ): string => {
    return jwt.sign(payload, JWT_SECRET, options);
  },

  verifyPayload: (token: string): JwtPayload => {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  },

  isTokenValid: (token: string): boolean => {
    try {
      jwt.verify(token, JWT_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  },

  getUserClaims: (token: string): JwtPayload | null => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  },
};
