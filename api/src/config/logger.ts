import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";
import { config } from "./config";

const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const isDevelopment = config.app.env === "development";
const logLevel = isDevelopment ? "debug" : "info";

const logger = createLogger({
  level: logLevel, // using 'debug' in development
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      (info) =>
        `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`
    )
  ),
  transports: [
    // Write all logs to file
    new transports.File({ filename: path.join(logDir, "app.log") }),

    // Show logs in console (only in non-production)
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) => `[${info.timestamp}] [${info.level}]: ${info.message}`
        )
      ),
    }),
  ],
});

export default logger;
