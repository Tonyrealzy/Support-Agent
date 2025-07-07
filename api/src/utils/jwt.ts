import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { config } from "../config/config";

const JWT_SECRET = config.jwt.secret;

// Sign basically the organisationID, role, organisationEmail and any other unique field
export const signedToken = (
  payload: object,
  options: SignOptions = {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  }
): string => {
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyPayload = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const isTokenValid = (token: string): boolean => {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
};

export const getUserClaims = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
