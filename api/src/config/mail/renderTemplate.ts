import handlebars from "handlebars";
import path from "path";
import fs from "fs";
import { MailProps } from "../../models/signup";

export const renderPasswordResetEmail = (props: MailProps): string => {
  const filePath = path.join(__dirname, "templates", "passwordReset.hbs");
  const source = fs.readFileSync(filePath, "utf-8");
  const template = handlebars.compile(source);
  return template(props);
};

export const renderAccountConfirmationEmail = (props: MailProps): string => {
  const filePath = path.join(__dirname, "templates", "accountConfirmation.hbs");
  const source = fs.readFileSync(filePath, "utf-8");
  const template = handlebars.compile(source);
  return template(props);
};

// Use it this way in getting the message to be sent to the mailer service
const htmlResetContent = renderPasswordResetEmail({
  username: "Chioma",
  otp: "945521",
  otpExpiry: 10,
  appName: "Support Agent",
  year: new Date().getFullYear(),
});

const htmlConfirmContent = renderAccountConfirmationEmail({
  username: "Chioma",
  otp: "462369",
  otpExpiry: 10,
  appName: "Support Agent",
  year: new Date().getFullYear(),
});
